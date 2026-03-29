import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Consultation from "@/lib/models/Consultation";
import { getTokenPayload } from "@/lib/auth";

// GET single consultation
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const consultation = await Consultation.findById(id)
      .populate("appointmentId")
      .populate("patientId", "name patientId email phone")
      .populate("doctorId", "name doctorId specialization")
      .lean();

    if (!consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }
    return NextResponse.json({ consultation });
  } catch (error: unknown) {
    console.error("Consultation GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: update consultation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { vitalSigns, diagnosis, description, medicines, nextReviewDate } = body;

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }

    if (vitalSigns) consultation.vitalSigns = vitalSigns;
    if (diagnosis) consultation.diagnosis = diagnosis;
    if (description !== undefined) consultation.description = description;
    if (medicines) consultation.medicines = medicines;
    if (nextReviewDate) consultation.nextReviewDate = new Date(nextReviewDate);

    await consultation.save();
    return NextResponse.json({ message: "Consultation updated", consultation });
  } catch (error: unknown) {
    console.error("Consultation PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
