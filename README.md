# AIESEC Ruhuna Web Application (Management Information System)

A fully-featured Management Information System (MIS) developed for AIESEC in Ruhuna to streamline and manage internal processes, including event management, user registration, task tracking, finances, and merchandise.

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

## 🚀 Getting Started

### Backend and Frontend Setup

```bash
cd backend
./mvnw spring-boot:run

cd frontend
npm install
npm run dev

