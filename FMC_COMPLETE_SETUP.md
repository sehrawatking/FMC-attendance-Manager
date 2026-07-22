# 🚀 FMC (Friends and Media) - Attendance & Salary Management System
## Complete Setup Guide - All-in-One

**Version:** 2.0  
**Author:** Ghost (Manjeet)  
**Last Updated:** 2026-07-22

---

## 📑 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Database Setup](#database-setup)
6. [API Documentation](#api-documentation)
7. [Security Implementation](#security-implementation)
8. [Deployment Guide](#deployment-guide)
9. [Testing Guide](#testing-guide)
10. [Troubleshooting](#troubleshooting)

---

## 📋 PROJECT OVERVIEW

### App Name
**FMC Attendance Manager**

### Company
**Friends and Media (FMC)**

### Purpose
- Employees clock in/out with GPS location tracking
- Admin manages attendance & salary
- Employees cannot see salary info

### Tech Stack
- **Frontend:** React Native + Expo
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT + Bcrypt
- **Location Tracking:** Expo Location
- **HTTP Client:** Axios

---

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                      FMC System                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │   React Native   │◄───────►│   Express.js     │          │
│  │   Mobile App     │ (HTTPS) │   Backend API    │          │
│  └──────────────────┘         └──────────────────┘          │
│         │                             │                      │
│         │ GPS Location                │                      │
│         │ Authentication              │ JWT Validation       │
│         │                             │ Role-Based Access    │
│         │                             │                      │
│         │                      ┌──────▼──────────┐           │
│         │                      │    MongoDB       │           │
│         │                      │    Database      │           │
│         │                      └─────────────────┘           │
│         │                                                     │
│         └─────────────────────────────────────┘              │
│                                                               │
│  Security Features:                                          │
│  • JWT Token Authentication                                  │
│  • Bcrypt Password Hashing                                   │
│  • Role-Based Access Control (RBAC)                         │
│  • Location Encryption                                       │
│  • SSL/TLS for Data in Transit                              │
│  • Sensitive Data Encryption at Rest                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 EMPLOYEE FEATURES

✅ Login with email & password  
✅ Clock In with GPS location  
✅ Clock Out with time tracking  
✅ View attendance history  
✅ View today's status  
✅ Real-time location accuracy  
✅ Offline support (pending sync)  
❌ Cannot see salary (403 error)  
❌ Cannot access admin panel  

---

## 👑 ADMIN FEATURES

✅ Everything employee can do  
✅ View all employee attendance with locations  
✅ Edit attendance manually  
✅ Exclusive salary dashboard  
✅ Manage employee salaries  
✅ Calculate payroll with location adjustments  
✅ Process salary payments  
✅ Generate attendance & payroll reports  
✅ Monitor employee locations  
✅ Manage employees (CRUD)  

---

## 💻 FRONTEND SETUP

### Prerequisites
```bash
# Install Node.js (v14+)
# Install Expo CLI
npm install -g expo-cli

# Install React Native CLI
npm install -g react-native-cli
```

### Project Initialization
```bash
# Create Expo project
expo init FMC-Attendance-Manager --template blank

# Navigate to project
cd FMC-Attendance-Manager

# Install dependencies
npm install

# Install required packages
npm install react-native axios @react-native-async-storage/async-storage expo-location
npm install @react-navigation/native @react-navigation/bottom-tabs
```

### Frontend Directory Structure
```
frontend/
├── App.js                    # Main app component
├── screens/
│   ├── LoginScreen.js       # Login UI
│   ├── EmployeeScreen.js    # Employee dashboard
│   └── AdminScreen.js       # Admin dashboard
├── components/
│   ├── ClockButton.js       # Clock In/Out button
│   ├── AttendanceCard.js    # Attendance display card
│   └── LocationDisplay.js   # Location info component
├── services/
│   ├── apiService.js        # API calls
│   ├── authService.js       # Auth logic
│   └── locationService.js   # GPS location service
├── utils/
│   ├── constants.js         # Constants & API URLs
│   ├── encryption.js        # Encryption utilities
│   └── validators.js        # Input validation
├── styles/
│   └── commonStyles.js      # Global styles
├── app.json                 # Expo config
├── package.json             # Dependencies
└── README.md               # Frontend docs
```

### Frontend Installation Steps

```bash
# Step 1: Create project
expo init FMC-Attendance-Manager

# Step 2: Install core dependencies
npm install axios @react-native-async-storage/async-storage expo-location

# Step 3: Install navigation (optional)
npm install @react-navigation/native react-native-screens react-native-safe-area-context

# Step 4: Create folder structure
mkdir -p screens components services utils styles

# Step 5: Add .gitignore
cat > .gitignore << EOF
node_modules/
.expo/
.expo-shared/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env
.env.local
EOF

# Step 6: Start development server
expo start
```

---

## 🔧 BACKEND SETUP

### Prerequisites
```bash
# Install Node.js (v14+)
# Install MongoDB locally or use MongoDB Atlas (cloud)
```

### Backend Initialization
```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken dotenv cors axios helmet

# Install dev dependencies
npm install -D nodemon

# Create folder structure
mkdir -p routes models middleware config utils
```

### Backend Directory Structure
```
backend/
├── server.js               # Main server file
├── config/
│   └── database.js        # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   ├── Attendance.js      # Attendance schema
│   └── Salary.js          # Salary schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── attendance.js      # Attendance routes
│   ├── admin.js           # Admin routes
│   └── salary.js          # Salary routes
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   ├── roleMiddleware.js  # Role-based access
│   └── errorHandler.js    # Error handling
├── utils/
│   ├── encryption.js      # Encryption utilities
│   ├── validators.js      # Input validation
│   └── helpers.js         # Helper functions
├── .env                   # Environment variables
├── .env.example           # Example env file
├── package.json           # Dependencies
└── README.md             # Backend docs
```

### Backend Installation Steps

```bash
# Step 1: Create backend directory
mkdir backend && cd backend

# Step 2: Initialize npm
npm init -y

# Step 3: Install dependencies
npm install express mongoose bcryptjs jsonwebtoken dotenv cors helmet express-validator

# Step 4: Install dev dependencies
npm install -D nodemon

# Step 5: Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fmc_db
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
NODE_ENV=development
EOF

# Step 6: Update package.json scripts
# Replace "scripts" section with:
cat > package.json << EOF
{
  "name": "fmc-backend",
  "version": "1.0.0",
  "description": "FMC Attendance Management Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "keywords": ["attendance", "salary"],
  "author": "Ghost",
  "license": "MIT"
}
EOF

# Step 7: Create folder structure
mkdir -p config models routes middleware utils

# Step 8: Start development server
npm run dev
```

---

## 🗄️ DATABASE SETUP

### MongoDB Setup (Local)

```bash
# Install MongoDB Community Edition
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongod

# Windows
# Download from https://www.mongodb.com/try/download/community
# Run installer and follow setup
# Start MongoDB service from Services
```

### MongoDB Setup (Cloud - MongoDB Atlas)

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free account
# 3. Create new cluster
# 4. Create database user with password
# 5. Get connection string
# 6. Add to .env:
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fmc_db?retryWrites=true&w=majority
```

### Database Schemas

#### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  phone: String,
  department: String,
  position: String,
  role: String (enum: ['employee', 'admin']),
  baseSalary: Number,
  status: String (enum: ['active', 'inactive', 'suspended']),
  profileImage: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### Attendance Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  employeeName: String,
  date: Date,
  status: String (enum: ['present', 'absent', 'half-day', 'sick-leave']),
  clockInTime: Date,
  clockOutTime: Date,
  hoursWorked: Number,
  clockInLocation: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    address: String,
    isInsideOffice: Boolean
  },
  clockOutLocation: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    address: String,
    isInsideOffice: Boolean
  },
  notes: String,
  editedBy: ObjectId (ref: User, null if not edited),
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Salary Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  employeeName: String,
  baseSalary: Number,
  month: Number (1-12),
  year: Number,
  workingDays: Number,
  presentDays: Number,
  absentDays: Number,
  halfDays: Number,
  salary: Number (calculated),
  deductions: Number,
  bonus: Number,
  netSalary: Number,
  paymentStatus: String (enum: ['pending', 'processed', 'paid']),
  paymentDate: Date,
  processedBy: ObjectId (ref: User, admin only),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API DOCUMENTATION

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### 1. Register User (Admin Only)
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "9876543210",
  "department": "Engineering",
  "position": "Developer",
  "baseSalary": 50000,
  "role": "employee"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "role": "employee"
  }
}
```

#### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "role": "employee",
    "baseSalary": 50000
  }
}
```

#### 3. Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Logout
```
POST /api/auth/logout
Headers:
  Authorization: Bearer {accessToken}

Response (200):
{
  "message": "Logout successful"
}
```

### Attendance Endpoints

#### 1. Clock In
```
POST /api/attendance/clock-in
Headers:
  Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "accuracy": 15.5,
  "address": "Office Location"
}

Response (201):
{
  "message": "Clocked in successfully",
  "attendance": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "date": "2026-07-22T00:00:00Z",
    "status": "present",
    "clockInTime": "2026-07-22T09:30:00Z",
    "clockInLocation": {
      "latitude": 28.7041,
      "longitude": 77.1025,
      "isInsideOffice": true
    }
  },
  "location": {
    "isInsideOffice": true,
    "message": "Inside Office"
  }
}
```

#### 2. Clock Out
```
POST /api/attendance/clock-out
Headers:
  Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "accuracy": 15.5,
  "address": "Office Location"
}

