<p align="center">
  <h1 align="center">🔐 Auth-JWT</h1>
  <p align="center">
    A full-stack JWT authentication system built with Django REST Framework & React
    <br />
    <a href="API_DOCUMENTATION.md"><strong>Explore the API Docs »</strong></a>
    <br />
    <br />
    <a href="#demo">View Demo</a>
    ·
    <a href="https://github.com/HashimKaliyadan/auth-jwt/issues">Report Bug</a>
    ·
    <a href="https://github.com/HashimKaliyadan/auth-jwt/issues">Request Feature</a>
  </p>
</p>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## About The Project

Auth-JWT is a production-ready authentication boilerplate that demonstrates a secure, token-based authentication flow using **JSON Web Tokens (JWT)**. It features a Django REST Framework backend for API services and a React frontend with protected routes — a clean starting point for any project that requires user authentication.

---

## ✨ Features

- 🔑 **User Registration** — Create accounts with username, email, and password (with validation)
- 🔐 **JWT Login** — Authenticate and receive access + refresh tokens
- 🛡️ **Protected Routes** — Frontend guards private pages from unauthenticated users
- 👤 **User Profile** — View authenticated user details on a protected page
- 🔄 **Token Refresh** — Automatically renew expired access tokens using refresh tokens
- 📡 **Axios Interceptor** — Automatically attaches JWT token to every outgoing API request
- 🌐 **CORS Enabled** — Frontend and backend communicate seamlessly across origins

---

## 🛠️ Tech Stack

| Layer       | Technology                              | Version |
|-------------|----------------------------------------|---------|
| **Backend** | Django + Django REST Framework          | 5.x     |
| **Auth**    | SimpleJWT (Token-based authentication) | —       |
| **Frontend**| React + React Router + Axios           | 18.x    |
| **Database**| SQLite (development)                   | —       |
| **CORS**    | django-cors-headers                    | —       |

---

## 📁 Project Structure

```
auth-jwt/
│
├── backend/                        # Django Backend
│   ├── account/                    # Authentication app
│   │   ├── serializers.py          # User & Register serializers
│   │   ├── views.py                # Register & Profile API views
│   │   ├── urls.py                 # API route definitions
│   │   ├── models.py               # Database models
│   │   ├── admin.py                # Admin configuration
│   │   └── apps.py                 # App configuration
│   ├── core/                       # Project configuration
│   │   ├── settings.py             # Django settings (JWT, CORS, etc.)
│   │   ├── urls.py                 # Root URL configuration
│   │   ├── wsgi.py                 # WSGI entry point
│   │   └── asgi.py                 # ASGI entry point
│   ├── db.sqlite3                  # SQLite database
│   ├── manage.py                   # Django management script
│   └── requirements.txt            # Python dependencies
│
├── frontend/                       # React Frontend
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Login.js            # Login form component
│   │   │   ├── Register.js         # Registration form component
│   │   │   └── ProtectedRoute.js   # Auth route guard component
│   │   ├── pages/
│   │   │   └── Profile.js          # Protected profile page
│   │   ├── App.js                  # App entry + React Router config
│   │   ├── App.css                 # Global styles
│   │   └── index.js                # React DOM entry point
│   └── package.json                # Node.js dependencies
│
├── API_DOCUMENTATION.md            # Detailed API reference
├── README.md                       # ← You are here
└── .gitignore                      # Git ignore rules
```

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

| Requirement | Minimum Version |
|-------------|-----------------|
| Python      | 3.10+           |
| Node.js     | 18+             |
| npm          | 9+             |
| Git         | 2.x+            |

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
# Windows (CMD)
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run database migrations
python manage.py migrate

# 6. Create admin superuser (optional)
python manage.py createsuperuser

# 7. Start the backend server
python manage.py runserver
```

> ✅ Backend will be running at **http://localhost:8000/**

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the React development server
npm start
```

> ✅ Frontend will be running at **http://localhost:3000/**

---

## 💻 Usage

| Step | Action | URL |
|------|--------|-----|
| 1 | Register a new account | `http://localhost:3000/register` |
| 2 | Login with your credentials | `http://localhost:3000/login` |
| 3 | View your profile (protected) | `http://localhost:3000/profile` |
| 4 | Logout to clear tokens | Click **Logout** button |

- JWT tokens are **automatically saved** to `localStorage` after login
- Accessing `/profile` without a valid token **redirects to** `/login`
- The Axios interceptor **automatically attaches** the token to all API requests

---

## 📡 API Endpoints

| Method | Endpoint              | Auth Required | Description              |
|--------|-----------------------|---------------|--------------------------|
| POST   | `/api/register/`      | ❌ No          | Create a new user        |
| POST   | `/api/login/`         | ❌ No          | Get JWT access & refresh tokens |
| POST   | `/api/token/refresh/` | ❌ No          | Refresh expired access token |
| GET    | `/api/profile/`       | ✅ Yes (Bearer)| Get authenticated user profile |

> 📖 For full request/response examples, see **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**

---

## 🔄 Authentication Flow

```
         ┌──────────┐          ┌──────────┐          ┌──────────┐
         │  REGISTER │          │   LOGIN  │          │  PROFILE │
         │   Page    │          │   Page   │          │   Page   │
         └────┬─────┘          └────┬─────┘          └────┬─────┘
              │                     │                     │
              │ POST /register/     │ POST /login/        │ GET /profile/
              │                     │                     │ + Bearer Token
              ▼                     ▼                     ▼
         ┌──────────────────────────────────────────────────────┐
         │                  DJANGO BACKEND                      │
         │                                                      │
         │   /api/register/  →  Create User                     │
         │   /api/login/     →  Return { access, refresh }      │
         │   /api/profile/   →  Return { id, username, email }  │
         │   /api/token/refresh/ → Return new { access }        │
         └──────────────────────────────────────────────────────┘
```

---

## 🔒 Environment Variables

For production deployment, configure the following:

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | Auto-generated (insecure in dev) |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Allowed host domains | `[]` |
| `CORS_ALLOW_ALL_ORIGINS` | Allow all CORS origins | `True` (disable in production) |
| `DATABASE_URL` | Database connection string | SQLite (`db.sqlite3`) |

> ⚠️ **Important:** Before deploying to production, change the `SECRET_KEY`, set `DEBUG=False`, and configure `ALLOWED_HOSTS` and CORS properly.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Hashim Kaliyadan** — [GitHub](https://github.com/HashimKaliyadan)

Project Link: [https://github.com/HashimKaliyadan/auth-jwt](https://github.com/HashimKaliyadan/auth-jwt)
