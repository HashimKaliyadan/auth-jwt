# JWT Authentication App

A full-stack authentication application built with **Django REST Framework** (backend) and **React** (frontend), using **JWT (JSON Web Tokens)** for secure user authentication.

## Features

- **User Registration** — Create a new account with username, email, and password
- **User Login (JWT)** — Authenticate and receive access/refresh tokens
- **Protected Profile Page** — View user details (requires authentication)
- **Token-based Route Protection** — Frontend guards private pages from unauthenticated users
- **Axios Interceptor** — Automatically attaches JWT token to every API request

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Django 6.0, Django REST Framework   |
| Auth      | SimpleJWT                           |
| Frontend  | React 19, React Router, Axios       |
| Database  | SQLite (default)                    |
| CORS      | django-cors-headers                 |

## Project Structure

```
codo-auth-jwt/
├── backend/
│   ├── account/               # Auth app (serializers, views, urls)
│   │   ├── serializers.py     # User & Register serializers
│   │   ├── views.py           # Register & Profile views
│   │   └── urls.py            # API route definitions
│   ├── core/                  # Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Login.js       # Login form
│   │   │   ├── Register.js    # Registration form
│   │   │   └── ProtectedRoute.js  # Route guard component
│   │   ├── pages/
│   │   │   └── Profile.js     # Protected profile page
│   │   └── App.js             # React Router configuration
│   └── package.json
├── API_DOCUMENTATION.md
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional, for admin access)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

The backend API will be running at `http://localhost:8000/`.

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will be running at `http://localhost:3000/`.

## Usage

1. Open `http://localhost:3000/register` to create a new account.
2. After registration, you'll be redirected to the Login page.
3. Log in with your credentials — JWT tokens are saved to localStorage.
4. You'll be redirected to the Profile page showing your user details.
5. Click **Logout** to clear tokens and return to the Login page.
6. Trying to access `/profile` without logging in will redirect you to `/login`.

## API Endpoints

| Method | Endpoint             | Description                         | Auth Required |
|--------|----------------------|-------------------------------------|---------------|
| POST   | `/api/register/`     | Register a new user                 | No            |
| POST   | `/api/login/`        | Login and get JWT tokens            | No            |
| POST   | `/api/token/refresh/` | Refresh an expired access token    | No            |
| GET    | `/api/profile/`      | Get authenticated user's profile    | Yes (Bearer)  |

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).
