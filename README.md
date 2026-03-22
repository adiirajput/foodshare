# 🌿 FoodShare — Food Waste Management System

A web-based platform that connects food donors with recipients to reduce food waste and fight hunger.

🔗 **Live Demo:** [https://foodshare-it25.onrender.com](https://foodshare-it25.onrender.com)

---

## 📌 About

FoodShare bridges the gap between surplus food and hungry people by connecting donors (restaurants, households, events) with recipients (NGOs, shelters, individuals) before food expires.

---

## ✨ Features

- 🔐 **Login & Signup** — Secure authentication with password hashing
- 🍱 **Food Donation** — Donors can list surplus food with expiry, quantity & location
- 🔍 **Browse & Claim** — Recipients can browse and claim available food
- 📞 **Contact System** — Donor phone number visible to recipients for pickup coordination
- ⏱️ **Expiry Tracking** — Food nearing expiry gets highlighted automatically
- ⚙️ **Admin Dashboard** — Manage users, food listings and claims
- 👤 **Profile Page** — Edit profile, update phone number, logout
- 🛡️ **Protected Routes** — Pages accessible only after login

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) |
| Architecture | MVC + REST API |
| Deployment | Render |

---

## 📁 Project Structure
```
foodshare/
├── models/
│   ├── User.js
│   ├── Food.js
│   └── Claim.js
├── routes/
│   ├── auth.js
│   ├── food.js
│   └── claims.js
├── public/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── donor.html
│   ├── browse.html
│   ├── myclaims.html
│   ├── history.html
│   ├── admin.html
│   └── profile.html
└── server.js
```

---

## 🚀 Run Locally
```bash
# Clone the repo
git clone https://github.com/adiirajput/foodshare.git

# Install dependencies
npm install

# Start server
npm start
```

Open: `http://localhost:3000`

---

## 👨‍💻 Developed By

**Aditya Rajput**  
Academic Year: 2024-2025

---

## 📄 License

This project is for educational purposes.