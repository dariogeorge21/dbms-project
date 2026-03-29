import dbConnect from "../lib/db";
import User from "../lib/models/User";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  await dbConnect();

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin already exists:", existingAdmin.email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await User.create({
    role: "admin",
    email: "admin@aiims.edu",
    phone: "9999999999",
    passwordHash,
    isActive: true,
  });

  console.log("Admin created successfully!");
  console.log("Email: admin@aiims.edu");
  console.log("Phone: 9999999999");
  console.log("Password: admin123");
  console.log("MongoDB _id:", admin._id);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
