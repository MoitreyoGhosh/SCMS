# 🏫 Smart Classroom Management System (SCMS)

## 📖 Description

The **Smart Classroom Management System (SCMS)** is a technology-driven platform designed to streamline classroom operations through automation and efficiency. It provides an integrated solution for **attendance tracking, assignment handling, student-teacher communication, and academic insights**. The system enhances engagement, improves productivity, and reduces manual workload for educators by offering a **centralized and seamless experience**.

SCMS leverages modern web technologies to provide **QR-based attendance, digital assignments, real-time announcements, and interactive discussions**. With role-based access for **students, teachers, and administrators**, it ensures a structured and efficient learning environment.

## ✨ Features

- ✅ **QR-Based Attendance** – Automated attendance tracking with real-time validation
- ✅ **Notes & Assignments** – Digital note-sharing and assignment submissions
- ✅ **Notices & Announcements** – Instant updates and notifications
- ✅ **Q&A Section** – Interactive discussions and student queries
- ✅ **Class Performance Analysis** – Insights into attendance, submissions, and academic trends
- ✅ **Role-Based Access** – Different access levels for students, teachers, and admins
- ✅ **Secure Authentication** – Secure login and role management

## 🛠 Tech Stack

### **Frontend:**

- **Next.js** (React Framework)
- **Tailwind CSS** (Styling)
- **NextAuth.js** (Authentication)
- **react-qr-reader** (QR Code Scanning - Student)
- **qrcode.react** (QR Code Generation - Teacher)
- **axios** (HTTP Client)

### **Backend:**

- **Node.js** (Runtime Environment)
- **Express.js** (Web Framework)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **JWT** (JSON Web Tokens for Authentication)
- **bcryptjs** (Password Hashing)
- **cors** (Cross-Origin Resource Sharing)
- **helmet** (Security)
- **express-rate-limit** (Rate Limiting)
- **multer** (File Uploads)
- **Cloudinary** (Cloud Storage)
- **dotenv** (Environment Variables)
- **Nodemailer** (Email Sending - Optional)

### **API Testing:**

- **Postman**

### **Deployment:**

- **Vercel/Netlify** (Frontend)
- **AWS/Google Cloud** (Backend)
- **MongoDB Atlas** (Database)

## **🚀 Installation & Setup**

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/MoitreyoGhosh/SCMS.git
cd SCMS
```

### **2️⃣ Install dependencies**

- **Frontend:**

  ```bash
  cd frontend
  npm install
  ```

- **Backend:**

  ```bash
  cd backend
  npm install
  ```

### **3️⃣ Set up environment variables:**

- Create a `.env.local` file in the root directory of the `frontend` folder and a `.env` file in the root directory of the `backend` folder.

- Add the necessary variables (MongoDB URI, authentication credentials, Cloudinary keys, etc.).

- See the `.env.example` files for a list of required variables.

### **4️⃣ Run the development server:**

- **Frontend:**

  ```bash
  cd frontend
  npm run dev
  ```

- **Backend:**

  ```bash
  cd backend
  npm run dev
  ```

### **5️⃣ Access the application:**

- Open `http://localhost:3000` in your browser (for the frontend).

- The backend API will typically run on `http://localhost:5000` (or a similar port you configure).

## 📜 License

This project is **open-source** under the [MIT License](LICENSE).
