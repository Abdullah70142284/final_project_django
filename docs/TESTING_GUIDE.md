# Testing Guide

## Prerequisites

1. **Backend Running**: Django server at `http://localhost:8000`
2. **Frontend Running**: React app at `http://localhost:5173`

## Start Servers

### Backend
```bash
cd backend
pipenv run python manage.py runserver
```

### Frontend
```bash
npm run dev
```

## Testing Flow

### 1. User Signup
- Navigate to `http://localhost:5173`
- Click "Sign Up"
- Enter username, email, password
- Should redirect to home page
- User saved in database (not localStorage)

### 2. User Login
- Logout if logged in
- Enter username/email and password
- Should redirect to home page
- Only logged-in user stored in localStorage

### 3. Create Quiz
- Click "+ Create Quiz"
- Enter quiz title
- Set number of questions and options
- Click "Create Questions"
- Fill in questions, options, and mark correct answers
- Click "Finish and Create Quiz"
- Quiz saved to database via API

### 4. Attempt Quiz
- Click "Attempt Quiz"
- Select a quiz from the list
- Answer questions
- Click "Submit"
- Result displayed
- Attempt saved to database

### 5. View Results Dashboard
- Click "Result" button
- See all attempts from database
- Test filters:
  - Filter by username
  - Filter by quiz title
  - Filter by date range
  - Filter by minimum score

### 6. Logout
- Click "Logout"
- Redirects to login page
- Only "loggedIn" removed from localStorage

## Verify Database

### Check Django Admin
1. Create superuser: `pipenv run python manage.py createsuperuser`
2. Visit: `http://localhost:8000/admin/`
3. Verify:
   - Users table has registered users
   - Quizzes table has created quizzes
   - Questions table has quiz questions
   - Attempts table has quiz attempts

## localStorage Check

Open browser DevTools → Application → Local Storage

**Should contain ONLY:**
- `loggedIn` - Current user object

**Should NOT contain:**
- `users`
- `CustomQuizzes`
- `attempts`

## API Testing (Optional)

Use Postman or Thunder Client:

### Signup
```
POST http://localhost:8000/api/users/signup/
Body: {"username": "test", "email": "test@test.com", "password": "pass123"}
```

### Login
```
POST http://localhost:8000/api/users/login/
Body: {"identifier": "test", "password": "pass123"}
```

### Get Quizzes
```
GET http://localhost:8000/api/quizzes/
```

### Create Quiz
```
POST http://localhost:8000/api/quizzes/
Body: {
  "title": "Test Quiz",
  "created_by": 1,
  "questions": [
    {
      "question_text": "What is 2+2?",
      "options": ["3", "4", "5"],
      "correct_answer": 1,
      "order": 0
    }
  ]
}
```

## Common Issues

### CORS Error
- Ensure `django-cors-headers` is installed
- Check `CORS_ALLOWED_ORIGINS` in settings.py

### Connection Refused
- Verify Django server is running on port 8000
- Check API_BASE_URL in `src/services/api.js`

### 404 Not Found
- Verify API endpoints in `backend/api/urls.py`
- Check URL patterns in `backend/quiz_backend/urls.py`

## Success Criteria

✅ Users signup and login via database
✅ Quizzes created and stored in database
✅ Quiz attempts saved to database
✅ Dashboard filters work with API
✅ Only loggedIn user in localStorage
✅ No localStorage for users, quizzes, attempts
