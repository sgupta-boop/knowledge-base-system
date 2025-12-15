<img width="1917" height="902" alt="Screenshot 2025-12-15 192513" src="https://github.com/user-attachments/assets/1e0fadb2-7807-483f-bbb8-72b13009bdb4" /># Knowledge Base System

A full-stack documentation and knowledge management system built with the MERN stack (PostgreSQL variant).

## Features

- **Authentication**: Secure JWT-based auth with role-based access control (Reader, Editor, Admin).
- **Articles**: Create, read, update, and delete articles with a rich text editor.
- **Search**: Full-text search functionality for articles.
- **Categorization**: Organize content with categories and tags.
- **History**: Track article version history.
- **Admin Panel**: Manage users and content from a centralized dashboard.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Router, React Quill.
- **Backend**: Node.js, Express, PostgreSQL.
- **Database**: PostgreSQL with `pg` pool.

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running.

### 1. Database Setup

Create a PostgreSQL database named `knowledge_base` and run the schema script (if provided in `database.sql`):

```sql
CREATE DATABASE knowledge_base;
```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env`:
    ```env
    PORT=5000
    DATABASE_URL=postgresql://user:password@localhost:5432/knowledge_base
    JWT_SECRET=your_secure_secret
    NODE_ENV=development
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.
## DEMO


https://github.com/user-attachments/assets/d1b45a92-364e-4b37-a1dd-f9cce88ab5f4


## API Documentation

### Auth

- `POST /api/auth/register` - Create a new account.
- `POST /api/auth/login` - Authenticate user and get token.
- `GET /api/auth/me` - Get current user profile.

### Articles

- `GET /api/articles` - List articles (supports pagination).
- `GET /api/articles/:id` - Get article details.
- `POST /api/articles` - Create article (Editor+).
- `PUT /api/articles/:id` - Update article (Editor+).
- `DELETE /api/articles/:id` - Delete article (Admin).

### Search

- `GET /api/search?q=query` - Search articles by title or content.

## Deployment

The frontend is configured for deployment on static hosting.
The backend requires a Node.js environment (like Render, Railway, or Heroku).

> **Note**: If deploying frontend and backend separately, ensure `VITE_API_URL` is set in the frontend environment to point to your live backend.
