# Fix Supabase Database Connection 🔧

## ❌ Current Error
```
FATAL: Tenant or user not found
```

This means your database password is incorrect or the connection string format is wrong.

---

## ✅ Solution: Get Correct Password from Supabase

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/hmkshtavvfnihydfmclh/settings/database

### Step 2: Get Connection String
1. Click on **"Connection String"** tab
2. Select **"URI"** type
3. Select **"Session pooler"** method
4. Click **"View parameters"** or copy the full connection string

### Step 3: Copy the Connection String
You'll see something like:
```
postgresql://postgres.hmkshtavvfnihydfmclh:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

### Step 4: Get Your Actual Password
**Option A**: If you remember your password
- Replace `[YOUR-PASSWORD]` with your actual database password

**Option B**: If you forgot your password
1. Go to Database Settings: https://supabase.com/dashboard/project/hmkshtavvfnihydfmclh/settings/database
2. Scroll down to **"Reset your database password"**
3. Click **"Reset Password"** button
4. Copy the NEW password they give you
5. **SAVE IT SOMEWHERE SAFE!**

### Step 5: Update `.env` File
Open `backend/.env` and update this line:
```env
DATABASE_URL = postgresql://postgres.hmkshtavvfnihydfmclh:YOUR_ACTUAL_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

Replace `kushalraj135` with your **actual database password** from Supabase.

---

## 🎯 Quick Fix (If Password is Correct)

Sometimes the issue is the connection pooler. Try using **Direct Connection** instead:

### Get Direct Connection String from Supabase:
1. Go to: https://supabase.com/dashboard/project/hmkshtavvfnihydfmclh/settings/database
2. Select **"Connection String"** → **"URI"**
3. Change Method to **"Direct Connection"** (NOT Session pooler)
4. Copy the connection string
5. Update `backend/.env` file

The Direct Connection URL looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.hmkshtavvfnihydfmclh.supabase.co:5432/postgres
```

Notice the difference:
- **Pooler**: `aws-1-ap-south-1.pooler.supabase.com`
- **Direct**: `db.hmkshtavvfnihydfmclh.supabase.co`

---

## ⚠️ Important Notes

1. **Don't commit your password to Git!**
   - The `.env` file should be in `.gitignore`
   - Never share your password publicly

2. **Backend still works without database!**
   - Voice processing doesn't need database
   - You'll see: "Running in fallback mode without database..."
   - This is FINE for voice input feature

3. **Database is only needed for:**
   - Saving field data permanently
   - User authentication
   - Storing farm information

---

## 🧪 Test Database Connection

After updating `.env`, test the connection:

```powershell
cd backend
.\venv\Scripts\activate
python test_supabase_connection.py
```

If successful, you'll see:
```
✓ Database connection successful!
✓ Tables created successfully
```

---

## 🚀 Restart Backend

After fixing `.env`:
```powershell
cd backend
.\start_backend_venv.bat
```

You should see:
```
Creating database tables...
✓ Database connected successfully!
✓ Tables created
```

---

## 🆘 Still Not Working?

### Check these:
1. ✅ Password has no spaces before/after
2. ✅ Using correct connection string format
3. ✅ Supabase project is not paused/deleted
4. ✅ You're on the correct Supabase project

### Last Resort: Contact Me
Show me the error message and I'll help debug!

---

## 📝 Summary

**Quick Steps:**
1. Go to Supabase → Database Settings
2. Copy connection string (or reset password if needed)
3. Update `backend/.env` with correct password
4. Restart backend: `.\start_backend_venv.bat`
5. Test: `python test_supabase_connection.py`

**Remember:** Voice input works even without database! The backend is running fine in fallback mode. 🎤✅
