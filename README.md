

# FunApp API

The FunApp API allows user registration and profile management. It provides endpoints for signing up users and retrieving user profile data.

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Sign up a new user](#sign-up-a-new-user)
  - [Get user profile data](#get-user-profile-data)
- [Validation](#validation)
- [Testing](#testing)

## Installation

### Prerequisites

- Node.js >= 16.0.0
- PostgreSQL (Database)
- NestJS CLI

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/kimo12345678/fun-app.git
   cd fun-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the PostgreSQL database and configure the connection in the `src/app.module.ts` file.

4. Run the application:
   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000`.

## API Endpoints

### Sign up a new user

#### Endpoint

- `POST /users/signup`

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "latitude": 30.0444,
  "longitude": 31.2357
}
```

- `name`: User's name.
- `email`: User's email address (must be valid).
- `latitude`: Latitude coordinate (must be between 22.0 and 34.0).
- `longitude`: Longitude coordinate (must be between 24.0 and 37.0).

#### Response

- `201` (Created):
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "latitude": 30.0444,
    "longitude": 31.2357,
    "city": "Cairo",
    "created_at": "2024-11-14T12:00:00Z",
    "updated_at": "2024-11-14T12:00:00Z"
  }
  ```

- `400` (Bad Request):
  - Invalid location (latitude or longitude outside Egypt).
  - Invalid email format.
  - Missing required fields.

### Get user profile data

#### Endpoint

- `GET /users/:id`

#### Request Params

- `id`: The ID of the user.

#### Response

- `200` (OK):
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "latitude": 30.0444,
    "longitude": 31.2357,
    "city": "Cairo",
    "created_at": "2024-11-14T12:00:00Z",
    "updated_at": "2024-11-14T12:00:00Z"
  }
  ```

- `404` (Not Found):
  - User with the provided ID does not exist.

## Validation

The following validation rules are applied to the `CreateUserDto`:

- `name`: Must be a non-empty string.
- `email`: Must be a valid email address format.
- `latitude`: Must be a decimal number between `22.0` and `34.0`.
- `longitude`: Must be a decimal number between `24.0` and `37.0`.

If any validation rule fails, a `BadRequestException` will be thrown, with a detailed message about the failure.

## Testing

### Unit Tests

The project includes tests for both the `UserController` and `UserService`.

- To run tests:
  ```bash
  npm run test
  ```

### Key Tests

1. **User Sign Up**:
   - Successful user creation.
   - Invalid location (outside Egypt).
   - Invalid email format.

2. **Get User By ID**:
   - Return user data by ID.
   - Handle user not found scenario (404 error).

3. **SQL Injection Prevention**:
   - Ensure the application prevents SQL injection attacks through ID parameters.

---
