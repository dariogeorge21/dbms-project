import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: string;
  name: string;
  phone: string;
  age: number;
  sex: string;
  specialization: string;
  department: string;
  availabilityHours: {
    from: string;
    to: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    doctorId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    sex: { type: String, enum: ["male", "female", "other"], required: true },
    specialization: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    availabilityHours: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DoctorSchema.index({ department: 1 });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ isActive: 1 });

const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);

export default Doctor;
