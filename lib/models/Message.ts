import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  senderRole: "patient" | "doctor";
  senderId: mongoose.Types.ObjectId;
  senderUserId: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  messageType: "report" | "message";
  status: "new" | "read" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderRole: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderRole" === "patient" ? "Patient" : "Doctor",
    },
    senderUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    messageType: {
      type: String,
      enum: ["report", "message"],
      default: "message",
    },
    status: {
      type: String,
      enum: ["new", "read", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

MessageSchema.index({ senderRole: 1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ status: 1 });
MessageSchema.index({ createdAt: -1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
