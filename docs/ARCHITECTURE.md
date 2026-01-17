# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│                  (localhost:5173)                           │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Components  │  │   Services   │  │ localStorage │    │
│  │              │  │              │  │              │    │
│  │ - SignUp     │  │ - api.js     │  │ - loggedIn   │    │
│  │ - Login      │  │ - quizService│  │   (user)     │    │
│  │ - HomePage   │  │              │  │              │    │
│  │ - Quiz       │  └──────┬───────┘  └──────────────┘    │
│  │ - Dashboard  │         │                               │
│  └──────────────┘         │                               │
└────────────────────────────┼───────────────────────────────┘
                             │
                             │ HTTP/JSON
                             │ (Axios)
                             │
┌────────────────────────────┼───────────────────────────────┐
│                            ▼                                │
│                  Django Backend                             │
│                  (localhost:8000)                           │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   API Views  │  │ Serializers  │  │    Models    │    │
│  │              │  │              │  │              │    │
│  │ - signup     │  │ - User       │  │ - User       │    │
│  │ - login      │  │ - Quiz       │  │ - Quiz       │    │
│  │ - quiz_list  │  │ - Question   │  │ - Question   │    │
│  │ - quiz_detail│  │ - Attempt    │  │ - Attempt    │    │
│  │ - attempt    │  │              │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            │                               │
│                            ▼                               │
│                  ┌──────────────────┐                      │
│                  │   SQLite DB      │                      │
│                  │  (db.sqlite3)    │                      │
│                  └──────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Signup
```
User Input → SignUp.jsx → api.signup() → POST /api/users/signup/
→ UserSerializer → User.save() → Database
→ Response → localStorage.setItem('loggedIn') → Redirect to Home
```

### 2. User Login
```
User Input → LandingPage.jsx → api.login() → POST /api/users/login/
→ User.filter(username/email, password) → Database Query
→ Response → localStorage.setItem('loggedIn') → Redirect to Home
```

### 3. Create Quiz
```
User Input → CreateQuizForm → HomePage.handleQuizCreate()
→ quizService.saveQuizzes() → POST /api/quizzes/
→ QuizSerializer (nested questions) → Quiz.save() + Question.save()
→ Database → Response → Update State → Navigate to List
```

### 4. Attempt Quiz
```
Quiz.jsx → quizService.getQuizByIdFromAPI() → GET /api/quizzes/{id}/
→ QuizSerializer → Database Query → Response → Transform Data
→ User Answers → quizService.setItemInDb() → POST /api/attempts/
→ AttemptSerializer → Attempt.save() → Database → Show Results
```

### 5. View Dashboard
```
Dashboard.jsx → api.getAttempts(filters) → GET /api/attempts/?params
→ Filter by username/quiz/date/score → Database Query
→ AttemptSerializer → Response → Display Table
```

## API Endpoints

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| /api/users/signup/ | POST | {username, email, password} | User object |
| /api/users/login/ | POST | {identifier, password} | User object |
| /api/quizzes/ | GET | - | Quiz[] |
| /api/quizzes/ | POST | {title, created_by, questions[]} | Quiz object |
| /api/quizzes/{id}/ | GET | - | Quiz object |
| /api/attempts/ | GET | ?filters | Attempt[] |
| /api/attempts/ | POST | {user, quiz, score, answers} | Attempt object |

## Database Schema

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │◄─────┐
│ username    │      │
│ email       │      │
│ password    │      │
│ created_at  │      │
└─────────────┘      │
                     │
                     │ created_by
                     │
┌─────────────┐      │
│    Quiz     │      │
├─────────────┤      │
│ id          │◄─────┤
│ title       │      │
│ created_by  │──────┘
│ created_at  │
└──────┬──────┘
       │
       │ quiz (FK)
       │
       ▼
┌─────────────────┐
│   Question      │
├─────────────────┤
│ id              │
│ quiz            │
│ question_text   │
│ options (JSON)  │
│ correct_answer  │
│ order           │
└─────────────────┘

┌─────────────────┐
│    Attempt      │
├─────────────────┤
│ id              │
│ user            │──────┐
│ quiz            │──────┤
│ score           │      │
│ total_questions │      │
│ selected_answers│      │
│ attempted_at    │      │
└─────────────────┘      │
                         │
                    (Foreign Keys)
```

## Component Hierarchy

```
App.jsx
├── LandingPage.jsx (Login)
├── SignUp.jsx
└── HomePage.jsx
    ├── CreateQuizForm.jsx
    ├── ListQuizzes.jsx
    ├── Quiz.jsx
    │   ├── Question.jsx
    │   └── Result.jsx
    └── Dashboard.jsx
```

## Service Layer

```
src/services/
├── api.js
│   ├── signup()
│   ├── login()
│   ├── getQuizzes()
│   ├── getQuizById()
│   ├── createQuiz()
│   ├── submitAttempt()
│   └── getAttempts()
│
└── quizService.js
    ├── setItemInDb()
    ├── saveQuizzes()
    ├── getAllQuizzes()
    └── getQuizByIdFromAPI()
```

## localStorage Usage

**Before Migration:**
```javascript
localStorage = {
  users: [...],           // ❌ Removed
  CustomQuizzes: [...],   // ❌ Removed
  attempts: [...],        // ❌ Removed
  loggedIn: {...}         // ✅ Kept
}
```

**After Migration:**
```javascript
localStorage = {
  loggedIn: {             // ✅ Only this remains
    id: 1,
    username: "user",
    email: "user@example.com"
  }
}
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Django 6.0** - Web framework
- **Django REST Framework** - API framework
- **django-cors-headers** - CORS handling
- **SQLite** - Database

### Development
- **Pipenv** - Python dependency management
- **npm** - JavaScript dependency management

## Security Notes

- Passwords stored as plain text (as requested)
- No JWT/token authentication
- Simple credential verification
- CORS enabled for localhost:5173
- Session managed via localStorage

## Future Enhancements (Optional)

- Password hashing (bcrypt)
- JWT authentication
- Pagination
- Quiz editing/deletion
- User profiles
- Quiz categories
- Time limits
- Question shuffling
- PostgreSQL for production
