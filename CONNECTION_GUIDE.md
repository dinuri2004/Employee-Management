# Connection Guide: CRUD_Spring + EmployeeMS

## Overview
The EmployeeMS Angular frontend is now configured to work with the CRUD_Spring Boot backend.

## What Was Changed

### EmployeeMS (Angular Frontend)
1. **Employee Model** - Updated to match Spring Boot backend structure:
   - `firstName` and `lastName` (instead of single `name` field)
   - Removed `position` and `salary` fields
   - Added optional `id` field

2. **Employee Service** - Updated API endpoint:
   - Changed from `http://localhost:3000/employees` to `http://localhost:8080/api/employees`
   - Added `getEmployee(id)` method
   - Updated `updateEmployee()` to accept id and employee separately

3. **Employee List Component**:
   - Updated table columns to display `firstName` and `lastName`
   - Added navigation to add/edit forms
   - Added error handling with user-friendly messages

4. **Employee Form Component**:
   - Created full CRUD form with reactive forms
   - Added validation for all fields
   - Supports both add and edit modes

5. **App Component**:
   - Simplified to use Angular Router
   - Added router outlet for navigation

6. **Routing**:
   - `/employees` - Employee list page
   - `/employees/new` - Add new employee
   - `/employees/edit/:id` - Edit existing employee

### CRUD_Spring (Spring Boot Backend)
- No changes needed - already has:
  - CORS enabled (`@CrossOrigin(origins = "*")`)
  - REST endpoints at `/api/employees`
  - Full CRUD operations (GET, POST, PUT, DELETE)

## How to Run

### 1. Start Spring Boot Backend
```bash
cd CRUD_Spring
# Make sure MySQL is running on localhost:3306
# Database: crud_db, Username: root, Password: (empty)
mvnw spring-boot:run
```
The backend will run on **http://localhost:8080**

### 2. Start Angular Frontend
```bash
cd EmployeeMS
npm install  # First time only
npm start
```
The frontend will run on **http://localhost:4200**

### 3. Access the Application
Open your browser and navigate to:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api/employees

## Database Setup

Make sure MySQL is running with:
- **Database**: `crud_db`
- **Username**: `root`
- **Password**: (empty)

The Spring Boot app will automatically create the `employee` table on first run (thanks to `spring.jpa.hibernate.ddl-auto=update`).

## Testing the Connection

1. Start both applications
2. Open http://localhost:4200 in your browser
3. You should see the Employee List page
4. Click "Add Employee" to add a new employee
5. Fill in the form and submit
6. The employee should appear in the list

If you see an error like "Failed to load employees", make sure:
- Spring Boot backend is running on port 8080
- MySQL database is accessible
- The database credentials in `application.properties` are correct

## Employee Data Structure

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

## API Endpoints

- `GET /api/employees` - Get all employees
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

## Troubleshooting

**CORS Errors**: The backend has CORS enabled for all origins. If you still see CORS errors, check browser console for details.

**Connection Refused**: Make sure the Spring Boot backend is running on port 8080.

**Database Errors**: Verify MySQL is running and the database `crud_db` exists.

**Port Already in Use**: 
- Backend (8080): Stop other Java applications or change the port in `application.properties`
- Frontend (4200): Stop other Angular apps or use `ng serve --port 4201`