Response (200):
{
  "message": "Clocked out successfully",
  "hoursWorked": 8.5,
  "statusReason": "Full day worked",
  "attendance": {
    "_id": "507f1f77bcf86cd799439012",
    "clockOutTime": "2026-07-22T18:00:00Z",
    "status": "present"
  },
  "location": {
    "isInsideOffice": true,
    "message": "Inside Office"
  }
}
```

#### 3. Get Today's Status
```
GET /api/attendance/today
Headers:
  Authorization: Bearer {accessToken}

Response (200):
{
  "status": "present",
  "clockedIn": true,
  "clockInTime": "2026-07-22T09:30:00Z",
  "hoursWorked": 4.5,
  "clockInLocation": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "isInsideOffice": true
  }
}
```

#### 4. Get Attendance History
```
GET /api/attendance/history?month=7&year=2026
Headers:
  Authorization: Bearer {accessToken}

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "date": "2026-07-22T00:00:00Z",
      "status": "present",
      "clockInTime": "2026-07-22T09:30:00Z",
      "clockOutTime": "2026-07-22T18:00:00Z",
      "hoursWorked": 8.5
    }
  ],
  "totalDays": 22,
  "presentDays": 20,
  "absentDays": 2
}
```

### Admin Endpoints

#### 1. Get All Attendance Records
```
GET /api/admin/attendance/all?month=7&year=2026
Headers:
  Authorization: Bearer {accessToken}
  Role: admin

