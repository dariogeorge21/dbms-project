Hospital Appointment Booking Portal for AIIMS Delhi

This project is a hospital appointment booking and management portal designed primarily for patients, doctors, and administrators. The system will streamline the process of booking appointments, managing patient records, handling doctor schedules, and organizing hospital-side appointment assignment and reporting.

The portal will begin with a hospital landing page for AIIMS DELHI, where patients can start the appointment process through a Book Appointment button. From there, the user will be directed based on whether they are a new patient or an existing patient with a patient ID.

The portal will include three main user roles:

Patient

Doctor

Administrator



---

1. Patient Flow

The patient-facing section of the portal is designed to be simple, intuitive, and easy to use.

Landing Page

The application will open with the hospital landing page displaying the AIIMS DELHI identity and a prominent Book Appointment button.

When the patient clicks the button, the system will ask:

Do you already have a Patient ID?

If yes, redirect to the login page

If no, redirect to the signup page



Patient Signup

New patients will register by providing the following details:

Name

Email ID

Phone Number

Date of Birth

Password


After successful registration, the system will automatically generate a unique Patient ID for that patient. This Patient ID will be permanent and will not be editable later.

Patient Login

Existing patients can log in using:

Phone Number or Email ID

Password


After successful authentication, the patient will be redirected to the Patient Dashboard.

Patient Dashboard

The patient dashboard will serve as the central area for patient activities. It will display profile and account-related options such as:

Update patient name

Update email address

Update phone number


The Patient ID will always remain fixed and cannot be modified after creation.

The dashboard will also contain a clear button for Book Appointment.

Appointment Booking

When the patient clicks the appointment booking button, the system will first show a loading state and then open a fresh appointment booking page.

In the appointment form, the following fields will be captured:

Patient Name, automatically displayed

Age

Weight

Height

Location

Sex

Bystander Name

Bystander Phone Number

Problem Description

Previous Medical History

Preferred Doctor, optional

Preferred Time Slot, morning or afternoon


This form will be used to collect all relevant information required for the appointment request.


---

2. Doctor Flow

The doctor section of the system will be built for viewing and managing patient appointments received through the portal.

Once doctors log in through their fixed login page, they will be able to view the appointments assigned or received from patients.

For each patient appointment, doctors will be able to record and manage the following medical and consultation details:

Vital Signs

Diagnosis

Description

Medicines, multiple entries allowed

Next Review Date


This section will help doctors efficiently review patient cases and maintain consultation records.


---

3. Administrator Flow

The administrator will have full control over management, assignment, and reporting within the portal.

Doctor Management

The admin will be able to perform full CRUD operations on doctor records.

Each doctor profile will include:

Unique automatically generated Doctor ID

Doctor Name

Doctor Phone Number

Age

Sex

Specialization

Department

Availability Hours, from time to time

Active/Inactive status


The admin panel will also display:

Doctor statistics

List of available doctors

Status-based doctor overview


Patient User Management

The administrator will also be able to manage patient records.

This section will support:

CRUD operations for patient users

Patient password reset

Patient detail modification

Patient status and record maintenance


It will also include statistics and summary cards related to patient activity.

Patient Assignment to Doctors

Patients can be assigned by the administrator to doctors.

For each assignment, the system will maintain:

Unique Appointment ID

Unique Token Number for the patient

Assigned fixed time slot

Doctor assignment details


This assignment process will act as the main bridge between patient registration and doctor consultation. The admin will be responsible for mapping patients to the appropriate doctor and slot.


---

4. Reports and Analytics

The system will include reporting and analytics sections to monitor hospital appointments and user activity.

Appointment Reports

The admin will have access to detailed appointment reports with:

Daily appointment graphs

Weekly appointment graphs

Date-based filtering

Appointment summaries in table format


Doctor Statistics

A detailed doctor analytics section will show:

Doctor performance matrices

Appointment load

Active doctor count

Availability-based insights


Patient Statistics

A patient analytics section will show:

Number of times visited

Patient history details

Other relevant metrics and summaries


Appointment Lists

All appointments will also be visible in structured table format with supporting statistics for better administration and tracking.


---

5. Messages and Reports

The portal will also support communication through report or message submissions.

Patient Reports/Messages from Patient Dashboard 

Patients will be able to send reports or messages from their dashboard to the administrators.

