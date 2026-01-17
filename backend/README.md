# Quiz App Backend

Django REST API backend for the Quiz Application.

## Setup

1. Install dependencies:
```bash
pipenv install
```

2. Run migrations:
```bash
pipenv run python manage.py migrate
```

3. Create superuser (optional, for admin panel):
```bash
pipenv run python manage.py createsuperuser
```

4. Start development server:
```bash
pipenv run python manage.py runserver
```

Server runs at: `http://localhost:8000`

## API Endpoints

### Users
- `POST /api/users/signup/` - Create new user
- `POST /api/users/login/` - Login user

### Quizzes
- `GET /api/quizzes/` - List all quizzes
- `POST /api/quizzes/` - Create new quiz
- `GET /api/quizzes/{id}/` - Get quiz by ID

### Attempts
- `GET /api/attempts/` - List all attempts (with filters)
- `POST /api/attempts/` - Submit quiz attempt

## Admin Panel

Access at: `http://localhost:8000/admin/`

## Database

SQLite database (`db.sqlite3`) is used by default.
