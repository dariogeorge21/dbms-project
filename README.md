# AIIMS Delhi — Hospital Appointment Booking Portal

A next-generation hospital appointment booking and management portal for **All India Institute of Medical Sciences (AIIMS), New Delhi**. The system streamlines appointment booking, patient record management, doctor scheduling, and hospital-side administration through three distinct role-based portals.

---

## Features

### 🧑‍⚕️ Patient Portal
- **Registration & Login** — Sign up with name, email, phone, date of birth, and password. A unique, permanent Patient ID is auto-generated on registration. Log in with phone/email and password.
- **Appointment Booking** — Fill in detailed appointment forms including medical history, bystander info, preferred time slot (morning/afternoon), and optional doctor preference.
- **Dashboard** — View and manage profile details, track appointment status (Requested → Assigned → In Consultation → Completed/Cancelled), and view token numbers.
- **Messaging** — Send messages or reports to administrators.

### 👨‍⚕️ Doctor Portal
- **Login** — Doctors are created by admins; login uses credentials provided by admin.
- **Dashboard** — View today's assigned appointments with patient details and token numbers.
- **Consultation** — Mark appointments as in consultation and complete them.
- **Messaging** — Send messages or reports to administrators.

### 🛡️ Admin Portal
- **Dashboard** — View live statistics (total patients, doctors, appointments, and pending requests).
- **Appointment Management** — Review incoming appointment requests and assign them to doctors with a date and time slot. Auto-assigns token numbers.
- **Doctor Management** — Create, view, and deactivate doctor accounts.
- **Patient Management** — View and manage patient records.
- **Reports & Messages** — Read and manage messages/reports submitted by patients and doctors.
- **Analytics** — Access appointment and usage analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/), Radix UI |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Database | MongoDB via [Mongoose](https://mongoosejs.com/) |
| Authentication | JWT (HTTP-only cookies, 7-day expiry) |
| Password Hashing | bcryptjs |
| Icons | Lucide React, HugeIcons |

---

## Data Models

| Model | Description |
|---|---|
| `User` | Base auth record (role, email/phone, passwordHash) |
| `Patient` | Patient profile linked to a User; includes DOB, sex, phone |
| `Doctor` | Doctor profile with specialization, department, availability hours |
| `Appointment` | Full appointment record with status lifecycle, token number, time slot |
| `Consultation` | Consultation notes created by doctors |
| `Message` | Messages/reports sent by patients or doctors to admins |
| `Counter` | Auto-increment counters for generating sequential IDs/tokens |

### Appointment Status Lifecycle
```
requested → assigned → in_consultation → completed
                                       ↘ cancelled
```

---

## Project Structure

```
.
├── app/
│   ├── page.tsx              # Landing page
│   ├── admin/                # Admin portal (dashboard, doctors, patients, appointments, messages, reports)
│   ├── doctor/               # Doctor portal (dashboard, consultation, messages)
│   ├── patient/              # Patient portal (dashboard, book-appointment, messages)
│   ├── api/                  # REST API routes (auth, appointments, doctors, patients, messages, analytics)
│   ├── faq/                  # FAQ page
│   ├── privacy-policy/       # Privacy policy page
│   └── terms-of-service/     # Terms of service page
├── components/               # Shared UI components (Navbar, GlassCard, Modal, AnimatedBackground, etc.)
├── lib/
│   ├── auth.ts               # JWT helpers, cookie management, getCurrentUser()
│   ├── db.ts                 # MongoDB connection
│   ├── models/               # Mongoose models
│   └── utils.ts              # Utility functions
├── scripts/
│   └── seed-admin.ts         # Script to seed the initial admin account
├── middleware.ts             # Route protection & role-based redirects
└── public/                  # Static assets
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/dariogeorge21/dbms-project.git
cd dbms-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/aiims-delhi
JWT_SECRET=your_strong_jwt_secret_here
```

### 4. Seed the admin account

Run the seed script once to create the default admin user:

```bash
npx ts-node --project tsconfig.json scripts/seed-admin.ts
```

Default admin credentials (change after first login):
- **Email:** `admin@aiims.edu`
- **Phone:** `9999999999`
- **Password:** `admin123`

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## Authentication & Security

- All passwords are hashed with **bcryptjs** (12 salt rounds).
- Sessions are managed via **HTTP-only JWT cookies** (`aiims_token`) with a 7-day expiry.
- Route protection is enforced in `middleware.ts` — unauthenticated users are redirected to the appropriate login page based on the URL prefix (`/patient`, `/doctor`, `/admin`).
- Admin accounts can only be created via the seed script or by another admin; self-registration is not available for doctors or admins.

---

## User Portals

| Role | Entry Point |
|---|---|
| Patient | [/patient](http://localhost:3000/patient) |
| Doctor | [/doctor/login](http://localhost:3000/doctor/login) |
| Admin | [/admin/login](http://localhost:3000/admin/login) |

---

## License

This project is developed as a DBMS academic project. All rights reserved.