Response (200):
{
  "data": [
    {
      "employeeName": "John Doe",
      "date": "2026-07-22T00:00:00Z",
      "status": "present",
      "hoursWorked": 8.5
    }
  ],
  "total": 150
}
```

#### 2. Edit Attendance (Admin Only)
```
PUT /api/admin/attendance/:attendanceId
Headers:
  Authorization: Bearer {accessToken}
  Role: admin
Content-Type: application/json

{
  "status": "half-day",
  "notes": "Medical appointment",
  "clockInTime": "2026-07-22T10:00:00Z",
  "clockOutTime": "2026-07-22T14:00:00Z"
}

Response (200):
{
  "message": "Attendance updated successfully",
  "attendance": { ... }
}
```

### Salary Endpoints (Admin Only)

#### 1. Get All Employees
```
GET /api/admin/salary/employees
Headers:
  Authorization: Bearer {accessToken}
  Role: admin

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "baseSalary": 50000,
      "department": "Engineering"
    }
  ]
}
```

#### 2. Calculate Payroll
```
POST /api/admin/salary/calculate
Headers:
  Authorization: Bearer {accessToken}
  Role: admin
Content-Type: application/json

{
  "month": 7,
  "year": 2026,
  "employeeIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}

Response (200):
{
  "message": "Payroll calculated successfully",
  "salaries": [
    {
      "employeeId": "507f1f77bcf86cd799439011",
      "employeeName": "John Doe",
      "baseSalary": 50000,
      "workingDays": 22,
      "presentDays": 20,
      "salary": 45455
    }
  ]
}
```

#### 3. Process Salary Payment
```
POST /api/admin/salary/process
Headers:
  Authorization: Bearer {accessToken}
  Role: admin
Content-Type: application/json

{
  "salaryIds": ["507f1f77bcf86cd799439020"]
}

Response (200):
{
  "message": "Salary processed successfully",
  "processed": 1
}
```

#### 4. Get Salary Report
```
GET /api/admin/salary/report?month=7&year=2026
Headers:
  Authorization: Bearer {accessToken}
  Role: admin

Response (200):
{
  "month": 7,
  "year": 2026,
  "totalEmployees": 50,
  "totalSalary": 2500000,
  "totalDeductions": 100000,
  "totalNetSalary": 2400000,
  "salaries": [ ... ]
}
```

---

## 🛡️ SECURITY IMPLEMENTATION

### 1. Password Hashing (Bcrypt)

```javascript
// Backend: utils/encryption.js
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = { hashPassword, verifyPassword };
```

### 2. JWT Authentication

```javascript
// Backend: middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { verifyToken };
```

### 3. Role-Based Access Control

```javascript
// Backend: middleware/roleMiddleware.js
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Admin role required.' 
    });
  }
  next();
}

function requireEmployee(req, res, next) {
  if (req.user.role !== 'employee' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Employee role required.' 
    });
  }
  next();
}

