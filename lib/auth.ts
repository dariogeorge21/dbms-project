import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "./db";
import User from "./models/User";
import Patient from "./models/Patient";
import Doctor from "./models/Doctor";

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_NAME = "aiims_token";

export interface JwtPayload {
  userId: string;
  role: "patient" | "doctor" | "admin";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(payload: JwtPayload) {
  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  await dbConnect();
  const user = await User.findById(payload.userId).lean();
  if (!user || !user.isActive) return null;

  let profile = null;
  if (user.role === "patient") {
    profile = await Patient.findOne({ userId: user._id }).lean();
  } else if (user.role === "doctor") {
    profile = await Doctor.findOne({ userId: user._id }).lean();
  }

  return {
    user: { ...user, _id: user._id.toString() },
    profile: profile
      ? { ...profile, _id: profile._id.toString(), userId: profile.userId.toString() }
      : null,
  };
}

export async function getTokenPayload(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
