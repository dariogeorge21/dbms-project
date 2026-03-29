import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import Patient from "@/lib/models/Patient";
import Doctor from "@/lib/models/Doctor";
import { getNextSequence } from "@/lib/models/Counter";
import { getTokenPayload } from "@/lib/auth";

// GET: list appointments filtered by role
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const query: Record<string, unknown> = {};

    // Role-based filtering
    if (payload.role === "patient") {
      const patient = await Patient.findOne({ userId: payload.userId });
      if (!patient) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      query.patientId = patient._id;
    } else if (payload.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: payload.userId });
      if (!doctor) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      query.doctorId = doctor._id;
    }
    // Admin sees all

    if (status) query.status = status;
    if (dateFrom || dateTo) {
      query.appointmentDate = {};
      if (dateFrom) (query.appointmentDate as Record<string, unknown>).$gte = new Date(dateFrom);
      if (dateTo) (query.appointmentDate as Record<string, unknown>).$lte = new Date(dateTo);
    }

    const appointments = await Appointment.find(query)
      .populate("doctorId", "name doctorId specialization department")
      .populate("patientId", "name patientId email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ appointments });
  } catch (error: unknown) {
    console.error("Appointments GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: patient creates an appointment
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patient = await Patient.findOne({ userId: payload.userId });
    if (!patient) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      age, weight, height, location, sex,
      bystanderName, bystanderPhone,
      problemDescription, previousMedicalHistory,
      preferredDoctorId, preferredTimeSlot,
    } = body;

    // Validation
    if (!age || !weight || !height || !location || !sex || !bystanderName || !bystanderPhone || !problemDescription || !previousMedicalHistory || !preferredTimeSlot) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    const appointmentId = await getNextSequence("appointmentId", "APT-");

    const appointment = await Appointment.create({
      appointmentId,
      patientId: patient._id,
      patientUserId: patient.userId,
      doctorId: null,
      preferredDoctorId: preferredDoctorId || null,
      patientName: patient.name,
      age,
      weight,
      height,
      location,
      sex,
      bystanderName,
      bystanderPhone,
      problemDescription,
      previousMedicalHistory,
      preferredTimeSlot,
      status: "requested",
    });

    return NextResponse.json(
      { message: "Appointment requested successfully", appointment },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Appointments POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
