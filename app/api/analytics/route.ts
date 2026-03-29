import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import Patient from "@/lib/models/Patient";
import Doctor from "@/lib/models/Doctor";
import Consultation from "@/lib/models/Consultation";
import Message from "@/lib/models/Message";
import { getTokenPayload } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await getTokenPayload();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "weekly";

    // Overall counts
    const totalPatients = await Patient.countDocuments();
    const activePatients = await Patient.countDocuments({ isActive: true });
    const totalDoctors = await Doctor.countDocuments();
    const activeDoctors = await Doctor.countDocuments({ isActive: true });
    const totalAppointments = await Appointment.countDocuments();
    const totalConsultations = await Consultation.countDocuments();
    const totalMessages = await Message.countDocuments();
    const newMessages = await Message.countDocuments({ status: "new" });

    // Appointment status breakdown
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Daily appointments for charts (last 7 or 30 days)
    const days = period === "daily" ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyAppointments = await Appointment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Doctor workload
    const doctorWorkload = await Appointment.aggregate([
      { $match: { doctorId: { $ne: null } } },
      {
        $group: {
          _id: "$doctorId",
          appointmentCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          doctorName: "$doctor.name",
          doctorId: "$doctor.doctorId",
          specialization: "$doctor.specialization",
          appointmentCount: 1,
          completedCount: 1,
        },
      },
      { $sort: { appointmentCount: -1 } },
    ]);

    // Top patients by visits
    const patientVisits = await Appointment.aggregate([
      {
        $group: {
          _id: "$patientId",
          visitCount: { $sum: 1 },
        },
      },
      { $sort: { visitCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      { $unwind: "$patient" },
      {
        $project: {
          patientName: "$patient.name",
          patientId: "$patient.patientId",
          visitCount: 1,
        },
      },
    ]);

    return NextResponse.json({
      overview: {
        totalPatients,
        activePatients,
        totalDoctors,
        activeDoctors,
        totalAppointments,
        totalConsultations,
        totalMessages,
        newMessages,
      },
      appointmentsByStatus,
      dailyAppointments,
      doctorWorkload,
      patientVisits,
    });
  } catch (error: unknown) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
