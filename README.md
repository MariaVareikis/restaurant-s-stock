# Restaurant Stock Management Application

## Overview

This project is a stock management application for a restaurant, built with **NestJS** for the backend and **Angular** for the frontend. It provides functionality to manage products, including retrieving all products, updating, soft deleting, adding new products, searching for products, and undoing recent deletions.

## Features

- **Get All Products**: Retrieve a list of all products in the stock.
- **Update Product**: Modify details of an existing product.
- **Soft Deleting**: Mark a product as deleted without removing it from the database.
- **Add Product**: Add new products to the stock.
- **Search Mechanism**: Search for products by name.
- **Undo Deletion**: Restore a product that was recently marked as deleted.

## Getting Started

To get started with the application, you need to install the necessary dependencies and start both the backend and frontend servers.

### Prerequisites

- Node.js (v18.0.0 or later)

### Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. **Install Backend Dependencies**

cd backend
npm install

3. **Install Frontend Dependencies**

cd ../frontend
npm install

### Running the Application

1. **Start the Backend Server**

cd backend
npm start

2. **Start the Frontend Application**

cd ../frontend
npm start

The backend server will be running on http://localhost:3000, and the frontend application will be accessible at http://localhost:4200.

### Project Structure
Backend: Contains the NestJS application that provides APIs for managing products.
Frontend: Contains the Angular application with a user interface for interacting with the backend APIs.