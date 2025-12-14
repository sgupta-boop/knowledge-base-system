# Knowledge Base System

A full-stack documentation and knowledge management system built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication (JWT)
- Article creation and management
- Rich text editor
- Full-text search
- Categories and tags
- Version history
- Role-based access control (Admin, Editor, Reader)
- Admin panel

## Tech Stack

**Frontend:**
- React + Vite
- React Router
- Axios
- React Quill (Rich Text Editor)
- Tailwind CSS
- React Hot Toast

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/knowledge_base
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. Create database and run SQL schema:
- Open pgAdmin
- Create database `knowledge_base`
- Run the SQL from `database.sql`

5. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

## Default User Roles

- **Reader**: Can view articles
- **Editor**: Can create and edit articles
- **Admin**: Full access including category management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Articles
- `GET /api/articles` - Get all articles (with pagination)
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article (Editor/Admin)
- `PUT /api/articles/:id` - Update article (Editor/Admin)
- `DELETE /api/articles/:id` - Delete article (Admin)
- `GET /api/articles/:id/versions` - Get version history

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

### Search
- `GET /api/search?q=keyword` - Search articles

## Project Structure
```
knowledge-base/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── articles.js
│   │   ├── categories.js
│   │   └── search.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ArticleList.jsx
│   │   │   ├── ArticleView.jsx
│   │   │   ├── ArticleEditor.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Screenshots

[Add screenshots here after deployment]

