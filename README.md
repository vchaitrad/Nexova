# Nexova

Job portal for the Indian market, covering skilled and domestic work (plumber, electrician, driver, cook) as well as office and IT jobs. Job seekers can apply in a few taps, and recruiters can check who they are hiring through email, selfie and Aadhaar verification.

**Stack:** React (Vite) + Tailwind CSS, Node.js + Express, MongoDB (Mongoose), JWT

## Features

- Three roles: job seeker, recruiter, admin
- Signup and login with JWT, password hashing with bcrypt, forgot-password with OTP
- Email OTP and phone OTP verification
- Trust badges: selfie upload and Aadhaar upload, reviewed and approved by an admin
- Recruiters post, close and delete jobs and accept or reject applicants
- Job seekers browse by category, search, save jobs, quick-apply and track applications
- 20 job categories (Plumbing, Electrician, Driver, Cook, IT, Design and more)
- Notifications by email (Nodemailer), WhatsApp (Twilio) and SMS (Fast2SMS)
- UI in English, Hindi and Kannada

## Project structure

```
backend/    Express API (routes, models, services, middleware, seed.js)
frontend/   React app (pages, components, context, api)
nexova-er-diagram.svg   Database ER diagram
```

## Run locally

Requirements: Node.js 18+ and a MongoDB database (local or Atlas).

```bash
# 1. Backend
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
node seed.js              # optional: adds sample jobs and a demo recruiter
npm run dev               # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173 (proxies /api and /uploads to the backend)
```

Demo recruiter created by `seed.js`: `hr@nexova.com` / `password123`. This is for local testing only.

To serve the app from the backend, run `npm run build` in `frontend/`. Express then serves `frontend/dist`.

## Environment variables

See `backend/.env.example`. `MONGO_URI` and `JWT_SECRET` are required. Email, Twilio and Fast2SMS are optional and only needed for notifications.

## API overview

| Area | Routes |
| --- | --- |
| Auth | `/api/auth/signup`, `/login`, `/verify-email`, `/send-otp`, `/forgot-password`, `/reset-password`, `/profile`, `/upload-selfie`, `/upload-id`, `/request-verification` |
| Admin | `/api/auth/admin/pending-users`, `/api/auth/admin/verify-user` |
| Jobs | `/api/jobs`, `/api/jobs/my`, `/api/jobs/saved`, `/api/jobs/:id`, `/:id/apply`, `/:id/quick-apply`, `/:id/close`, `/:id/save` |
| Applications | `/api/applications/my`, `/api/applicants`, `/api/applications/:id/status` |
| Users | `/api/users/profile` |
| Contact | `/api/contact` |

## Data model

`User`, `Job` and `Application` (one application per user per job). See `nexova-er-diagram.svg`.

## Notes

- Uploaded selfies and ID proofs are stored in `backend/uploads/` and are git-ignored because they are personal data.
- Never commit `backend/.env`.
