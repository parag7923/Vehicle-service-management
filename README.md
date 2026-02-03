# Vehicle service management – Full Stack Web Application

 Vehicle service management is a full-stack web application developed using **Spring Boot** for the backend and **Angular** for the frontend.  
It implements **JWT-based authentication**, **role-based authorization**, and uses **MySQL** for persistent data storage.

---

## Tech Stack

### Frontend
- Angular
- TypeScript
- HTML / CSS

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- Hibernate / JPA

### Database
- MySQL

---

## Key Features

- User Registration and Login
- JWT-based Stateless Authentication
- Role-based Authorization (USER / ADMIN)
- Secure REST APIs
- CORS configuration for frontend-backend communication
- Swagger API Documentation

---

## Project Structure

Gladiator/
├── angularapp/ # Angular frontend
├── springapp/ # Spring Boot backend
├── .gitignore
└── README.md


---

## Backend Setup (Spring Boot)

### 1. Database Configuration
Create a MySQL database:
```sql
CREATE DATABASE appdb;
```
## Configure database details in application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/appdb
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

Note: Sensitive files are excluded using .gitignore.
Use application.example.properties as reference.

### 2. Run Backend Server
cd springapp
mvn spring-boot:run


### 3. Swagger API Documentation
http://localhost:8080/swagger-ui.html

## Frontend Setup (Angular)
### 1. Install Dependencies
cd angularapp
npm install

### 2. Run Angular Application
ng serve --port 8081


Frontend will be available at:

http://localhost:8081


