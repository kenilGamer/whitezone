# API Documentation

This document provides an overview of the API endpoints available in this project.

## Authentication

- **POST /api/auth/[...nextauth]**: Handles authentication using NextAuth.js. See `src/app/api/auth/[...nextauth]/options.ts` for configuration details.
  - **Request**: Send credentials in the request body.
  - **Response**: Returns a session token upon successful authentication.

## Google Login

- **POST /api/auth/google**: Handles Google authentication.
  - **Request**: Send Google credentials in the request body.
  - **Response**: Returns a session token upon successful authentication.

## Products

- **GET /api/products**: Retrieves a list of products.
  - **Request**: No request body required.
  - **Response**: Returns an array of product objects.
- **POST /api/products**: Creates a new product.
  - **Request**: Send product details in the request body.
  - **Response**: Returns the created product object.
- **PUT /api/products/:id**: Updates an existing product.
  - **Request**: Send updated product details in the request body.
  - **Response**: Returns the updated product object.
- **DELETE /api/products/:id**: Deletes a product.
  - **Request**: No request body required.
  - **Response**: Returns a success message.

## Sign Up

- **POST /api/sign-up**: Handles user registration.
  - **Request**: Send user registration details in the request body.
  - **Response**: Returns a success message or error details.

## Additional Information

For more details on each endpoint, refer to the corresponding route files in the `src/app/api/` directory.

---

Feel free to add more detailed examples or specific use cases as needed. 