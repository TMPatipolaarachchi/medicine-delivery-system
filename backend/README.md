# Medicine Ordering Backend README

## Introduction
This is the backend API for a Medicine Ordering System, built using Node.js, Express, MongoDB, and Mongoose. It uses JWT for authentication and includes full functionality for User, Admin, Category, Medicine Catalog, Shopping Cart, and Orders with Payments.

## Stack
- Node.js
- Express.js
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## Commands
- `npm install` - Install dependencies
- `npm run dev` - Run server in development mode using Nodemon
- `npm start` - Run server in production

## API Endpoints

### User & Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Authenticate user & get token
- `POST /api/users/logout` - Logout a user
- `GET /api/users/profile` - Get user profile (Private)
- `PUT /api/users/profile` - Update user profile (Private)

### Categories
- `GET /api/categories` - Fetch all categories
- `POST /api/categories` - Create a category (Private/Admin)
- `PUT /api/categories/:id` - Update a category (Private/Admin)
- `DELETE /api/categories/:id` - Delete a category (Private/Admin)

### Medicines
- `GET /api/medicines` - Fetch all medicine items
- `POST /api/medicines` - Create a new medicine item (Private/Admin)
- `PUT /api/medicines/:id` - Update a medicine item (Private/Admin)
- `DELETE /api/medicines/:id` - Delete a medicine item (Private/Admin)
- `GET /api/foods` - Backward-compatible alias for legacy clients

### Cart
- `GET /api/cart` - Get user's cart (Private)
- `POST /api/cart` - Add an item to the cart (Private)
- `PUT /api/cart/:itemId` - Update an item quantity in the cart (Private)
- `DELETE /api/cart/:itemId` - Remove an item from the cart (Private)

### Orders & Payments
- `POST /api/orders` - Place an order (Private)
- `GET /api/orders/myorders` - Get logged-in user orders (Private)
- `GET /api/orders/:id` - Get order by ID (Private)
- `PUT /api/orders/:id/pay` - Update order to paid Status (Private)

## Controllers Error Handling
All async routes are handled properly to pipe errors into error middleware, returning JSON correctly and safely formatted avoiding raw stack trace leaking in production.

Happy Coding!
