import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Doctor from "@/lib/models/Doctor";
import User from "@/lib/models/User";
import { getTokenPayload } from "@/lib/auth";

// GET single doctor
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const doctor = await Doctor.findById(id).lean();
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const user = await User.findById(doctor.userId).select("email").lean();
    return NextResponse.json({ doctor: { ...doctor, email: user?.email || "" } });
  } catch (error: unknown) {
    console.error("Doctor GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: admin update doctor
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
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const user = await User.findById(doctor.userId);
    if (!user) {
      return NextResponse.json({ error: "Linked doctor account not found" }, { status: 404 });
    }

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
      isActive,
      password,
    } = body;

    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : undefined;

    if (normalizedEmail) {
      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });
      if (existingEmail) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
      user.email = normalizedEmail;
    }

    if (phone) {
      const existingPhone = await User.findOne({
        phone,
        _id: { $ne: user._id },
      });
      if (existingPhone) {
        return NextResponse.json({ error: "Phone already in use" }, { status: 409 });
      }
    }

    if (name) doctor.name = name;
    if (phone) {
      doctor.phone = phone;
      user.phone = phone;
    }
    if (typeof age === "number") doctor.age = age;
    if (sex) doctor.sex = sex;
    if (specialization) doctor.specialization = specialization;
    if (department) doctor.department = department;
    if (availabilityFrom && availabilityTo) {
      doctor.availabilityHours = { from: availabilityFrom, to: availabilityTo };
    }
    if (typeof isActive === "boolean") {
      doctor.isActive = isActive;
      user.isActive = isActive;
    }

    if (typeof password === "string" && password.trim().length > 0) {
      user.passwordHash = await bcrypt.hash(password.trim(), 12);
    }

    await user.save();
    await doctor.save();
    return NextResponse.json({ message: "Doctor updated", doctor });
  } catch (error: unknown) {
    console.error("Doctor PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: admin deactivate doctor
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
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    doctor.isActive = false;
    await doctor.save();
    await User.findByIdAndUpdate(doctor.userId, { isActive: false });

    return NextResponse.json({ message: "Doctor deactivated" });
  } catch (error: unknown) {
    console.error("Doctor DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
