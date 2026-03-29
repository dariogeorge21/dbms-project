import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  sex: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    patientId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    sex: { type: String, enum: ["male", "female", "other"], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PatientSchema.index({ name: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ email: 1 });

const Patient: Model<IPatient> =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);

export default Patient;