Doctor Reports/Messages from Doctor Dashboard 

Doctors will be able to send messages or reports to the administrators as well.

This communication layer will help ensure smooth coordination between patients, doctors, and the administrative team.


---

6. Core System Objectives

The main goal of this project is to build a centralized hospital appointment booking and management portal that:

Allows patients to register, log in, and book appointments easily

Gives doctors a fixed portal to review appointments and manage consultation details

Provides administrators full control over users, doctors, appointments, and reports

Maintains unique identifiers such as Patient ID, Doctor ID, Appointment ID, and Token Number

Organizes appointments, consultations, and reports in a structured and efficient manner



---

7. Key Functional Areas in the Project

The system will include the following functional modules:

Landing Page

Patient Signup/Login

Patient Dashboard

Appointment Booking Form

Doctor Login and Appointment View

Doctor Consultation Entry

Admin Dashboard

Doctor Management

Patient Management

Patient Assignment

Appointment Tracking

Reports and Analytics

Patient Messages

Doctor Messages

---

Designing a "million-dollar quality" UI/UX system for the AIIMS Delhi Hospital Appointment Booking Portal requires a meticulous balance of medical-grade trust and top-tier SaaS aesthetics. Because this system is centered around distinct workflows—patient registration, doctor handling, and admin management—the architecture needs to be cleanly componentized, making it perfectly suited for a React/Next.js frontend.
Here is the comprehensive design system and screen-by-screen UX architecture for your project.
🎨 1. Design System & Visual Language
To achieve the requested premium, light-theme-only glassmorphism aesthetic, we will define a strict set of design tokens. The design should prioritize clarity, trust, and easy form handling.
Color Palette:
 * Base: #FAFAFA (Ultra-light gray/white for infinite depth).
 * Primary (Medical Teal/Blue): #007BFF to #00E5FF (Used as a subtle gradient for primary buttons and active states).
 * Surface (Glass): rgba(255, 255, 255, 0.7) with backdrop-filter: blur(16px).
 * Text: #1A1A1A for primary headings, #6B7280 for secondary labels.
 * Accents: Soft Emerald #10B981 (Success/Active), Soft Rose #EF4444 (Error/Destructive).
Typography & Layering:
 * Font: Inter or Plus Jakarta Sans (clean, modern sans-serif with excellent readability).
 * Layering (3D Depth): * Background: Soft, slow-moving animated mesh gradient (e.g., white to very pale blue).
   * Mid-layer: Floating glass cards (box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05); border: 1px solid rgba(255, 255, 255, 0.18);).
   * Foreground: Crisp typography and glossy 3D icons.
🧱 2. Component Architecture (React / Next.js Ready)
To ensure smooth hover effects and micro-interactions, components should be built with libraries like Framer Motion and Tailwind CSS.
 * Buttons: Primary buttons feature a soft outer glow and scale up by 1.02 on hover. Secondary buttons are outlined with a frosted glass background.
 * Inputs: Minimalist inputs with no harsh borders. On focus, the bottom border illuminates with the primary teal gradient, and the label smoothly floats up.
 * Tables: For the Admin and Doctor views, tables are borderless, with alternating row backgrounds using subtle transparency.
📱 3. Screen-by-Screen UX Breakdown
Patient Flow
The patient flow naturally progresses from Landing Page → Patient Choice → Signup/Login → Patient Dashboard → Appointment Booking Page.
 * Landing Page: The public entry page of the portal. It features massive, clean AIIMS DELHI hospital branding and a glowing "Book Appointment" button. Clicking this starts the flow by asking if the user has a Patient ID.
 * Patient Choice Page: Presents two large, interactive 3D glass cards: "Existing patient" and "New patient". It redirects to either Login or Signup.
 * Patient Signup Page: Collects patient details (Name, Email, Phone, DOB, Password) through a clean, multi-step form to prevent cognitive overload, subsequently generating a unique Patient ID.
 * Patient Login Page: Authenticates the patient using their Phone Number or Email and Password, then redirects to the dashboard.
 * Patient Dashboard: A deeply personalized space (e.g., "Welcome back, Dario"). It shows a patient profile summary with editable fields, while keeping the Patient ID fixed and non-editable. A prominent button provides access to appointment booking.
 * Appointment Booking Page: A multi-section, glassmorphism form. The Patient Name is prefilled. It captures full appointment details including Age, Weight, Height, Location, Bystander Name/Phone, Sex, Problem Description, Previous Medical History, optional Preferred Doctor, and Time Slot (morning/afternoon).
