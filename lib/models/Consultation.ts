import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

export interface IVitalSigns {
  bloodPressure: string;
  pulse: number;
  temperature: string;
  spo2: string;
  respiratoryRate: number;
  weight: number;
  height: number;
}

export interface IConsultation extends Document {
  appointmentId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  vitalSigns: IVitalSigns;
  diagnosis: string;
  description: string;
  medicines: IMedicine[];
  nextReviewDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const VitalSignsSchema = new Schema<IVitalSigns>(
  {
    bloodPressure: { type: String, default: "" },
    pulse: { type: Number, default: 0 },
    temperature: { type: String, default: "" },
    spo2: { type: String, default: "" },
    respiratoryRate: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  { _id: false }
);

const ConsultationSchema = new Schema<IConsultation>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    vitalSigns: { type: VitalSignsSchema, default: () => ({}) },
    diagnosis: { type: String, required: true },
    description: { type: String, default: "" },
    medicines: { type: [MedicineSchema], default: [] },
    nextReviewDate: { type: Date, default: null },
  },
  { timestamps: true }
);

ConsultationSchema.index({ doctorId: 1 });
ConsultationSchema.index({ patientId: 1 });
ConsultationSchema.index({ nextReviewDate: 1 });

const Consultation: Model<IConsultation> =
  mongoose.models.Consultation ||
  mongoose.model<IConsultation>("Consultation", ConsultationSchema);

export default Consultation;
