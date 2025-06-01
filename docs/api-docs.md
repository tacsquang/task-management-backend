# API Documentation for Task Management Backend

## Response Format

### Success Response
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Authentication Module (`/auth`)

### Login
- **Endpoint:** `POST /auth/login`
- **Description:** Logs in a user and returns a JWT token
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Login successfully!",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Response (401 Unauthorized):**
  ```json
  {
    "statusCode": 401,
    "message": "Invalid credentials",
    "error": "Unauthorized"
  }
  ```

### Logout
- **Endpoint:** `POST /auth/logout`
- **Description:** Logs out the current user
- **Headers:**
  - `Authorization: Bearer <token>` (Required)
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Logout successfully",
    "data": null
  }
  ```

### Register
- **Endpoint:** `POST /auth/register`
- **Description:** Registers a new user
- **Request Body:**
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "message": "Register successfully",
    "data": {
      "id": "uuid"
    }
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "statusCode": 400,
    "message": "Email already exists",
    "error": "Bad Request"
  }
  ```

### Google Authentication
- **Endpoint:** `GET /auth/google`
- **Description:** Initiates Google authentication flow
- **Response:** Redirects to Google login page

- **Endpoint:** `GET /auth/google/callback`
- **Description:** Callback URI for Google authentication
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Login successfully!",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### OTP Verification
- **Endpoint:** `POST /auth/otp/request-verification`
- **Description:** Requests a verification OTP
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Verification OTP sent successfully",
    "data": null
  }
  ```

- **Endpoint:** `POST /auth/otp/verify`
- **Description:** Verifies an OTP code
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "code": "123456"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "OTP verified successfully",
    "data": null
  }
  ```

### Password Reset
- **Endpoint:** `POST /auth/request-reset-password`
- **Description:** Requests a password reset OTP
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Password reset OTP sent successfully",
    "data": null
  }
  ```

- **Endpoint:** `POST /auth/reset-password`
- **Description:** Resets password using OTP
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "code": "123456",
    "newPassword": "newpassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Password reset successfully",
    "data": null
  }
  ```

## User Module (`/me`)

*Note: All endpoints in this module require JWT authentication.*

### Get Profile
- **Endpoint:** `GET /me`
- **Description:** Gets the profile information of the current authenticated user
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Profile retrieved successfully",
    "data": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "is_active": true,
      "avatar": "avatar_url",
      "role": "user",
      "provider": "local"
    }
  }
  ```

### Update Profile
- **Endpoint:** `PATCH /me`
- **Description:** Updates the profile information of the current authenticated user
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "avatar": "new_avatar_url"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Update successful",
    "data": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Updated Name",
      "is_active": true,
      "avatar": "new_avatar_url",
      "role": "user",
      "provider": "local"
    }
  }
  ```

### Update Device Token
- **Endpoint:** `PATCH /me/device-token`
- **Description:** Updates the FCM device token for the current authenticated user
- **Request Body:**
  ```json
  {
    "device_fcm_token": "fcm_token_string"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Device token updated successfully",
    "data": []
  }
  ```

## Task Groups Module (`/task-groups`)

*Note: All endpoints in this module require JWT authentication.*

### Create Task Group
- **Endpoint:** `POST /task-groups`
- **Description:** Creates a new task group
- **Request Body:**
  ```json
  {
    "name": "Task Group Name",
    "description": "Task Group Description"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "message": "Task group created successfully",
    "data": {
      "id": "uuid",
      "name": "Task Group Name",
      "description": "Task Group Description"
    }
  }
  ```

### Get Task Groups
- **Endpoint:** `GET /task-groups`
- **Description:** Gets a list of task groups belonging to the current user
- **Query Parameters:**
  - `page` (Optional): Page number (starts from 1), default: 1
  - `limit` (Optional): Number of items per page, default: 10
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Successfully retrieved task groups",
    "data": {
      "taskGroups": [
        {
          "id": "uuid",
          "name": "Task Group 1",
          "description": "Description 1"
        }
      ],
      "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10
      }
    }
  }
  ```

### Update Task Group
- **Endpoint:** `PATCH /task-groups/:id`
- **Description:** Updates a task group by ID
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "description": "Updated Description"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Task group updated successfully",
    "data": {
      "id": "uuid",
      "name": "Updated Name",
      "description": "Updated Description"
    }
  }
  ```

### Delete Task Group
- **Endpoint:** `DELETE /task-groups/:id`
- **Description:** Deletes a task group by ID
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Task group deleted successfully",
    "data": []
  }
  ```

## Projects Module (`/projects`)

*Note: All endpoints in this module require JWT authentication.*

### Create Project
- **Endpoint:** `POST /projects`
- **Description:** Creates a new project
- **Request Body:**
  ```json
  {
    "name": "Project Name",
    "description": "Project Description",
    "start_date": "2024-03-20",
    "end_date": "2024-04-20",
    "logo_image": "logo_url",
    "task_group_id": "task_group_uuid"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "message": "Project created successfully",
    "data": {
      "id": "uuid",
      "name": "Project Name",
      "description": "Project Description",
      "start_date": "2024-03-20",
      "end_date": "2024-04-20",
      "logo_image": "logo_url"
    }
  }
  ```

### Update Project
- **Endpoint:** `PATCH /projects/:id`
- **Description:** Updates a project by ID
- **Request Body:**
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated Description",
    "start_date": "2024-03-21",
    "end_date": "2024-04-21",
    "logo_image": "new_logo_url",
    "task_group_id": "new_task_group_uuid"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Project updated successfully",
    "data": {
      "id": "uuid",
      "name": "Updated Project Name",
      "description": "Updated Description",
      "start_date": "2024-03-21",
      "end_date": "2024-04-21",
      "logo_image": "new_logo_url"
    }
  }
  ```

