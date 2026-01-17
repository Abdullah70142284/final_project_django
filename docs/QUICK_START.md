# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start Backend
```bash
cd backend
pipenv run python manage.py runserver
```
✅ Backend running at `http://localhost:8000`

### Step 2: Start Frontend
```bash
# In a new terminal, from project root
npm run dev
```
✅ Frontend running at `http://localhost:5173`

### Step 3: Use the App
1. Open `http://localhost:5173`
2. Click "Sign Up" and create an account
3. Login with your credentials
4. Create a quiz or attempt existing ones!

---

## 📋 First Time Setup

If this is your first time running the project:

### Backend Setup
```bash
cd backend
pipenv install
pipenv run python manage.py migrate
```

### Frontend Setup
```bash
npm install
```

---

## 🎯 What You Can Do

### Create Account
- Signup with username, email, password
- Data saved in database (not localStorage)

### Create Quiz
- Click "+ Create Quiz"
- Add questions with multiple options
- Mark correct answers

### Attempt Quiz
- Select any quiz from the list
- Answer questions
- Submit and see results

### View Dashboard
- See all quiz attempts
- Filter by user, quiz, date, score
- Real-time data from database

---

## 🔍 Verify Everything Works

### Check Backend
Visit: `http://localhost:8000/api/quizzes/`
Should see: `[]` (empty list initially)

### Check Frontend
Visit: `http://localhost:5173`
Should see: Login page

### Check localStorage
After login, open DevTools → Application → Local Storage
Should see: Only `loggedIn` key with user data

---

## 🛠️ Admin Panel (Optional)

Create superuser:
```bash
cd backend
pipenv run python manage.py createsuperuser
```

Access admin:
`http://localhost:8000/admin/`

---

## ❓ Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Run: `pipenv install` to ensure dependencies

### Frontend won't start
- Check if port 5173 is available
- Run: `npm install` to ensure dependencies

### CORS errors
- Ensure backend is running on port 8000
- Check `backend/quiz_backend/settings.py` CORS settings

### Can't login
- Ensure you've signed up first
- Check backend terminal for errors
- Verify backend is running

---

## 📚 More Information

- [README.md](README.md) - Full documentation
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Detailed testing
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Architecture
- [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - What changed

---

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can signup new user
- [ ] Can login with credentials
- [ ] Can create quiz
- [ ] Can attempt quiz
- [ ] Can view results dashboard
- [ ] Only `loggedIn` in localStorage
