# Finance Dashboard API
> **A secure, high-performance financial management backend built with Node.js & MongoDB.**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

---

## 🚀 Overview
This API serves as a robust engine for tracking income and expenses. It features a sophisticated **Role-Based Access Control (RBAC)** system and leverages **MongoDB Aggregation Pipelines** to deliver real-time financial insights and trends directly from the database.

## 🚀 Key Features

* **Secure Authentication:** JWT-based stateless authentication with `bcryptjs` password hashing.
* **Granular RBAC:** Strict permission enforcement for **Admin**, **Analyst**, and **Viewer** roles.
* **Advanced Aggregations:** Dashboard metrics (monthly trends, category breakdowns, and net balance) calculated natively via MongoDB Aggregation Pipelines.
* **Search & Pagination:** Advanced filtering for records by type, category, and date ranges (`startDate` to `endDate`) with paginated responses.
* **Data Integrity (Soft Deletes):** Implemented soft deletion for both Users and Records to maintain a permanent audit trail.
* **Security Suite:** Built-in **Rate Limiting** to mitigate brute-force attacks and a centralized global error handler.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Local) with Mongoose ORM
* **Security:** JSON Web Tokens (JWT), Express-Rate-Limit, Bcrypt
* **Validation:** Express-Validator

---

## ⚙️ Setup & Installation

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally.

### 2. Installation
```bash
# Install dependencies
npm install
```
### 3. Environment Configuration
The .env file is excluded from version control for security. Create a .env file in the root directory and populate it with the following keys:

```Code snippet
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance-dashboard
JWT_SECRET=your_random_secret_string_here
```
### 4. Run the Application
```Bash
# Start the server in development mode
npm run dev
```
The API will be live at http://localhost:5000

---

## 🎯 Quick-Start: Test Scenarios

Since this project uses a local MongoDB instance, please use the following JSON payloads in the POST /api/auth/register endpoint to set up the RBAC roles for testing:

### 1. The Admin (Full Access)

Access: Create/Update/Delete records and manage all users.
```
JSON
{
  "name": "Admin User",
  "email": "admin@financely.com",
  "password": "secret_sauce",
  "role": "admin"
}
```
### 2. The Analyst (View & Analyze Only)

Access: View records and dashboard trends; blocked from editing/deleting.
```
JSON
{
  "name": "Analyst User",
  "email": "analyst@financely.com",
  "password": "secret_sauce",
  "role": "analyst"
}
```
### 3. The Viewer (Read-Only Dashboard)

Access: Only allowed to access the aggregate Dashboard summary.
```
JSON
{
  "name": "Viewer User",
  "email": "viewer@financely.com",
  "password": "secret_sauce",
  "role": "viewer"
}
```
### 🔒 Role-Based Access Control (RBAC)
| Feature | Admin | Analyst | Viewer |
| :--- | :---: | :---: |---: |
| View Dashboard Summary | ✅ | ✅ | ✅ |
| View/Filter Records | ✅ | ✅ | ❌ |
| Create/Update Records | ✅ | ❌ | ❌ |
| Soft Delete Records | ✅ | ❌ | ❌ |
| Manage Users & Roles | ✅ | ❌ | ❌ |

---

## 🌐 API Documentation

### 🔑 Authentication
|Method|Endpoint|Description|
| :---: | :---: | :---: |
|POST|/api/auth/register|Register a new user|
|POST|/api/auth/login|Authenticate & receive JWT Bearer Token|

### 📊 Dashboard (Aggregated Data)
|Method|Endpoint|Description|
| :---: | :---: | :---: |
|GET|/api/dashboard/summary|Returns Totals, Monthly Trends, & Recent Activity|

### 📝 Financial Records
|Method|Endpoint|Description|
| :---: | :---: | :---: |
|GET|/api/records|List records (Supports page, limit, type, category, startDate, endDate)|
|POST|/api/records|Create new income/expense|
|PUT|/api/records/:id|Update record details|
|DELETE|/api/records/:id|Soft delete a record|

### 👥 User Management (Admin Only)
|Method|Endpoint|Description|
| :---: | :---: | :---: |
|GET|/api/users|List all registered users|
|PUT|/api/users/:id/role|Change user role (viewer/analyst/admin)|

---

## 🧠 Architectural Decisions & Trade-offs

Native Aggregation: I utilized MongoDB's Aggregation Framework ($group, $match, $year, $month) to perform calculations. This shifts the computational heavy lifting to the database, ensuring the API remains responsive as data scales.

Soft Deletion: To preserve financial history for audits, records and users use an isActive or isDeleted flag. All queries are abstracted to filter these out automatically.

Scalability: By using stateless JWTs and modularizing the code into Controllers, Routes, and Middlewares, the application is ready for horizontal scaling and easy maintenance.

Validation: Implemented a dual-layered validation approach (Express-Validator at the route level and Mongoose Schema validation at the DB level) to ensure high data integrity.
|PUT|/api/users/:id/status|Toggle account active/inactive status|
