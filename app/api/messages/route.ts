import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";
import Patient from "@/lib/models/Patient";
import Doctor from "@/lib/models/Doctor";
import { getTokenPayload } from "@/lib/auth";

// GET: list messages
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const roleFilter = searchParams.get("senderRole");

    const query: Record<string, unknown> = {};

    if (payload.role === "patient") {
      const patient = await Patient.findOne({ userId: payload.userId });
      if (patient) query.senderId = patient._id;
    } else if (payload.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: payload.userId });
      if (doctor) query.senderId = doctor._id;
    }
    // Admin sees all

    if (statusFilter) query.status = statusFilter;
    if (roleFilter) query.senderRole = roleFilter;

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: send message
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role === "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message, messageType } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    let senderId;
    if (payload.role === "patient") {
      const patient = await Patient.findOne({ userId: payload.userId });
      senderId = patient?._id;
    } else {
      const doctor = await Doctor.findOne({ userId: payload.userId });
      senderId = doctor?._id;
    }

    if (!senderId) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const msg = await Message.create({
      senderRole: payload.role,
      senderId,
      senderUserId: payload.userId,
      subject,
      message,
      messageType: messageType || "message",
      status: "new",
    });

    return NextResponse.json({ message: "Message sent", data: msg }, { status: 201 });
  } catch (error: unknown) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
