# API Documentation

This document provides an overview of the API endpoints available in this project.

## Authentication

- **POST /api/auth/[...nextauth]**: Handles authentication using NextAuth.js. See `src/app/api/auth/[...nextauth]/options.ts` for configuration details.

## Products

- **GET /api/products**: Retrieves a list of products.
- **POST /api/products**: Creates a new product.
- **PUT /api/products/:id**: Updates an existing product.
- **DELETE /api/products/:id**: Deletes a product.

## Sign Up

- **POST /api/sign-up**: Handles user registration.

## Additional Information

For more details on each endpoint, refer to the corresponding route files in the `src/app/api/` directory. 