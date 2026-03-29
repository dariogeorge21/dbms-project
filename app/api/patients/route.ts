import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";
import { getTokenPayload } from "@/lib/auth";

// GET: list patients (admin) or get own profile (patient)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (payload.role === "admin") {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get("search") || "";
      const query = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { patientId: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { phone: { $regex: search, $options: "i" } },
            ],
          }
        : {};
      const patients = await Patient.find(query).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ patients });
    }

    // Patient gets own profile
    const patient = await Patient.findOne({ userId: payload.userId }).lean();
    if (!patient) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json({ patient });
  } catch (error: unknown) {
    console.error("Patients GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: update patient profile
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, patientObjectId } = body;

    let patient;
    if (payload.role === "admin" && patientObjectId) {
      patient = await Patient.findById(patientObjectId);
    } else {
      patient = await Patient.findOne({ userId: payload.userId });
    }

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Update allowed fields
    if (name) patient.name = name;
    if (email) {
      patient.email = email.toLowerCase();
      await User.findByIdAndUpdate(patient.userId, { email: email.toLowerCase() });
    }
    if (phone) {
      patient.phone = phone;
      await User.findByIdAndUpdate(patient.userId, { phone });
    }

    await patient.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      patient,
    });
  } catch (error: unknown) {
    console.error("Patients PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
