# StaffSphere &mdash; Unified Workforce Management System Guide

> **StaffSphere**: *Empowering People. Simplifying Work.*

## Overview
StaffSphere is a full-stack workforce and employee management system unified into **one single project**. The Angular frontend is built directly into Spring Boot's static resources, meaning you only run **one server** that serves both the frontend user interface and the backend REST API on the same port (`8081`).

---

## Key Benefits of Unified Project
- **One Application to Run**: You only need to run Spring Boot. No separate frontend dev server required.
- **One Port**: Both the UI and REST APIs are served from `http://localhost:8081`.
- **Zero CORS Issues**: Frontend and backend share the same origin (`http://localhost:8081`).
- **Single Page Application (SPA) Routing**: Spring Boot seamlessly forwards all client routes (`/login`, `/register`, `/employees`, `/forgot-password`, etc.) to Angular's `index.html`.

---

## Quick Start (Run in 1 Step)

### Prerequisite: MySQL Database
Make sure MySQL is running on port `3306`:
- **Database**: `crud_db`
- **Username**: `root`
- **Password**: *(empty by default)*

### Option A: Double-Click or Run the Batch File
Run `run.bat` in the project root:
```cmd
run.bat
```

### Option B: PowerShell
```powershell
.\run.ps1
```

### Option C: Manual Command
```powershell
cd CRUD_Spring
$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
.\mvnw.cmd spring-boot:run
```

Once started, open your browser:
- **Application UI**: [http://localhost:8081](http://localhost:8081)
- **REST API**: [http://localhost:8081/api/employees](http://localhost:8081/api/employees)

---

## Rebuilding the Project

If you make changes to either the Angular frontend or Spring Boot backend:

### Option A: Using the Build Script
Run `build.bat` or `build.ps1` in the project root:
```cmd
build.bat
```
*(This builds Angular directly into `CRUD_Spring/src/main/resources/static/` and recompiles Spring Boot).*

### Option B: Manual Steps
```powershell
# 1. Build Angular
cd EmployeeMS
npm run build

# 2. Compile Spring Boot
cd ..\CRUD_Spring
$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
.\mvnw.cmd compile
```

---

## Optional: Independent Frontend Development Mode
If you want to edit Angular with live hot-reloading:
1. Start Spring Boot (`http://localhost:8081`)
2. In a second terminal:
   ```powershell
   cd EmployeeMS
   npm start
   ```
3. Open [http://localhost:4200](http://localhost:4200) (requests to `/api` are automatically proxied to Spring Boot on port 8081 via `proxy.conf.json`).

---

## API Endpoints Summary

- `POST /api/auth/register` &mdash; Create user account
- `POST /api/auth/login` &mdash; User authentication
- `POST /api/auth/forgot-password` &mdash; Request reset token via email
- `POST /api/auth/reset-password` &mdash; Reset password with token
- `GET /api/employees` &mdash; Get all employees (filtered by authenticated user header `X-Username`)
- `GET /api/employees/{id}` &mdash; Get employee by ID
- `POST /api/employees` &mdash; Create employee
- `PUT /api/employees/{id}` &mdash; Update employee
- `DELETE /api/employees/{id}` &mdash; Delete employee
