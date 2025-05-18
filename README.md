# AIESEC Ruhuna Web Application (Management Information System)

A fully-featured Management Information System (MIS) developed for AIESEC in Ruhuna to streamline and manage internal processes including event management, user registration, task tracking, finances, and merchandise.

## 🌐 Project Overview

This web-based system allows AIESEC members and guests to interact with the organization through a centralized platform. Key functionalities include:

- **User Role Management** (LCP, LCVP, Team Leaders, Members, Guests)
- **Event Management** (Creation, Registration, Experience Sharing, Merchandise)
- **Task Management**
- **Finance and Budget Tracking**
- **Birthday Management**
- **Event Analytics & Dashboards**
- **Role-Based Dashboards and Permissions**
- **Supabase-Integrated Image Gallery**
- **Public Event Access and Guest Registration**

---

## 🛠️ Technologies Used

### Backend
- **Spring Boot (Java)**
- RESTful API
- Spring Data JPA
- Hibernate
- MySQL / PostgreSQL

### Frontend
- **React.js**
- Ant Design v5.25.0
- Tailwind CSS
- Axios for API calls
- React Router

### Storage & Hosting
- **Supabase** (Image & File Storage)
- GitHub (Version Control)
- Render / Vercel / Firebase (Deployment options)

---

## 📂 Features by Module

### 👥 User Management
- Role-based login (AIESEC Email + Password)
- User profile with unique AIESEC ID, email, and description
- Role-specific dashboard views

### 📅 Event Management
- Add, update, delete, and view events (LCP/LCVP only)
- Event registration (Members & Guests)
- Public event visibility
- Event rating, testimonials, and image gallery
- Event experience sharing
- T-shirt ordering system
- Duplicate registration prevention

### 📈 Dashboard
- Dynamic dashboard for LCP, LCVP, TL
- Statistics: upcoming/past events, attendee count, charts
- Engagement metrics (e.g., most popular event)
- Recent activity log
- Event performance analytics (CSV export)

### 🎨 Gallery
- Upload and display images using Supabase
- Grouped event folders (e.g., LDS3.0, LDS4.0)

### 👕 Merchandise
- Event-specific T-shirt orders
- Role-based access to manage orders
- Images and descriptions displayed on event details

### 🎂 Birthday & Finance
- Track member birthdays
- Manage internal financial transactions

---

## 🚀 Getting Started

### Backend Setup (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run

cd frontend
npm install
npm run dev

