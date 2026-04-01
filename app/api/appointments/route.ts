import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import Patient from "@/lib/models/Patient";
import Doctor from "@/lib/models/Doctor";
import { getNextSequence } from "@/lib/models/Counter";
import { getTokenPayload } from "@/lib/auth";

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { value: String(error) };
}

function logApiError(operation: string, error: unknown, context: Record<string, unknown> = {}) {
  console.error(`[Appointments API] ${operation}`, {
    timestamp: new Date().toISOString(),
    ...context,
    error: serializeError(error),
  });
}

function toRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toPositiveNumber(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : NaN;
}

let appointmentIndexesSynced = false;
let appointmentIndexesSyncPromise: Promise<void> | null = null;

async function ensureAppointmentIndexes() {
  if (appointmentIndexesSynced) return;

  if (!appointmentIndexesSyncPromise) {
    appointmentIndexesSyncPromise = Appointment.syncIndexes()
      .then(() => {
        appointmentIndexesSynced = true;
      })
      .finally(() => {
        appointmentIndexesSyncPromise = null;
      });
  }

  await appointmentIndexesSyncPromise;
}

// GET: list appointments filtered by role
export async function GET(request: NextRequest) {
  let payload: Awaited<ReturnType<typeof getTokenPayload>> | null = null;
  const filters: Record<string, string | null> = {
    status: null,
    dateFrom: null,
    dateTo: null,
  };

  try {
    await dbConnect();
    payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    filters.status = status;
    filters.dateFrom = dateFrom;
    filters.dateTo = dateTo;

    const query: Record<string, unknown> = {};

    // Role-based filtering
    if (payload.role === "patient") {
      const patient = await Patient.findOne({ userId: payload.userId });
      if (!patient) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      query.patientId = patient._id;
    } else if (payload.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: payload.userId });
      if (!doctor) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      query.doctorId = doctor._id;
    }
    // Admin sees all

    if (status) query.status = status;
    if (dateFrom || dateTo) {
      query.appointmentDate = {};
      if (dateFrom) (query.appointmentDate as Record<string, unknown>).$gte = new Date(dateFrom);
      if (dateTo) (query.appointmentDate as Record<string, unknown>).$lte = new Date(dateTo);
    }

    const appointments = await Appointment.find(query)
      .populate("doctorId", "name doctorId specialization department")
      .populate("patientId", "name patientId email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ appointments });
  } catch (error: unknown) {
    logApiError("GET /api/appointments failed", error, {
      method: request.method,
      url: request.url,
      userId: payload?.userId,
      role: payload?.role,
      filters,
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: patient creates an appointment
export async function POST(request: NextRequest) {
  let payload: Awaited<ReturnType<typeof getTokenPayload>> | null = null;
  let requestMeta: Record<string, unknown> = {};

  try {
    await dbConnect();
    payload = await getTokenPayload();
    if (!payload || payload.role !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patient = await Patient.findOne({ userId: payload.userId });
    if (!patient) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const age = toPositiveNumber(body.age);
    const weight = toPositiveNumber(body.weight);
    const height = toPositiveNumber(body.height);
    const location = toRequiredString(body.location);
    const sex = toRequiredString(body.sex).toLowerCase();
    const bystanderName = toRequiredString(body.bystanderName);
    const bystanderPhone = toRequiredString(body.bystanderPhone);
    const problemDescription = toRequiredString(body.problemDescription);
    const previousMedicalHistory = toRequiredString(body.previousMedicalHistory);
    const preferredDoctorIdRaw = toRequiredString(body.preferredDoctorId);
    const preferredTimeSlot = toRequiredString(body.preferredTimeSlot).toLowerCase();

    requestMeta = {
      hasPreferredDoctorId: Boolean(preferredDoctorIdRaw),
      preferredTimeSlot,
      hasProblemDescription: Boolean(problemDescription),
      hasPreviousMedicalHistory: Boolean(previousMedicalHistory),
    };

    // Validation
    if (
      Number.isNaN(age) ||
      Number.isNaN(weight) ||
      Number.isNaN(height) ||
      !location ||
      !sex ||
      !bystanderName ||
      !bystanderPhone ||
      !problemDescription ||
      !previousMedicalHistory ||
      !preferredTimeSlot
    ) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    if (!['morning', 'afternoon'].includes(preferredTimeSlot)) {
      return NextResponse.json({ error: "Preferred time slot must be morning or afternoon" }, { status: 400 });
    }

    if (!['male', 'female', 'other'].includes(sex)) {
      return NextResponse.json({ error: "Sex must be male, female, or other" }, { status: 400 });
    }

    if (preferredDoctorIdRaw && !mongoose.Types.ObjectId.isValid(preferredDoctorIdRaw)) {
      return NextResponse.json({ error: "Invalid preferred doctor id" }, { status: 400 });
    }

    const preferredDoctorId = preferredDoctorIdRaw
      ? new mongoose.Types.ObjectId(preferredDoctorIdRaw)
      : null;

    await ensureAppointmentIndexes();

    const appointmentId = await getNextSequence("appointmentId", "APT-");

    const appointment = await Appointment.create({
      appointmentId,
      patientId: patient._id,
      patientUserId: patient.userId,
      doctorId: null,
      preferredDoctorId: preferredDoctorId || null,
      patientName: patient.name,
      age,
      weight,
      height,
      location,
      sex,
      bystanderName,
      bystanderPhone,
      problemDescription,
      previousMedicalHistory,
      preferredTimeSlot,
      status: "requested",
    });

    return NextResponse.json(
      { message: "Appointment requested successfully", appointment },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      logApiError("POST /api/appointments validation failed", error, {
        method: request.method,
        url: request.url,
        userId: payload?.userId,
        role: payload?.role,
        requestMeta,
      });
      return NextResponse.json({ error: "Invalid appointment data" }, { status: 400 });
    }

    if (error instanceof mongoose.Error.CastError) {
      logApiError("POST /api/appointments cast failed", error, {
        method: request.method,
        url: request.url,
        userId: payload?.userId,
        role: payload?.role,
        requestMeta,
      });
      return NextResponse.json({ error: "Invalid request fields" }, { status: 400 });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      logApiError("POST /api/appointments duplicate key", error, {
        method: request.method,
        url: request.url,
        userId: payload?.userId,
        role: payload?.role,
        requestMeta,
      });
      return NextResponse.json({ error: "Duplicate appointment data" }, { status: 409 });
    }

    logApiError("POST /api/appointments failed", error, {
      method: request.method,
      url: request.url,
      userId: payload?.userId,
      role: payload?.role,
      requestMeta,
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
