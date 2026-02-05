# Mystery Messages

**Mystery Messages** is a modern, full-stack anonymous feedback platform built with **Next.js 16**, **MongoDB**, and **TypeScript**. It allows users to create a unique profile link where others can send them anonymous messages. Users have a dedicated dashboard to manage their messages and toggle their availability for receiving feedback.

---

## Key Features

* **100% Anonymity**: Send and receive messages without revealing your identity.
* **Secure Authentication**: Robust user sign-up and sign-in powered by **NextAuth.js**.
* **OTP Verification**: Account security through 6-digit email verification codes delivered via **Gmail SMTP**.
* **Dynamic Dashboard**: A sleek UI to view, refresh, and delete received messages in real-time.
* **Availability Toggle**: One-click control to start or stop accepting new anonymous messages.
* **Modern UI/UX**: Responsive design built with **Tailwind CSS**, **Lucide Icons**, and custom UI components.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS, Lucide React |
| **Backend** | Next.js API Routes, Mongoose (MongoDB) |
| **Auth** | NextAuth.js, Bcrypt |
| **Email** | Gmail SMTP (Nodemailer) |
| **Validation** | Zod, React Hook Form |

---

## Project Structure

* **`/app`**: Contains the core application routes (Auth, Dashboard, Public Profiles) and API endpoints.
* **`/components`**: Reusable UI components including the Navbar, Buttons, and Cards.
* **`/model`**: MongoDB schemas defined using Mongoose.
* **`/schemas`**: Zod validation schemas for forms and API requests.
* **`/helpers`**: Utility functions for email verification logic.
* **`/lib`**: Database connection and shared utilities.

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tamish03/mystery_messages.git
   cd mystery_messages
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_auth_secret
   SMTP_USER=your_gmail_address
   SMTP_PASS=your_gmail_app_password
   SMTP_FROM=your_gmail_address
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## Gmail App Password Setup

Gmail requires an App Password for SMTP.

1. Enable **2-Step Verification** on your Google account.
2. Go to **Google Account** -> **Security** -> **App Passwords**.
3. Create a new app password:
   - App: `Mail`
   - Device: `Other` -> `MysteryMessages`
4. Copy the 16-character password and set it as `SMTP_PASS` in `.env`.

---

## Security Highlights

* **Credential Protection**: Uses `bcrypt` for secure password hashing.
* **Strict Validation**: All data entry is strictly validated via `Zod` to ensure integrity.
* **Session Management**: Secure, JWT-based sessions handled by NextAuth.
* **Route Protection**: Sensitive routes like `/dashboard` are protected by auth proxy.

---
