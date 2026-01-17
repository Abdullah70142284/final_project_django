# 🔧 Troubleshooting Guide

## Network Error: "Please check your connection"

### Quick Fix Checklist

1. **✅ Backend Running?**
   ```bash
   # Check if Django is running on port 8000
   # Visit: http://localhost:8000/api/quizzes/
   # Should see: [] (empty array)
   ```

2. **✅ Frontend Running?**
   ```bash
   # Check if Vite is running on port 5173
   npm run dev
   # Should see: Local: http://localhost:5173/
   ```

3. **✅ Correct API URL?**
   - Open `src/services/api.js`
   - Verify: `const API_BASE_URL = 'http://localhost:8000/api';`
   - Should be `localhost:8000` NOT `localhost:5000`

4. **✅ CORS Configured?**
   - Backend should allow `http://localhost:5173`
   - Check `backend/quiz_backend/settings.py`

---

## Common Issues & Solutions

### Issue 1: "Network Error" on Signup/Login

**Symptoms:**
- Alert shows "Network error. Please check your connection."
- Browser console shows connection refused or CORS error

**Solutions:**

**A. Backend Not Running**
```bash
cd backend
pipenv run python manage.py runserver
```
Should see: `Starting development server at http://127.0.0.1:8000/`

**B. Wrong Port**
- Backend MUST be on port 8000
- Frontend MUST be on port 5173
- Check if another app is using these ports

**C. Firewall Blocking**
- Allow Python and Node through Windows Firewall
- Temporarily disable antivirus to test

---

### Issue 2: 404 Not Found

**Symptoms:**
- Backend logs show: `Not Found: /api/users`
- Should be: `/api/users/signup/` or `/api/users/login/`

**Solution:**
Check the API endpoint in your code:
```javascript
// WRONG
await api.post('/api/users', data);

// CORRECT
await api.post('/api/users/signup/', data);
```

---

### Issue 3: CORS Error

**Symptoms:**
- Browser console: "CORS policy: No 'Access-Control-Allow-Origin' header"
- Backend receives OPTIONS request but frontend gets error

**Solution:**

1. Verify CORS settings in `backend/quiz_backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

2. Ensure `corsheaders` middleware is in MIDDLEWARE:
```python
MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    # ...
]
```

3. Restart Django server:
```bash
# Stop with Ctrl+C, then:
pipenv run python manage.py runserver
```

---

### Issue 4: Port Already in Use

**Symptoms:**
- Error: "Address already in use"
- Can't start backend or frontend

**Solution:**

**For Backend (Port 8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
pipenv run python manage.py runserver 8001
# Then update API_BASE_URL in src/services/api.js
```

**For Frontend (Port 5173):**
```bash
# Kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or Vite will auto-select next available port
```

---

### Issue 5: Database Errors

**Symptoms:**
- Backend error: "no such table"
- 500 Internal Server Error

**Solution:**
```bash
cd backend
pipenv run python manage.py migrate
```

---

### Issue 6: Module Not Found

**Symptoms:**
- Backend: "No module named 'rest_framework'"
- Backend: "No module named 'corsheaders'"

**Solution:**
```bash
cd backend
pipenv install django djangorestframework django-cors-headers
```

---

## Testing Backend Directly

### Test with Browser

1. **Test Quizzes Endpoint:**
   - Visit: `http://localhost:8000/api/quizzes/`
   - Should see: `[]`

2. **Test Admin:**
   - Visit: `http://localhost:8000/admin/`
   - Should see: Django admin login

### Test with curl (Command Line)

**Signup:**
```bash
curl -X POST http://localhost:8000/api/users/signup/ ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"test\",\"email\":\"test@test.com\",\"password\":\"pass123\"}"
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/users/login/ ^
  -H "Content-Type: application/json" ^
  -d "{\"identifier\":\"test\",\"password\":\"pass123\"}"
```

**Get Quizzes:**
```bash
curl http://localhost:8000/api/quizzes/
```

---

## Browser Console Debugging

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try signup/login
4. Look for failed requests
5. Check:
   - Request URL (should be `http://localhost:8000/api/...`)
   - Status Code (should be 200, 201, or 400)
   - Response (error message)

### Check Console Tab

Look for errors like:
- `ERR_CONNECTION_REFUSED` → Backend not running
- `CORS error` → CORS not configured
- `404 Not Found` → Wrong endpoint URL
- `500 Internal Server Error` → Backend error

---

## Verify Setup

### Backend Health Check

```bash
cd backend
pipenv run python manage.py check
```
Should show: `System check identified no issues`

### Frontend Health Check

```bash
npm run dev
```
Should show: `Local: http://localhost:5173/`

---

## Step-by-Step Debug Process

1. **Stop Everything**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)

2. **Start Backend First**
   ```bash
   cd backend
   pipenv run python manage.py runserver
   ```
   Wait for: `Starting development server at http://127.0.0.1:8000/`

3. **Test Backend**
   - Visit: `http://localhost:8000/api/quizzes/`
   - Should see: `[]`

4. **Start Frontend**
   ```bash
   # In new terminal, from project root
   npm run dev
   ```
   Wait for: `Local: http://localhost:5173/`

5. **Test Frontend**
   - Visit: `http://localhost:5173`
   - Should see: Login page

6. **Test Connection**
   - Try to signup
   - Check browser console for errors
   - Check backend terminal for requests

---

## Still Having Issues?

### Check These Files

1. **src/services/api.js** - Line 3
   ```javascript
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

2. **backend/quiz_backend/settings.py** - Line ~40
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
       "http://127.0.0.1:5173",
   ]
   ```

3. **backend/api/urls.py**
   ```python
   path('users/signup/', views.signup, name='signup'),
   path('users/login/', views.login, name='login'),
   ```

### Get Detailed Logs

**Backend:**
- Check terminal where Django is running
- Look for error messages

**Frontend:**
- Open browser DevTools (F12)
- Check Console tab
- Check Network tab

---

## Quick Status Check

Run these commands to verify everything:

```bash
# Check if backend is running
curl http://localhost:8000/api/quizzes/

# Check if frontend is accessible
curl http://localhost:5173

# Check Python packages
cd backend
pipenv run pip list | findstr django

# Check Node packages
npm list axios
```

---

## Emergency Reset

If nothing works, try this:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Reinstall backend
cd backend
pipenv install --dev

# 3. Reset database
del db.sqlite3
pipenv run python manage.py migrate

# 4. Reinstall frontend
cd ..
npm install

# 5. Start backend
cd backend
pipenv run python manage.py runserver

# 6. Start frontend (new terminal)
npm run dev
```

---

## Current Server Status

**Backend**: ✅ Running on `http://localhost:8000`
**Frontend**: ✅ Running on `http://localhost:5173`

Both servers are now active and ready for testing!

---

## Need More Help?

1. Check backend terminal for error messages
2. Check browser console (F12) for frontend errors
3. Review TESTING_GUIDE.md for proper testing flow
4. Verify all files match the implementation plan
