# Horarios App Backend

This is the backend for the Horarios App, built with Node.js, Express, and MongoDB. It provides RESTful APIs for user authentication, user management, and schedule management.

## Features

- User authentication (registration, login)
- User management
- Schedule management (create, read, update, delete)
- JWT for authentication
- Password hashing with bcryptjs
- API documentation with Swagger

## Technologies Used

- Node.js
- Express.js
- MongoDB (via Mongoose)
- bcryptjs
- jsonwebtoken
- express-validator
- cors
- dotenv
- swagger-jsdoc
- swagger-ui-express

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- MongoDB instance (local or cloud-based)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DavidValenciaX/horarios_app_backend.git
   cd horarios_app/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

   Replace `your_mongodb_connection_string` with your MongoDB connection URI and `your_jwt_secret` with a strong, random string.

### Running the Application

- To start the server in development mode (with nodemon):

  ```bash
  npm run server
  ```

- To start the server in production mode:

  ```bash
  npm start
  ```

The API will be running on `http://localhost:5000` (or the PORT you specified in `.env`).

## API Endpoints

API documentation is available at `http://localhost:5000/api-docs` when the server is running.

### Users

- `POST /api/users` - Register a new user

### Auth

- `POST /api/auth` - Authenticate user & get token
- `GET /api/auth` - Get logged in user (requires token)

### Schedules

- `GET /api/schedules` - Get all schedules for the logged in user
- `POST /api/schedules` - Create a new schedule
- `PUT /api/schedules/:id` - Update a schedule by ID
- `DELETE /api/schedules/:id` - Delete a schedule by ID

## Project Structure

```bash
├── .env
.gitignore
package-lock.json
package.json
server.js
config/
├── db.js
└── swagger.js
middleware/
└── auth.js
models/
├── Schedule.js
└── User.js
routes/
└── api/
    ├── auth.js
    ├── schedules.js
    └── users.js
```
