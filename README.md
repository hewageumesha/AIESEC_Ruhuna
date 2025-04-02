# AIESEC IN RUHUNA
Information management system for aiesc club to manage expenses:

# Expense Tracker

## Overview
A web application for managing and tracking expenses with a user-friendly, responsive UI. Built with React (frontend), Spring Boot (backend), and MySQL (database).

## Features
-  role-based access (LCP & LCVP can generate PDFs).
- Add, edit, delete, and view expenses.
- Invoice management.
- Responsive UI with a light-blue theme.

## Tech Stack
- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Spring Boot
- **Database**: MySQL

## Setup
### Prerequisites
- Node.js, npm, Java 17+, MySQL

### Installation
1. **Frontend**
   ```sh
   cd frontend && npm install && npm start
   ```
2. **Backend**
   ```sh
   cd backend && ./mvnw spring-boot:run
   ```
3. **Database**
   ```sql
   CREATE DATABASE expense_tracker;
   ```
   Update `application.properties` with credentials.

## Usage
1. Register/login.
2. Manage expenses.
3. Generate/download reports (LCP & LCVP).
4. Track invoices.

## Future Enhancements
- Budget tracking.
- Expense limit notifications.
- Multi-user expense sharing.

## License
MIT License.

