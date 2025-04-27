# Mini-CRM for Freelancers - Backend

This is the backend API for a Mini-CRM platform designed for freelancers to manage clients, projects, interactions, and reminders.

## Tech Stack

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod

## Database Schema (ERD)

```
+----------------+       +----------------+       +----------------+
|      User      |       |     Client     |       |    Project     |
+----------------+       +----------------+       +----------------+
| id             |       | id             |       | id             |
| firstName      |       | name           |       | title          |
| lastName       |       | email          |       | description    |
| email          |       | phone          |       | status         |
| password       |       | company        |       | budget         |
| createdAt      |<----->| userId         |<----->| clientId       |
| updatedAt      |       | notes          |       | userId         |
+----------------+       | createdAt      |       | startDate      |
                         | updatedAt      |       | endDate        |
                         +----------------+       | createdAt      |
                                                 | updatedAt      |
                                                 +----------------+
                                                        ^
                                                        |
                                                        |
+----------------+                              +----------------+
|   Reminder     |                              |  Interaction   |
+----------------+                              +----------------+
| id             |                              | id             |
| title          |                              | type           |
| description    |                              | date           |
| dueDate        |                              | notes          |
| completed      |                              | clientId       |
| clientId       |<------------------------------>| projectId     |
| projectId      |<------------------------------>| userId        |
| userId         |<------------------------------>| createdAt     |
| createdAt      |                              | updatedAt     |
| updatedAt      |                              +----------------+
+----------------+
```

### Entity Relationships

- **User to Client**: One-to-Many (A user can have multiple clients)
- **User to Project**: One-to-Many (A user can have multiple projects)
- **Client to Project**: One-to-Many (A client can have multiple projects)
- **User to Interaction**: One-to-Many (A user can log multiple interactions)
- **Client to Interaction**: One-to-Many (A client can have multiple interactions)
- **Project to Interaction**: One-to-Many (A project can have multiple interactions)
- **User to Reminder**: One-to-Many (A user can set multiple reminders)
- **Client to Reminder**: One-to-Many (A client can have multiple reminders)
- **Project to Reminder**: One-to-Many (A project can have multiple reminders)

### Key Constraints

- All entities have a primary key `id` (UUID)
- Foreign keys ensure referential integrity:
  - `userId` in Client, Project, Interaction, and Reminder tables
  - `clientId` in Project, Interaction, and Reminder tables
  - `projectId` in Interaction and Reminder tables
- Soft deletion is implemented for data recovery purposes

## Features

- 🔐 **Authentication**: Secure signup and login system
- 👥 **Client Management**: Create, read, update, and delete clients
- 📁 **Project Management**: Track projects with status, budget, and deadlines
- 📝 **Interaction Logs**: Record client and project interactions (calls, emails, meetings)
- ⏰ **Reminders**: Set reminders for clients and projects
- 📊 **Dashboard**: Overview of clients, projects, and upcoming reminders

## Module Descriptions

### Authentication Module
The authentication module handles user registration, login, and profile management. It uses JWT (JSON Web Tokens) for secure authentication and bcrypt for password hashing. This module ensures that only authenticated users can access protected resources.

### Client Module
The client management module allows users to create and manage their client database. Users can add detailed client information including contact details and notes. All client data is associated with the authenticated user, ensuring data privacy.

### Project Module
The project module enables tracking of client projects with details such as budget, deadline, and status. Projects are linked to specific clients and the authenticated user. The status of a project can be tracked from NOT_STARTED through to COMPLETED.

### Interaction Module
The interaction module records all communications with clients, including calls, emails, meetings, and other types of interactions. These interactions can be associated with specific clients and/or projects, creating a comprehensive communication history.

### Reminder Module
The reminder module helps users stay organized by setting reminders for follow-ups with clients or project deadlines. Reminders include a title, description, due date, and completion status. They can be linked to specific clients and/or projects.

### Dashboard Module
The dashboard provides an overview of the user's CRM data, including client counts, project statuses, upcoming reminders, and recent interactions. This gives users a quick snapshot of their business activities.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
  **Response**: Returns the created user object (excluding password) and a JWT token.

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
  **Response**: Returns the user object (excluding password) and a JWT token.

- `GET /api/auth/profile` - Get user profile
  **Response**: Returns the authenticated user's profile information.

### Clients

- `GET /api/clients` - Get all clients for the authenticated user
  **Response**: Returns an array of client objects associated with the authenticated user.

- `GET /api/clients/:id` - Get client by ID
  **Response**: Returns a specific client object if it belongs to the authenticated user.

