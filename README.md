# 🌐 Skyward Bank Management System

The **Skyward Bank Management System** is a comprehensive admin-facing web application designed to automate and streamline essential banking operations. It centralizes tasks such as account handling, secure transaction processing, KYC compliance, and reporting — all while ensuring robust data protection and operational transparency.

---

## ✨ Key Features

- 🔐 **Admin Authentication & Session Handling**
- 👤 **Customer Account Management** (Create, Update, Deactivate)
- 💳 **Transaction Handling** – Deposits, Withdrawals, Transfers
- 📈 **Real-time Balance Inquiry & Statements**
- 📄 **KYC Compliance & Update Module**
- 💼 **Credit/Debit Card Application Processing**
- 🧾 **Audit-Ready Report Generation (with Print Support)**
- 🚫 **Enable/Disable Banking Services**
- ✔️ **Form Validation & Error Prevention**
- 🛡️ **Access Control for Secure Operations**

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Development Tools:** VS Code, Git

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js `v14+` – [Download](https://nodejs.org/)
- MongoDB (local/cloud) – [Download](https://www.mongodb.com/)
- Git – [Download](https://git-scm.com/)
- Code Editor (VS Code recommended) – [Download](https://code.visualstudio.com/)

### Setup Steps

```bash
git clone https://github.com/yourusername/skyward-bank-management.git
cd skyward-bank-management
npm install
```

- Configure your MongoDB URI in `server.js`
- Insert an initial admin user directly into MongoDB

```bash
node server.js
```

Open your browser at: **[http://localhost:3000](http://localhost:3000)**

---

## 🧭 Usage Guide

1. Log in with admin credentials
2. Navigate through the dashboard to:
   - Create/manage customer accounts
   - Handle transactions (deposit, withdraw, transfer)
   - Process KYC updates and card applications
   - Generate and print reports
3. All activities are stored securely in MongoDB

---

## 📁 Project Structure

```
skyward-bank-management/
├── public/         # Static frontend files (HTML, CSS, images)
├── models/         # Mongoose schemas and models
├── server.js       # Express server entry point
├── package.json    # Dependencies and scripts
├── README.md
└── ...
```

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to modify and use it for educational or commercial purposes.

---

<div align="center">© 2024 Skyward Bank Management System Team</div>
