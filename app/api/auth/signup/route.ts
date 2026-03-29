import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Patient from "@/lib/models/Patient";
import { getNextSequence } from "@/lib/models/Counter";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, phone, dob, sex, password } = body;

    // Validation
    if (!name || !email || !phone || !dob || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check duplicates
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email or phone already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      role: "patient",
      email: email.toLowerCase(),
      phone,
      passwordHash,
      isActive: true,
    });

    // Generate patient ID
    const patientId = await getNextSequence("patientId", "PAT-");

    // Create patient profile
    const patient = await Patient.create({
      userId: user._id,
      patientId,
      name,
      email: email.toLowerCase(),
      phone,
      dob: new Date(dob),
      sex: sex || "other",
      isActive: true,
    });

    // Set auth cookie
    await setAuthCookie({ userId: user._id.toString(), role: "patient" });

    return NextResponse.json(
      {
        message: "Registration successful",
        patientId: patient.patientId,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
