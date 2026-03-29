import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json({ doctor });
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

    const { name, phone, age, sex, specialization, department, availabilityFrom, availabilityTo, isActive } = body;

    if (name) doctor.name = name;
    if (phone) {
      doctor.phone = phone;
      await User.findByIdAndUpdate(doctor.userId, { phone });
    }
    if (age) doctor.age = age;
    if (sex) doctor.sex = sex;
    if (specialization) doctor.specialization = specialization;
    if (department) doctor.department = department;
    if (availabilityFrom && availabilityTo) {
      doctor.availabilityHours = { from: availabilityFrom, to: availabilityTo };
    }
    if (typeof isActive === "boolean") {
      doctor.isActive = isActive;
      await User.findByIdAndUpdate(doctor.userId, { isActive });
    }

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
