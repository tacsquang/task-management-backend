# Task Management Backend

Backend API for task management system built with NestJS.

> ⚠️ **Development Status**: This project is currently under active development. Some features may be incomplete or subject to change. I'm working on improving stability and adding new features.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Docker](#docker)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Demo](#demo)
- [Contributing](#contributing)

## Features

- User authentication (JWT, Google OAuth)
- Task management (CRUD operations)
- Project organization
- Push notifications
- Task filtering and status tracking
- API Documentation with Swagger
- Email verification with OTP using Mailjet

## Tech Stack

- NestJS
- PostgreSQL
- JWT & Google OAuth2
- Firebase Cloud Messaging
- Swagger/OpenAPI
- Docker & Docker Compose (Basic)

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Firebase project (for notifications)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-management-backend.git
   cd task-management-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the values in `.env` file.

4. Start the server:
   ```bash
   npm run start:dev
   ```

### Docker

```bash
# Build
docker build -t task-management-backend .

# Run
docker run -p 8080:8080 task-management-backend
```

## API Documentation

The API documentation is available through Swagger UI. After starting the server, you can access it at:

```
http://localhost:8080/api
```

The Swagger UI provides:
- Interactive API documentation
- Request/response examples
- Authentication requirements
- API endpoints testing interface
- Schema definitions
- Response models

Below are some screenshots of the API documentation interface:

![Swagger UI Overview](docs/images/swagger-01.png)
![API Endpoint Example](docs/images/swagger-02.png)
![API Endpoint Example](docs/images/swagger-03.png)

## Environment Variables

```env
# Application
PORT=8080
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=task_management

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

#OAuth2
GOOGLE_CLIENT_ID=your-id-key
GOOGLE_CLIENT_SECRET=your-secret-key
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

#MailJet
MAILJET_API_KEY=your-api-key
MAILJET_API_SECRET=your-secret-key
MAIL_FROM=your-email

#Firebase
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_VAPID_KEY=your-vapid-key
```

## Project Structure

```
src/
├── config/            # Configuration files
├── common/           # Common utilities and interfaces
├── modules/          # Feature modules
│   ├── auth/        # Authentication
│   ├── users/       # User management
│   ├── tasks/       # Task management
│   ├── projects/    # Project management
│   └── notification/# Notifications
├── shared/          # Shared utilities and middleware
│   ├── swagger/     # Swagger configuration and decorators
│   └── utils/       # Common utilities
├── app.module.ts    # Root application module
├── app.controller.ts# Root application controller
├── app.service.ts   # Root application service
└── main.ts         # Application entry point

docs/               # Documentation and images
firebase/           # Firebase configuration
dist/              # Compiled output
```

## Upcoming Features
- [ ] Admin Management
- [ ] Rate limiting
- [ ] Caching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Demo

### Live Demo
- Backend API: [https://task-management-be.onrender.com](https://task-management-backend-9ilu.onrender.com)
- API Documentation: [https://task-management-be.onrender.com/api](https://task-management-backend-9ilu.onrender.com/api)

Note: This is a demo environment running on Render's free tier, which may have some limitations on performance and uptime.