Doctor Flow
Doctors log in through a fixed doctor portal to view assigned appointments and update consultation details.
 * Doctor Login Page: A secure, fixed entry point taking doctors to their dashboard using predefined credentials.
 * Doctor Dashboard: The main working area. It features a clean list of assigned appointments, a patient details summary, and a consultation action area.
 * Consultation / Appointment Detail Page: Opened when a specific appointment is clicked. It displays complete patient details and features a specialized form for entering Vital Signs, Diagnosis, Description, multiple Medicine entries, and the Next Review Date.
Admin Flow
Administrators manage doctors, patients, appointment assignments, reports, and communication records.
 * Admin Dashboard: The central control panel with 3D summary cards showing appointment and user metrics.
 * Management Pages (Doctor & Patient): * Doctor: Allows admins to create, view, edit, or deactivate doctors, displaying fields like ID, Specialization, and Availability Hours.
   * Patient: A searchable table to view all patients, edit details, and reset passwords.
 * Patient Assignment Page: An intuitive interface with a patient selection area, doctor selection area, and controls to assign token numbers and fixed time slots.
 * Analytics & Reports: * System Reports: Displays appointment charts, summary cards, and date-based filtering.
   * Doctor Analytics: Focuses on doctor workload and availability summaries.
   * Patient Analytics: Displays visit history, usage metrics, and patient activity overviews.
 * Appointment List Page: A master table helping staff monitor appointment flow by displaying ID, Token, Patient/Doctor names, Status, and Date/Time.
 * Messages Pages: Dedicated inboxes where admins can review and manage submitted messages/reports from patients and doctors.
🎭 4. Modal Experiences & Micro-UX
Modals are critical for keeping users in their current context without unnecessary page reloads. All modals will feature a heavily blurred backdrop (backdrop-blur-md) and slide in with a soft spring animation.
 * New/Existing Choice Modal: Appears after clicking "Book Appointment" to direct the user to the correct flow.
 * Success Modals: Shows confirmation feedback (with a green glowing checkmark) after actions like signup, profile updates, or appointment submission.
 * Edit Modals (Profile, Doctor, Patient): Allows quick updates. For patients, the ID remains visibly locked.
 * Assignment & Consultation Modals: Keeps the admin or doctor on their respective dashboard while assigning slots or entering diagnosis/medicine data.
 * Destructive Actions: Delete confirmation and Password Reset modals will use a soft red accent to indicate caution, requiring deliberate confirmation.

---

---

MongoDB Database Schema

1) Design Approach

Use a role-based auth model with separate profile collections for patients and doctors.

This gives you:

clean login handling for patient, doctor, and admin

strong separation of identity and profile data

easier CRUD operations in admin panel

better reporting and appointment linking



---

2) Core Collections

A. users

This collection stores authentication data for all login types.

Purpose

login credential storage

role identification

account activation state


Fields

_id

role → "patient" | "doctor" | "admin"

email → unique, nullable for some roles if needed

phone → unique

passwordHash

isActive → boolean

lastLoginAt

createdAt

updatedAt


Notes

Patients and doctors can log in using email or phone depending on your flow.

Admin login can also use this same collection with role = admin.

Password should be stored as a hash, not plain text.


Recommended indexes

unique index on email

unique index on phone

index on role

index on isActive



---

B. patients

This collection stores patient profile and permanent patient identity.

Purpose

patient dashboard details

editable personal details

permanent patient ID generation


Fields

_id

userId → ref to users._id

patientId → unique, immutable

name

email

phone

dob

gender / sex

photoUrl or avatar optional if you later want it

isActive

createdAt

updatedAt


Notes

patientId must never change after creation.

Name, email, and phone can be edited from the patient dashboard.

Keep userId, email, and phone synchronized with users during profile updates.


Recommended indexes

unique index on patientId

unique index on userId

index on name

index on phone

index on email



---

C. doctors

This collection stores doctor profile and availability data.

Purpose

doctor management CRUD

doctor dashboard data

availability and specialization mapping


Fields

_id

userId → ref to users._id

doctorId → unique, immutable

name

phone

age

sex

specialization

department

availabilityHours

