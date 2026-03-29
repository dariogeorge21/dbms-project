import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import { getNextSequence } from "@/lib/models/Counter";
import { getTokenPayload } from "@/lib/auth";

// POST: admin assigns a doctor to an appointment
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, doctorId, assignedTimeSlot, appointmentDate } = body;

    if (!appointmentId || !doctorId || !assignedTimeSlot || !appointmentDate) {
      return NextResponse.json(
        { error: "Appointment ID, Doctor, Time Slot, and Date are required" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Generate token number
    const tokenNumber = await getNextSequence("tokenNumber", "TKN-");

    appointment.doctorId = doctorId;
    appointment.assignedTimeSlot = assignedTimeSlot;
    appointment.appointmentDate = new Date(appointmentDate);
    appointment.tokenNumber = tokenNumber;
    appointment.status = "assigned";
    appointment.assignedBy = payload.userId as unknown as typeof appointment.assignedBy;
    appointment.assignedAt = new Date();

    await appointment.save();

    return NextResponse.json({
      message: "Appointment assigned successfully",
      appointment,
      tokenNumber,
    });
  } catch (error: unknown) {
    console.error("Assignment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
