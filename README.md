# Tiffin Service Center Backend (Node.js + MySQL)

## Overview

This is a backend system for a **Tiffin Service Center** built using **Node.js** (no Express) and **MySQL** for data management. The server provides functionalities for managing orders, menus, feedback, and user authentication.

## Features

- **User Authentication**: JWT-based login & signup
- **Order Management**: Place and view orders
- **Menu Management**: View today's menu
- **Feedback System**: Users can rate and comment on meals
- **Admin Panel**: View all orders & feedback
- **Scalability**: Modular structure for easy expansion

## Tech Stack

- **Node.js**: Backend API
- **MySQL**: Database for storing users, orders, menus, and feedback
- **JWT**: Authentication (Bearer token)
- **mysql2**: MySQL client for Node.js
- **Postman**: API testing

## Installation

1. Clone the repository:

2. Install dependencies:

3. Configure the database:
- Setup MySQL and create the required tables using the SQL file provided in `db/tables.sql`
- Update `config.js` with your MySQL credentials.

4. Start the server:

The server will run on `http://localhost:3000`.

## API Endpoints

### **User**

- **POST** `/api/signup`: Sign up a new user
- **POST** `/api/login`: Log in a user and return a JWT
- **GET** `/api/orders`: Get all orders placed by the authenticated user
- **POST** `/api/order`: Place a new order

### **Admin**

- **GET** `/api/admin/orders`: Get all orders (Admin only)
- **GET** `/api/admin/feedback`: Get all feedback (Admin only)

## Database Schema

### Users

- id
- name
- email
- phone
- password
- address
- token
- created_at

### Orders

- id
- user_id
- meal_type
- quantity
- delivery_time
- status
- created_at

### Feedback

- id
- user_id
- rating
- comments
- created_at

---

## Future Enhancements

- **Payment Gateway**: Integrate payment system (Stripe, PayPal)
- **Admin Dashboard**: A front-end dashboard for admins
- **Email Notifications**: Notify users about order status, promotions, etc.
- **Scaling**: Implement caching (Redis) and deploy using Docker/Kubernetes


