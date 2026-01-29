# SJSilvers - Premium Jewelry E-Commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for an online jewelry store. This project features a modern, responsive frontend built with Vite and Tailwind/CSS, and a robust backend API.

## 🚀 Features

### 🛍️ Customer Experience
- **Authentication**: User secure Login and Registration with JWT.
- **Product Browsing**: Filter products by Category, Metal (Gold/Silver), Purity, Gender, and Price.
- **Product Search**: Real-time search functionality.
- **Product Details**: View detailed specifications, multiple images, and customer reviews.
- **Shopping Cart**: Add items, update quantities, removing items, and live price calculation.
- **Wishlist**: Save favorite items to your profile (persists across sessions).
- **User Dashboard**: View order history and manage profile/addresses.

### 👑 Admin Dashboard
- **Analytics**: Overview of Total Users, Products, Orders, and Revenue.
- **Product Management**:
  - **Create**: Add new products with details and image URLs.
  - **Edit**: Update existing product inventory and prices.
  - **Delete**: Remove products from the catalog.
- **Order Management**: View all customer orders (Coming Soon).

## 🛠️ Tech Stack

**Frontend:**
- **React** (Vite)
- **Redux Toolkit** (State Management)
- **React Router DOM** (Navigation)
- **React Icons** & **Toastify** (UI/UX)
- **Axios** (API Client)

**Backend:**
- **Node.js** & **Express**
- **MongoDB** (Mongoose ODM)
- **JWT** (JSON Web Tokens for Auth)
- **Bcryptjs** (Password Hashing)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd sjsilvers
    ```

2.  **Install Dependencies**
    This project uses a single `package.json` to manage both frontend and backend scripts/dependencies (or standard structure).
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory (copy from `.env.example` if available).
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Run the Application**
    We use `concurrently` to run both Client (Vite) and Server (Node) in a single terminal.
    ```bash
    npm run dev:full
    ```
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5000`

## 🛡️ Admin Access

By default, new users are standard `user` role. To access the Admin Dashboard:

1.  Register a new account on the website.
2.  Use the provided script to promote a user to Admin:
    ```bash
    node update_admin.js
    ```
    *(Edit `update_admin.js` to target your email before running)*

## 📂 Project Structure

- `src/` - React Frontend
  - `pages/` - Route components (Home, Shop, Admin/*)
  - `components/` - Reusable UI (ProductCard, Header, Admin Forms)
  - `redux/` - Global state management
- `backend/` - Node/Express Server
  - `models/` - Mongoose Schemas (User, Product, Cart, Order)
  - `controllers/` - Logic for routes
  - `routes/` - API endpoints
  - `middleware/` - Auth & Admin protection

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
