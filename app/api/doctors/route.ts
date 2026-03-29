import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Doctor from "@/lib/models/Doctor";
import User from "@/lib/models/User";
import { getNextSequence } from "@/lib/models/Counter";
import { getTokenPayload } from "@/lib/auth";

// GET: list all doctors
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const activeOnly = searchParams.get("active") === "true";

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { doctorId: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }
    if (activeOnly) {
      query.isActive = true;
    }

    const doctors = await Doctor.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ doctors });
  } catch (error: unknown) {
    console.error("Doctors GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: admin creates a doctor
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      age,
      sex,
      specialization,
      department,
      availabilityFrom,
      availabilityTo,
      password,
    } = body;

    if (!name || !phone || !specialization || !department || !availabilityFrom || !availabilityTo || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check duplicate phone/email
    const existing = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        { phone },
      ],
    });
    if (existing) {
      return NextResponse.json({ error: "Phone or email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      role: "doctor",
      email: email?.toLowerCase() || `doc_${phone}@aiims.internal`,
      phone,
      passwordHash,
      isActive: true,
    });

    // Generate doctor ID
    const doctorId = await getNextSequence("doctorId", "DOC-");

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      doctorId,
      name,
      phone,
      age: age || 0,
      sex: sex || "other",
      specialization,
      department,
      availabilityHours: {
        from: availabilityFrom,
        to: availabilityTo,
      },
      isActive: true,
    });

    return NextResponse.json(
      { message: "Doctor created successfully", doctor },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Doctors POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
