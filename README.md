📘 Smart Store Management System – README

A full‑stack web application built to digitize and streamline college store operations. This system provides separate portals for **students** and **admins**, enabling fast, transparent, and efficient management of purchases, balances, students, and inventory.



🧩 Project Overview

The Smart Store Management System was built to replace the slow and error‑prone manual store process in college, where activation, billing, verification, and record‑keeping were entirely paper‑based. The system brings complete digital transformation by introducing online student accounts, admin‑controlled billing, automated reporting, and real‑time balance tracking.



 🚀 Features

 👨‍🎓 Student Portal (Limited Access)

* Login with student credentials
* View basic profile
* Check available balance
* View complete transaction history

 👨‍💼 Admin Portal (Full Access)

* Admin login authentication
* Dashboard with:

  * Total students
  * Total amount in the system
  * Today’s sales
  * Active students list
* Student Management:

  * Add student
  * Edit student details
  * Delete student
  * Filter by year and branch

 🛒 Billing System

Divided into three components:

1. **Search Component** – Search by student store ID
2. **Inventory Component** – List of items to select from
3. **Cart Component** – Selected items + total cost + balance check

After purchase:

* Automatic email is sent to the student with:

  * Items purchased
  * Total amount deducted
  * Updated balance

 🏬 Inventory Management

* Add new items
* Edit existing items
* Delete items
* View complete inventory list

📊 Reports Module

* Daily sales report
* Monthly sales report
* Student-wise sales
* Downloadable reports

---

🛠️ Tech Stack

* Frontend: React, CSS
* Backend: Node.js, Express.js
* Database: MySQL
* Other: Nodemailer (emails), AI-assisted debugging





root
├── backend
│   ├── src
│   │   ├── routes
│   │   ├── controllers
│   │   ├── models
│   │   ├── config
│   │   └── utils
│   └── server.js
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── pages
│       ├── context
│       ├── hooks
│       └── App.js
├── README.md
└── package.json




React, Node.js, Express.js, MySQL, Full Stack Development, JavaScript, Store Management System, CRUD, Inventory System, Student Portal, Admin Dashboard, Digital Transformation, AI in Development, Project-Based Learning
