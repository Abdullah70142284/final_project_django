# Django Backend Implementation Plan

## Project Overview
Convert React Quiz App from localStorage to Django REST API backend with PostgreSQL/SQLite database.

## Current Data Structure Analysis

### 1. Users
```javascript
{
  username: string,
  email: string,
  password: string
}
```

### 2. Quizzes
```javascript
{
  id: string (timestamp),
  title: string,
  questions: [
    {
      question: string,
      options: [string],
      answer: number (index)
    }
  ]
}
```

### 3. Attempts (Results)
```javascript
{
  username: string,
  quizId: string,
  quizTitle: string,
  date: string,
  score: number,
  total: number,
  answers: [number] (selected answer indices)
}
```

---

## Backend Implementation Plan

### Phase 1: Django Project Setup

**1.1 Initialize Django Project**
- Navigate to `backend/` folder
- Install Django and dependencies using pipenv:
  - `django`
  - `djangorestframework`
  - `django-cors-headers`
- Create Django project: `quiz_backend`
- Create Django app: `api`

**1.2 Configure Settings**
- Add `rest_framework`, `corsheaders`, `api` to INSTALLED_APPS
- Configure CORS to allow React frontend (localhost:5173)
- Set up SQLite database (default)
- Configure REST framework settings

---

### Phase 2: Database Models

**2.1 User Model**
```python
class User(models.Model):
    username = CharField (unique, max_length=100)
    email = EmailField (unique)
    password = CharField (max_length=255)
    created_at = DateTimeField (auto_now_add)
```

**2.2 Quiz Model**
```python
class Quiz(models.Model):
    title = CharField (max_length=200)
    created_by = ForeignKey (User)
    created_at = DateTimeField (auto_now_add)
```

**2.3 Question Model**
```python
class Question(models.Model):
    quiz = ForeignKey (Quiz, related_name='questions')
    question_text = TextField
    options = JSONField (list of strings)
    correct_answer = IntegerField (index of correct option)
    order = IntegerField (question order in quiz)
```

**2.4 Attempt Model**
```python
class Attempt(models.Model):
    user = ForeignKey (User)
    quiz = ForeignKey (Quiz)
    score = IntegerField
    total_questions = IntegerField
    selected_answers = JSONField (list of selected indices)
    attempted_at = DateTimeField (auto_now_add)
```

---

### Phase 3: Serializers

**3.1 UserSerializer**
- Fields: id, username, email, password (write_only)
- Validation: unique username/email

**3.2 QuestionSerializer**
- Fields: id, question_text, options, correct_answer, order
- Nested in QuizSerializer

**3.3 QuizSerializer**
- Fields: id, title, questions (nested), created_by, created_at
- Write: accepts nested questions
- Read: returns full quiz with questions

**3.4 AttemptSerializer**
- Fields: id, user, quiz, quiz_title, score, total_questions, selected_answers, attempted_at
- Read-only quiz_title from quiz relationship

---

### Phase 4: API Endpoints

**4.1 User Endpoints**
- `POST /api/users/signup/` - Create new user
- `POST /api/users/login/` - Verify credentials, return user data

**4.2 Quiz Endpoints**
- `GET /api/quizzes/` - List all quizzes
- `POST /api/quizzes/` - Create new quiz with questions
- `GET /api/quizzes/{id}/` - Get quiz by ID with questions

**4.3 Attempt Endpoints**
- `POST /api/attempts/` - Submit quiz attempt
- `GET /api/attempts/` - Get all attempts (for dashboard)
- Query params: username, quiz_title, start_date, end_date, min_score

---

### Phase 5: Frontend Integration

**5.1 API Service Layer**
- Create `src/services/api.js` with axios instance
- Base URL: `http://localhost:8000/api/`

**5.2 Update Components**

**SignUp.jsx**
- Replace localStorage with `POST /api/users/signup/`
- Keep loggedIn user in localStorage after signup

**LandingPage.jsx**
- Replace localStorage with `POST /api/users/login/`
- Store returned user in localStorage as "loggedIn"

**repo.js → api.js**
- `addQuiz()` → `POST /api/quizzes/`
- `getQuizzes()` → `GET /api/quizzes/`
- `getQuizById(id)` → `GET /api/quizzes/{id}/`
- `setItemInDb()` → `POST /api/attempts/`

**Dashboard.jsx**
- Replace localStorage with `GET /api/attempts/` with query params
- Implement server-side filtering

**5.3 Remove localStorage (except loggedIn)**
- Remove: `users`, `CustomQuizzes`, `attempts`
- Keep: `loggedIn` (current user session)

---

## File Structure

```
backend/
├── manage.py
├── Pipfile
├── Pipfile.lock
├── quiz_backend/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── api/
    ├── __init__.py
    ├── models.py
    ├── serializers.py
    ├── views.py
    ├── urls.py
    └── migrations/
```

---

## Implementation Steps

1. ✅ Setup Django project with pipenv
2. ✅ Create models and run migrations
3. ✅ Create serializers
4. ✅ Create API views and URLs
5. ✅ Test endpoints with Postman/Thunder Client
6. ✅ Create frontend API service
7. ✅ Update React components one by one
8. ✅ Remove localStorage references
9. ✅ Test complete flow
10. ✅ Handle edge cases and errors

---

## Key Points

- **No JWT/Token Auth**: Simple username/password check
- **LoggedIn User**: Only stored in localStorage for session
- **Password**: Stored as plain text (not hashed - as per requirement)
- **CORS**: Enabled for React frontend
- **Database**: SQLite (can switch to PostgreSQL later)
- **Serialization**: Minimal, to-the-point
- **Naming**: Professional conventions (snake_case for Python, camelCase for JS)

---

## Testing Checklist

- [ ] User signup creates record in DB
- [ ] User login validates against DB
- [ ] Quiz creation saves with nested questions
- [ ] Quiz list retrieves all quizzes
- [ ] Quiz detail retrieves specific quiz
- [ ] Attempt submission saves to DB
- [ ] Dashboard filters work correctly
- [ ] Logout clears localStorage
- [ ] No localStorage except loggedIn user

---

## Notes

- Keep it simple and professional
- Follow Django and DRF best practices
- Minimal but complete implementation
- Clear separation of concerns
- Easy to extend later
