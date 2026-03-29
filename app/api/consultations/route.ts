import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Consultation from "@/lib/models/Consultation";
import Appointment from "@/lib/models/Appointment";
import Doctor from "@/lib/models/Doctor";
import { getTokenPayload } from "@/lib/auth";

// GET: list consultations
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("appointmentId");

    const query: Record<string, unknown> = {};

    if (payload.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: payload.userId });
      if (doctor) query.doctorId = doctor._id;
    }
    if (appointmentId) query.appointmentId = appointmentId;

    const consultations = await Consultation.find(query)
      .populate("appointmentId")
      .populate("patientId", "name patientId")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ consultations });
  } catch (error: unknown) {
    console.error("Consultations GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: doctor creates consultation
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctor = await Doctor.findOne({ userId: payload.userId });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const { appointmentId, vitalSigns, diagnosis, description, medicines, nextReviewDate } = body;

    if (!appointmentId || !diagnosis) {
      return NextResponse.json(
        { error: "Appointment ID and diagnosis are required" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Check if consultation already exists
    const existing = await Consultation.findOne({ appointmentId });
    if (existing) {
      return NextResponse.json({ error: "Consultation already exists for this appointment" }, { status: 409 });
    }

    const consultation = await Consultation.create({
      appointmentId,
      doctorId: doctor._id,
      patientId: appointment.patientId,
      vitalSigns: vitalSigns || {},
      diagnosis,
      description: description || "",
      medicines: medicines || [],
      nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null,
    });

    // Update appointment status
    appointment.status = "completed";
    await appointment.save();

    return NextResponse.json(
      { message: "Consultation recorded successfully", consultation },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Consultation POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
