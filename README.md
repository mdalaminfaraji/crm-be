# Mini-CRM for Freelancers - Backend

This is the backend API for a Mini-CRM platform designed for freelancers to manage clients, projects, interactions, and reminders.

## Tech Stack

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod

## Features

- 🔐 **Authentication**: Secure signup and login system
- 👥 **Client Management**: Create, read, update, and delete clients
- 📁 **Project Management**: Track projects with status, budget, and deadlines
- 📝 **Interaction Logs**: Record client and project interactions (calls, emails, meetings)
- ⏰ **Reminders**: Set reminders for clients and projects
- 📊 **Dashboard**: Overview of clients, projects, and upcoming reminders

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
- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- `GET /api/auth/profile` - Get user profile

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create a new client
  ```json
  {
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "address": "123 Business St, City",
    "type": "BUSINESS",
    "notes": "Potential long-term client"
  }
  ```
- `PUT /api/clients/:id` - Update a client
  ```json
  {
    "name": "Acme Corporation Updated",
    "email": "new-contact@acme.com",
    "phone": "+1987654321",
    "address": "456 New St, City",
    "type": "BUSINESS",
    "notes": "Now a long-term client"
  }
  ```
- `DELETE /api/clients/:id` - Delete a client

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create a new project
  ```json
  {
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "clientId": "client-uuid-here",
    "startDate": "2025-05-01T00:00:00Z",
    "endDate": "2025-06-30T00:00:00Z",
    "budget": 5000,
    "status": "IN_PROGRESS",
    "priority": "HIGH"
  }
  ```
- `PUT /api/projects/:id` - Update a project
  ```json
  {
    "name": "Website Redesign and SEO",
    "description": "Expanded scope to include SEO optimization",
    "status": "IN_PROGRESS",
    "budget": 7500,
    "endDate": "2025-07-15T00:00:00Z",
    "priority": "CRITICAL"
  }
  ```
- `DELETE /api/projects/:id` - Delete a project

### Interactions
- `GET /api/interactions` - Get all interactions
- `GET /api/interactions/:id` - Get interaction by ID
- `POST /api/interactions` - Create a new interaction
  ```json
  {
    "type": "MEETING",
    "title": "Project Kickoff",
    "notes": "Discussed project scope and timeline",
    "date": "2025-05-02T14:00:00Z",
    "clientId": "client-uuid-here",
    "projectId": "project-uuid-here"
  }
  ```
- `PUT /api/interactions/:id` - Update an interaction
  ```json
  {
    "type": "MEETING",
    "title": "Project Kickoff and Planning",
    "notes": "Updated notes with action items",
    "date": "2025-05-02T15:30:00Z"
  }
  ```
- `DELETE /api/interactions/:id` - Delete an interaction

### Reminders
- `GET /api/reminders` - Get all reminders
- `GET /api/reminders/:id` - Get reminder by ID
- `POST /api/reminders` - Create a new reminder
  ```json
  {
    "title": "Follow-up Call",
    "description": "Call client to discuss project progress",
    "dueDate": "2025-05-10T10:00:00Z",
    "priority": "MEDIUM",
    "clientId": "client-uuid-here",
    "projectId": "project-uuid-here"
  }
  ```
- `PUT /api/reminders/:id` - Update a reminder
  ```json
  {
    "title": "Urgent Follow-up Call",
    "description": "Call client ASAP to discuss critical issues",
    "dueDate": "2025-05-09T09:00:00Z",
    "priority": "HIGH",
    "completed": false
  }
  ```
- `DELETE /api/reminders/:id` - Delete a reminder

### Dashboard
- `GET /api/dashboard` - Get dashboard data
  - Returns summary data including:
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
