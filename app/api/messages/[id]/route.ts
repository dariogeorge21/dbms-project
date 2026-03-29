import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";
import { getTokenPayload } from "@/lib/auth";

// PUT: admin updates message status
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
    const { status } = body;

    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (status) message.status = status;
    await message.save();

    return NextResponse.json({ message: "Message updated", data: message });
  } catch (error: unknown) {
    console.error("Message PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