### Delete Project
- **Endpoint:** `DELETE /projects/:id`
- **Description:** Deletes a project by ID
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Project deleted successfully",
    "data": []
  }
  ```

### Get Projects by Task Group
- **Endpoint:** `GET /projects/task-group/:taskGroupId`
- **Description:** Gets a list of projects belonging to a specific task group
- **Query Parameters:**
  - `page` (Optional): Page number (starts from 1), default: 1
  - `limit` (Optional): Number of items per page, default: 10
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Projects retrieved successfully",
    "data": {
      "projects": [
        {
          "id": "uuid",
          "name": "Project 1",
          "description": "Description 1",
          "start_date": "2024-03-20",
          "end_date": "2024-04-20",
          "logo_image": "logo_url"
        }
      ],
      "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10
      }
    }
  }
  ```

## Tasks Module (`/tasks`)

*Note: All endpoints in this module require JWT authentication.*

### Get Tasks by Project
- **Endpoint:** `GET /tasks/project/:projectId`
- **Description:** Gets a list of tasks belonging to a specific project
- **Query Parameters:**
  - `page` (Optional): Page number (starts from 1), default: 1
  - `limit` (Optional): Number of items per page, default: 10
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Tasks retrieved successfully",
    "data": {
      "tasks": [
        {
          "id": "uuid",
          "title": "Task Title",
          "status": "todo",
          "due_at": "2024-03-25T10:00:00Z",
          "notify_enabled": true,
          "notify_offset_minutes": 30,
        }
      ],
      "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10
      }
    }
  }
  ```

### Create Task
- **Endpoint:** `POST /tasks`
- **Description:** Creates a new task
- **Request Body:**
  ```json
  {
    "title": "Task Title",
    "status": "todo",
    "due_at": "2024-03-25T10:00:00Z",
    "project_id": "project_uuid"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "message": "Task created successfully",
    "data": {
      "id": "uuid",
      "title": "Task Title",
      "status": "todo",
      "due_at": "2024-03-25T10:00:00Z",
      "notify_enabled": true,
      "notify_offset_minutes": 30,
    }
  }
  ```

### Update Task
- **Endpoint:** `PATCH /tasks/:id`
- **Description:** Updates a task by ID
- **Request Body:**
  ```json
  {
    "title": "Updated Task Title",
    "status": "in_progress",
    "due_at": "2024-03-26T10:00:00Z"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Task updated successfully",
    "data": {
      "id": "uuid",
      "title": "Updated Task Title",
      "status": "in_progress",
      "due_at": "2024-03-26T10:00:00Z",
      "notify_enabled": true,
      "notify_offset_minutes": 30,
    }
  }
  ```

### Delete Task
- **Endpoint:** `DELETE /tasks/:id`
- **Description:** Deletes a task by ID
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Task deleted successfully",
    "data": []
  }
  ```

### Filter Tasks by Date and Status
- **Endpoint:** `GET /tasks/today`
- **Description:** Filters tasks by date and status
- **Query Parameters:**
  - `date` (Required): Date in YYYY-MM-DD format
  - `status` (Optional): One of 'all', 'todo', 'inprogress', 'done'
  - `page` (Optional): Page number (starts from 1), default: 1
  - `limit` (Optional): Number of items per page, default: 10
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Tasks filtered successfully",
    "data": {
      "tasks": [
        {
          "id": "uuid",
          "title": "Task Title",
          "status": "todo",
          "due_at": "2024-03-25T10:00:00Z",
          "notify_enabled": true,
          "notify_offset_minutes": 30,
        }
      ],
      "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10
      }
    }
  }
  ```

## Notification Module (`/notifications`)

*Note: All endpoints in this module require JWT authentication.*

### Get User Notifications
- **Endpoint:** `GET /notifications`
- **Description:** Gets a list of notifications for the current user
- **Query Parameters:**
  - `page` (Optional): Page number (starts from 1), default: 1
  - `limit` (Optional): Number of items per page, default: 10
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Notifications retrieved successfully",
    "data": {
      "notifications": [
        {
          "id": "uuid",
          "title": "Notification Title",
          "message": "Notification Message",
          "is_read": false,
          "created_at": "2024-03-20T10:00:00Z",
          "sent_at": "2024-03-20T10:00:00Z",
          "task_id": "task_uuid"
        }
      ],
      "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10
      }
    }
  }
  ```

### Mark Notification as Read
- **Endpoint:** `PATCH /notifications/:id/read`
- **Description:** Marks a notification as read
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "message": "Notification marked as read",
    "data": []
  }
  ```

## Admin Module (`/admin`) Under Development
