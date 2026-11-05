# 🏦 Bank Transaction System

A full-stack MERN Banking Transaction System that allows users to register, log in, create bank accounts, view balances, and perform secure transactions using JWT authentication and MongoDB Atlas.

## 🚀 Features

### Authentication

* User Registration
* Email ownership verification before login
* User Login
* Email OTP for login verification
* OTP-based password reset
* JWT Authentication
* Protected Routes
* Logout Functionality

### Account Management

* Create Bank Account
* View User Accounts
* Account Status Tracking
* Multi-Account Support

### Ledger System

* Balance Calculation from Ledger Entries
* Credit Transactions
* Debit Transactions
* Transaction Validation

### Security

* JWT-based Authentication
* Token Blacklisting
* Protected APIs
* Idempotency Key Support
* Email notifications for completed transfers

### Deployment

* Backend deployed on Render
* Database hosted on MongoDB Atlas
* Frontend built with React + Vite

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Axios
* React Router

### Backend

* Node.js
* Express.js
* JWT
* Mongoose

### Database

* MongoDB Atlas

### Deployment

* Render
* Vercel

---

## 📂 Project Structure

Backend

```text
src/
├── controller/
├── middleware/
├── models/
├── routes/
├── services/
└── config/
```

Frontend

```text
src/
├── components/
├── pages/
├── services/
└── assets/
```

---

## ⚙️ Installation

### Backend

```bash
git clone <backend-repo-url>
cd BTS

npm install
npm start
```

### Frontend

```bash
git clone <frontend-repo-url>
cd BTS-frontend

npm install
npm run dev
```

---

## Environment Variables

Backend `.env`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
# Option A: Gmail App Password (simplest)
EMAIL_PASS=your_16_character_app_password

# Option B: Gmail OAuth2 (use instead of EMAIL_PASS)
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
FRONTEND_URL=http://localhost:5173
```

Frontend `.env`

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/login/verify-otp
POST /api/auth/password-reset/request
POST /api/auth/password-reset/confirm
GET /api/auth/verify-email?token=...
POST /api/auth/resend-verification
POST /api/auth/logout
```

### Accounts

```http
POST /api/accounts
GET /api/accounts
GET /api/accounts/balance/:accountId
```

### Transactions

```http
POST /api/transactions
POST /api/transactions/system/initial-funds
```

---

## Author

**Nishanta Kumar Bhuyan**

Electronics & Communication Engineering, NIT Silchar

Focused on Full-Stack Development, DSA, and Product-Based Company Placements.
