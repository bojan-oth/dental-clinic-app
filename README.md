
A full-stack dental office management system built with the **MERN stack** (MongoDB, Express.js, React, Node.js) featuring dynamic appointment scheduling, role-based access control, and JWT authentication.

---

## Features

### For Patients
- Register and login with email/phone and password
- Book appointments with dynamic time-slot calculation
- View available slots based on procedure duration
- See personal appointments and cancel if needed
- Weekend booking prevention (Mon-Fri only)

### For Admin (Doctor)
- View all appointments with full patient details
- Delete any appointment
- Filter appointments by date or view all

### Security
- Passwords hashed with **bcryptjs**
- **JWT (JSON Web Token)** authentication for protected routes
- Role-based access control (Patient / Admin)
- Patients cannot see other patients' appointment details

---

## Procedures & Durations

Procedure | Duration

Basic Check-up | 20 min 
Cavity Filling | 30 min 
Deep Cleaning | 40 min 
Tooth Extraction | 45 min 
Root Canal Treatment | 60 min 

**Working Hours:** Monday - Friday, 09:00 - 17:00

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Axios, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

### 1. Clone the Repository

git clone https://github.com/bojan-oth/dental-clinic-app.git
cd dental-clinic-app

Backend:

cd backend
npm install

.env in backend:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

start:
node server.js

Frontend:

cd ../frontend
npm install
npm start

For access:

Frontend: http://localhost:3000
Backend API: http://localhost:5000