module.exports = { requireAdmin, requireEmployee };
```

### 4. Salary Access Protection

```javascript
// Backend: routes/salary.js
router.get('/admin/salary', verifyToken, requireAdmin, (req, res) => {
  // Only admin can access
  res.json({ salary: 'confidential' });
});

// Employee trying to access salary
router.get('/salary', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Salary information is restricted to administrators only' 
    });
  }
  // ... rest of code
});
```

### 5. Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fmc_db
MONGODB_ATLAS_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/fmc_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_characters
REFRESH_TOKEN_EXPIRE=30d

# Security
BCRYPT_ROUNDS=10
ENCRYPTION_KEY=32_character_hex_key_for_encryption

# CORS
CORS_ORIGIN=http://localhost:19000

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Azure DevOps (optional)
AZURE_DEVOPS_TOKEN=your_token
AZURE_DEVOPS_ORG=your_organization
```

---

## 🚀 DEPLOYMENT GUIDE

### Deploy to Azure DevOps

#### 1. Create Azure DevOps Pipeline

Create `azure-pipelines.yml` in root directory:

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '14.x'
  mongoDBConnection: $(MONGODB_URI)

stages:
  - stage: Build
    jobs:
      - job: BuildBackend
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: |
              cd backend
              npm install
            displayName: 'Install Backend Dependencies'

          - script: |
              cd backend
              npm run build
            displayName: 'Build Backend'

          - task: PublishBuildArtifacts@1
            inputs:
              pathToPublish: 'backend'
              artifactName: 'backend'

  - stage: Test
    jobs:
      - job: UnitTests
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: |
              cd backend
              npm install
              npm run test
            displayName: 'Run Unit Tests'

  - stage: Deploy
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployToProduction
        environment: Production
        strategy:
          runOnce:
            deploy:
              steps:
                - task: DownloadBuildArtifacts@0
                  inputs:
                    artifactName: 'backend'

                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'Your-Azure-Subscription'
                    appType: 'webAppLinux'
                    appName: 'fmc-attendance-api'
                    package: '$(Pipeline.Workspace)/backend'
                    runtimeStack: 'NODE|14.x'
```

#### 2. Deploy Backend to Azure App Service

```bash
# Install Azure CLI
npm install -g azure-cli

# Login to Azure
az login

# Create resource group
az group create --name fmc-rg --location eastus

# Create App Service Plan
az appservice plan create \
  --name fmc-plan \
  --resource-group fmc-rg \
  --sku B1 --is-linux

# Create Web App
az webapp create \
  --resource-group fmc-rg \
  --plan fmc-plan \
  --name fmc-attendance-api \
  --runtime "NODE|14.x"

# Configure app settings
az webapp config appsettings set \
  --name fmc-attendance-api \
  --resource-group fmc-rg \
  --settings \
    MONGODB_URI="$MONGODB_URI" \
    JWT_SECRET="$JWT_SECRET" \
    NODE_ENV="production"
```

---

## 📱 Demo Accounts

### Employee Account
```
Email: emp@fmc.com
Password: password123
Role: Employee
```

### Admin Account
```
Email: admin@fmc.com
Password: password123
Role: Admin
```

### Test Account
```
Email: Manjeet805507@gmail.com
Password: Manjeet 1234
Role: Admin
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: "Cannot connect to API"
**Solution:**
```bash
# Check if backend is running
npm run dev

# Check API_URL in frontend
# For Android Emulator: http://10.0.2.2:5000/api
# For iOS Simulator: http://localhost:5000/api
# For Local Network: http://192.168.x.x:5000/api
```

### Issue 2: "Location permission denied"
**Solution:**
- Grant permissions in device settings
- Android: Settings > Apps > FMC > Permissions > Location > Allow
- iOS: Settings > FMC > Location > Always

### Issue 3: "JWT token expired"
**Solution:** Automatically refresh token using refresh endpoint

### Issue 4: "CORS error"
**Solution:** Ensure CORS is properly configured in backend server.js

### Issue 5: "MongoDB connection failed"
**Solution:** Check MongoDB status and ensure connection string is correct

### Issue 6: "Cannot access salary as employee"
**Expected behavior:** Status 403 Forbidden

---

## ✅ NEXT STEPS

1. Create folder structure
2. Set up frontend with React Native
3. Set up backend with Express.js
4. Configure MongoDB database
5. Implement authentication system
6. Add location tracking
7. Implement role-based access control
8. Create admin dashboard
9. Set up Azure DevOps CI/CD pipeline
10. Deploy to production

---

**🎉 You're all set to build FMC Attendance Manager!**

Happy coding! 🚀
