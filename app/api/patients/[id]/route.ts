import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";
import { getTokenPayload } from "@/lib/auth";

// GET single patient by ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const patient = await Patient.findById(id).lean();
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error: unknown) {
    console.error("Patient GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: admin update patient
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, isActive, resetPassword } = body;

    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    if (name) patient.name = name;
    if (email) {
      patient.email = email.toLowerCase();
      await User.findByIdAndUpdate(patient.userId, { email: email.toLowerCase() });
    }
    if (phone) {
      patient.phone = phone;
      await User.findByIdAndUpdate(patient.userId, { phone });
    }
    if (typeof isActive === "boolean") {
      patient.isActive = isActive;
      await User.findByIdAndUpdate(patient.userId, { isActive });
    }
    if (resetPassword) {
      const passwordHash = await bcrypt.hash(resetPassword, 12);
      await User.findByIdAndUpdate(patient.userId, { passwordHash });
    }

    await patient.save();
    return NextResponse.json({ message: "Patient updated", patient });
  } catch (error: unknown) {
    console.error("Patient PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: admin delete patient
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Soft delete: deactivate instead of removing
    patient.isActive = false;
    await patient.save();
    await User.findByIdAndUpdate(patient.userId, { isActive: false });

    return NextResponse.json({ message: "Patient deactivated" });
  } catch (error: unknown) {
    console.error("Patient DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
