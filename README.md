# Quiz App - React + Django

A full-stack quiz application with React frontend and Django REST API backend.

## Features

- User signup and login (stored in database)
- Create custom quizzes with multiple questions
- Attempt quizzes and view results
- Results dashboard with filtering
- Session management (logged-in user in localStorage)

## Tech Stack

### Frontend
- React 19
- React Router
- Axios
- Vite

### Backend
- Django 6.0
- Django REST Framework
- SQLite Database
- CORS Headers

## Project Structure

```
quiz-app/
├── backend/              # Django backend
│   ├── api/             # API app
│   ├── quiz_backend/    # Django project
│   ├── manage.py
│   └── Pipfile
├── src/                 # React frontend
│   ├── components/
│   ├── services/        # API service layer
│   └── main.jsx
├── docs/                # Documentation
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
pipenv install
```

3. Run migrations:
```bash
pipenv run python manage.py migrate
```

4. Start Django server:
```bash
pipenv run python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Endpoints

### Users
- `POST /api/users/signup/` - Register new user
- `POST /api/users/login/` - Login user

### Quizzes
- `GET /api/quizzes/` - Get all quizzes
- `POST /api/quizzes/` - Create new quiz
- `GET /api/quizzes/{id}/` - Get quiz by ID

### Attempts
- `GET /api/attempts/` - Get all attempts (with filters)
- `POST /api/attempts/` - Submit quiz attempt

## Usage

1. **Signup**: Create a new account
2. **Login**: Login with username/email and password
3. **Create Quiz**: Add custom quizzes with questions
4. **Attempt Quiz**: Take any available quiz
5. **View Results**: Check dashboard with filters

## Data Storage

- **Database**: Users, quizzes, questions, and attempts stored in SQLite
- **localStorage**: Only logged-in user session (removed on logout)

## Documentation

📚 **All documentation is in the [docs/](docs/) folder:**

- **[docs/START_HERE.md](docs/START_HERE.md)** - Main entry point, start here!
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Get started in 3 steps
- **[docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Testing instructions
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues & solutions
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** - Complete overview
- **[docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)** - Architecture plan
- **[docs/MIGRATION_SUMMARY.md](docs/MIGRATION_SUMMARY.md)** - localStorage → Database migration
- **[docs/DEPLOYMENT_NOTES.md](docs/DEPLOYMENT_NOTES.md)** - Production deployment guide
- **[docs/FILE_INDEX.md](docs/FILE_INDEX.md)** - Complete file navigation
- **[docs/COMPLETION_CHECKLIST.md](docs/COMPLETION_CHECKLIST.md)** - Implementation checklist
- **[docs/CLEANUP_SUMMARY.md](docs/CLEANUP_SUMMARY.md)** - Code cleanup details

## Development

See [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) for detailed testing instructions.

See [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for architecture details.

## Admin Panel

Create superuser to access Django admin:
```bash
cd backend
pipenv run python manage.py createsuperuser
```

Access at: `http://localhost:8000/admin/`