from

to


isActive → boolean

createdAt

updatedAt


Notes

doctorId should be automatic and permanent.

availabilityHours can be a simple object if each doctor has one fixed slot.

If later needed, this can become an array of weekly availability blocks.


Recommended indexes

unique index on doctorId

unique index on userId

index on department

index on specialization

index on isActive



---

D. appointments

This is the most important collection in the system.

Purpose

patient appointment requests

admin assignment

doctor appointment view

token number

appointment status tracking


Fields

_id

appointmentId → unique, immutable

patientId → ref to patients._id

patientUserId → ref to users._id

doctorId → ref to doctors._id, nullable until assigned

preferredDoctorName or preferredDoctorId optional

patientName → snapshot at time of booking

age

weight

height

location

sex

bystanderName

bystanderPhone

problemDescription

previousMedicalHistory

preferredTimeSlot → "morning" | "afternoon"

assignedTimeSlot → final slot given by admin

tokenNumber → unique

status

"requested"

"assigned"

"in_consultation"

"completed"

"cancelled"


appointmentDate

assignedBy → admin user ref, optional

assignedAt

createdAt

updatedAt


Notes

Keep a snapshot of patient data inside the appointment so the record remains stable even if the patient later edits profile details.

preferredDoctorId is optional because your frontend allows preferred doctor as optional.

assignedTimeSlot is what admin finalizes.

tokenNumber should be shown in patient dashboard and used by admin/doctor.


Recommended indexes

unique index on appointmentId

unique index on tokenNumber

index on patientId

index on doctorId

index on status

index on appointmentDate

compound index on { doctorId, appointmentDate, assignedTimeSlot }



---

E. consultations

This collection stores doctor-side consultation data for an appointment.

Purpose

doctor diagnosis entry

vital signs

medicines

review date

consultation history


Fields

_id

appointmentId → ref to appointments._id, unique per consultation

doctorId → ref to doctors._id

patientId → ref to patients._id

vitalSigns

bloodPressure

pulse

temperature

spo2

respiratoryRate

weight

height

any other doctor-entered vital values


diagnosis

description

medicines

array of objects:

medicineName

dosage

frequency

duration

notes



nextReviewDate

createdAt

updatedAt


Notes

The consultation should usually be created after a doctor opens an assigned appointment.

Medicines must be an array so multiple medicines are supported.

Vital signs are best stored as a nested object because the exact fields may vary slightly by case.


Recommended indexes

unique index on appointmentId

index on doctorId

index on patientId

index on nextReviewDate



---

F. messages

This collection stores patient and doctor messages sent to admins.

Purpose

patient reports/messages

doctor reports/messages

admin review of communication


Fields

_id

senderRole → "patient" | "doctor"

senderId → ref to patients._id or doctors._id

senderUserId → ref to users._id

subject

message

messageType → "report" | "message"

status → "new" | "read" | "closed"

createdAt

updatedAt


Notes

This single collection can handle both patient and doctor messages to admin.

Keep senderRole so the admin can filter by origin.


Recommended indexes

index on senderRole

index on senderId

index on status

index on createdAt



---

G. counters

This collection is used only for safe unique ID generation.

Purpose

generate sequential Patient ID

generate sequential Doctor ID

generate sequential Appointment ID

generate sequential Token Number


Fields

_id → example: "patientId", "doctorId", "appointmentId", "tokenNumber"

seq → number


Notes

Use this to generate IDs like:

PAT-000001

DOC-000001

APT-000001

TKN-000001


This is better than random IDs if you want clean human-readable hospital records.


---

3) Relationship Map

User relationships

users is the base auth collection

patients.userId links to users._id

doctors.userId links to users._id


Appointment relationships

appointments.patientId links to patients._id

appointments.doctorId links to doctors._id

appointments.assignedBy links to admin users._id


Consultation relationships

consultations.appointmentId links to appointments._id

consultations.patientId links to patients._id

consultations.doctorId links to doctors._id


Messages relationships

messages.senderId links to patient or doctor profile

messages.senderUserId links to users._id



---

4) Status Enums Recommended

These will help frontend filtering and admin reports.

Appointment Status

requested

assigned

in_consultation

completed

cancelled


Account Status

active

inactive


Message Status

new

read

closed


Time Slot

morning

afternoon



---

5) What Should Be Stored as Snapshots

