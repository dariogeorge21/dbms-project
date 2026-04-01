import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  appointmentId: string;
  patientId: mongoose.Types.ObjectId;
  patientUserId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId | null;
  preferredDoctorId: mongoose.Types.ObjectId | null;
  patientName: string;
  age: number;
  weight: number;
  height: number;
  location: string;
  sex: string;
  bystanderName: string;
  bystanderPhone: string;
  problemDescription: string;
  previousMedicalHistory: string;
  preferredTimeSlot: "morning" | "afternoon";
  assignedTimeSlot: string | null;
  tokenNumber: string | null;
  status: "requested" | "assigned" | "in_consultation" | "completed" | "cancelled";
  appointmentDate: Date | null;
  assignedBy: mongoose.Types.ObjectId | null;
  assignedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    preferredDoctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    // Snapshot fields
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    location: { type: String, required: true },
    sex: { type: String, required: true },
    bystanderName: { type: String, required: true },
    bystanderPhone: { type: String, required: true },
    problemDescription: { type: String, required: true },
    previousMedicalHistory: { type: String, required: true },
    preferredTimeSlot: {
      type: String,
      enum: ["morning", "afternoon"],
      required: true,
    },
    assignedTimeSlot: { type: String, default: null },
    tokenNumber: { type: String, default: null },
    status: {
      type: String,
      enum: ["requested", "assigned", "in_consultation", "completed", "cancelled"],
      default: "requested",
    },
    appointmentDate: { type: Date, default: null },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ doctorId: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ appointmentDate: 1 });
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1, assignedTimeSlot: 1 });
AppointmentSchema.index(
  { tokenNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      tokenNumber: { $type: "string" },
    },
  }
);

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