- `POST /api/clients` - Create a new client
  ```json
  {
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "company": "Acme Inc.",
    "notes": "Potential long-term client"
  }
  ```
  **Response**: Returns the created client object.

- `PUT /api/clients/:id` - Update a client
  ```json
  {
    "name": "Acme Corporation Updated",
    "email": "new-contact@acme.com",
    "phone": "+1987654321",
    "company": "Acme Inc. Updated",
    "notes": "Now a long-term client"
  }
  ```
  **Response**: Returns the updated client object.

- `DELETE /api/clients/:id` - Delete a client
  **Response**: Returns a success message.

### Projects

- `GET /api/projects` - Get all projects for the authenticated user
  **Response**: Returns an array of project objects associated with the authenticated user.

- `GET /api/projects/:id` - Get project by ID
  **Response**: Returns a specific project object if it belongs to the authenticated user.

- `POST /api/projects` - Create a new project
  ```json
  {
    "title": "Website Redesign",
    "description": "Complete redesign of company website",
    "clientId": "client-uuid-here",
    "budget": 5000,
    "deadline": "2025-06-30T00:00:00Z",
    "status": "IN_PROGRESS"
  }
  ```
  **Response**: Returns the created project object.

- `PUT /api/projects/:id` - Update a project
  ```json
  {
    "title": "Website Redesign and SEO",
    "description": "Expanded scope to include SEO optimization",
    "status": "IN_PROGRESS",
    "budget": 7500,
    "deadline": "2025-07-15T00:00:00Z"
  }
  ```
  **Response**: Returns the updated project object.

- `DELETE /api/projects/:id` - Delete a project
  **Response**: Returns a success message.

### Interactions

- `GET /api/interactions` - Get all interactions for the authenticated user
  **Response**: Returns an array of interaction objects associated with the authenticated user.

- `GET /api/interactions/:id` - Get interaction by ID
  **Response**: Returns a specific interaction object if it belongs to the authenticated user.

- `POST /api/interactions` - Create a new interaction
  ```json
  {
    "type": "MEETING",
    "notes": "Discussed project scope and timeline",
    "date": "2025-05-02T14:00:00Z",
    "clientId": "client-uuid-here",
    "projectId": "project-uuid-here"
  }
  ```
  **Response**: Returns the created interaction object.

- `PUT /api/interactions/:id` - Update an interaction
  ```json
  {
    "type": "CALL",
    "notes": "Updated notes with action items",
    "date": "2025-05-02T15:30:00Z"
  }
  ```
  **Response**: Returns the updated interaction object.

- `DELETE /api/interactions/:id` - Delete an interaction
  **Response**: Returns a success message.

### Reminders

- `GET /api/reminders` - Get all reminders for the authenticated user
  **Response**: Returns an array of reminder objects associated with the authenticated user.

- `GET /api/reminders/:id` - Get reminder by ID
  **Response**: Returns a specific reminder object if it belongs to the authenticated user.

- `POST /api/reminders` - Create a new reminder
  ```json
  {
    "title": "Follow-up Call",
    "description": "Call client to discuss project progress",
    "dueDate": "2025-05-10T10:00:00Z",
    "completed": false,
    "clientId": "client-uuid-here",
    "projectId": "project-uuid-here"
  }
  ```
  **Response**: Returns the created reminder object.

- `PUT /api/reminders/:id` - Update a reminder
  ```json
  {
    "title": "Urgent Follow-up Call",
    "description": "Call client ASAP to discuss critical issues",
    "dueDate": "2025-05-09T09:00:00Z",
    "completed": true
  }
  ```
  **Response**: Returns the updated reminder object.

- `DELETE /api/reminders/:id` - Delete a reminder
  **Response**: Returns a success message.

### Dashboard

- `GET /api/dashboard` - Get dashboard data
  **Response**: Returns summary data including:
    - Total clients count
    - Total projects count
    - Projects by status
    - Upcoming reminders
    - Recent interactions

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/mdalaminfaraji/crm-be.git
   cd crm-be
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mini_crm?schema=public"
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. Set up the database

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## Database Schema

The database schema includes the following models:

- **User**: Stores user authentication and profile information
- **Client**: Stores client information
- **Project**: Tracks projects with their status, budget, and deadlines
- **Interaction**: Logs interactions with clients and projects
- **Reminder**: Sets reminders for clients and projects

## Development

- **Build**: `npm run build`
- **Start**: `npm start`
- **Development**: `npm run dev`
- **Prisma Studio**: `npm run prisma:studio`

## Security

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Input validation with Zod
- Data isolation (users can only access their own data)