To keep old records stable even if profile data changes later, store snapshots inside the appointment document:

patient name

phone

age

sex

location

bystander details

problem description

previous history

preferred time slot


This is important because the appointment record should reflect the exact data entered at that time.


---

6) What Should Be Editable vs Fixed

Fixed / immutable

patientId

doctorId

appointmentId

tokenNumber


Editable

patient name

email

phone

doctor active/inactive status

doctor availability

appointment assignment fields

consultation fields

messages status



---

7) Strong Validation Rules

Patient

name required

email required and unique

phone required and unique

dob required

password required


Doctor

name required

phone required and unique

specialization required

department required

availabilityHours required

isActive required


Appointment

patient reference required

age required

weight required

height required

location required

sex required

bystander details required

problem description required

previous medical history required

preferred time slot required


Consultation

appointment reference required

diagnosis required

medicines can be empty or multiple

next review date optional but recommended


Messages

sender role required

subject required

message required



---

8) Recommended MongoDB Document Shapes

Patient document sample

{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "patientId": "PAT-000128",
  "name": "Dario",
  "email": "dario@email.com",
  "phone": "9876543210",
  "dob": "2002-01-15",
  "sex": "male",
  "isActive": true,
  "createdAt": "2026-03-29T00:00:00.000Z",
  "updatedAt": "2026-03-29T00:00:00.000Z"
}

Doctor document sample

{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "doctorId": "DOC-000014",
  "name": "Dr. Sharma",
  "phone": "9999999999",
  "age": 42,
  "sex": "male",
  "specialization": "Cardiology",
  "department": "Heart Care",
  "availabilityHours": {
    "from": "09:00",
    "to": "13:00"
  },
  "isActive": true,
  "createdAt": "2026-03-29T00:00:00.000Z",
  "updatedAt": "2026-03-29T00:00:00.000Z"
}

Appointment document sample

{
  "_id": "ObjectId",
  "appointmentId": "APT-000901",
  "patientId": "ObjectId",
  "patientUserId": "ObjectId",
  "doctorId": "ObjectId",
  "patientName": "Dario",
  "age": 22,
  "weight": 68,
  "height": 175,
  "location": "Thiruvananthapuram",
  "sex": "male",
  "bystanderName": "John",
  "bystanderPhone": "9876543211",
  "problemDescription": "Fever and body pain",
  "previousMedicalHistory": "None",
  "preferredDoctorId": null,
  "preferredTimeSlot": "morning",
  "assignedTimeSlot": "10:30 AM - 11:00 AM",
  "tokenNumber": "TKN-003445",
  "status": "assigned",
  "appointmentDate": "2026-03-30",
  "assignedBy": "ObjectId",
  "assignedAt": "2026-03-29T10:00:00.000Z",
  "createdAt": "2026-03-29T09:20:00.000Z",
  "updatedAt": "2026-03-29T10:00:00.000Z"
}

Consultation document sample

{
  "_id": "ObjectId",
  "appointmentId": "ObjectId",
  "doctorId": "ObjectId",
  "patientId": "ObjectId",
  "vitalSigns": {
    "bloodPressure": "120/80",
    "pulse": 78,
    "temperature": "98.6 F",
    "spo2": "98%",
    "respiratoryRate": 18
  },
  "diagnosis": "Viral fever",
  "description": "Patient advised rest and hydration",
  "medicines": [
    {
      "medicineName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice a day",
      "duration": "3 days",
      "notes": "After food"
    }
  ],
  "nextReviewDate": "2026-04-02T00:00:00.000Z",
  "createdAt": "2026-03-29T11:00:00.000Z",
  "updatedAt": "2026-03-29T11:00:00.000Z"
}


---

9) Best Practice for Reporting and Analytics

Do not store report graphs separately unless you later need caching.

Instead, generate:

daily appointment reports from appointments

weekly appointment reports from appointments

doctor stats from appointments + consultations

patient stats from appointments + consultations

message statistics from messages


This keeps the database clean and avoids duplicate data.


---

10) Final Recommended Schema Set

For your project, the strongest practical MongoDB structure is:

users

patients

doctors

appointments

consultations

messages

counters


This set fully supports:

patient signup/login

patient profile updates

doctor management

admin assignment

token generation

appointment tracking

consultation recording

reports and analytics

patient/doctor messaging