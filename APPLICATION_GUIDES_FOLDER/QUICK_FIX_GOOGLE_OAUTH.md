# ⚡ Quick Fix: Google OAuth Desktop Error

## ❌ Problem
"Internal Server Error" when clicking "Continue with Google" on desktop (but works on mobile).

## ✅ Quick Fix (30 seconds)

### Step 1: Update .env
Open `.env` file and change:
```env
NODE_ENV=development
```

### Step 2: Restart Server
```bash
# Stop server (Ctrl+C)
npm run server
```

### Step 3: Test
1. Open http://localhost:3000
2. Click "Continue with Google"
3. ✅ Should work now!

---

## 🔍 What Was Wrong?

**Root Cause:** `NODE_ENV=production` sets secure cookies that require HTTPS, but you're using `http://localhost`.

**Why Mobile Worked:** Some mobile browsers are more lenient with cookie policies.

**The Fix:** Changed to `NODE_ENV=development` for local testing.

---

## 📝 What I Changed

### 1. `.env` File
```env
# Before:
NODE_ENV=production

# After:
NODE_ENV=development
```

### 2. `server/server.js`
- ✅ Updated CORS to allow both localhost:3000 and localhost:5000
- ✅ Fixed session cookie configuration
- ✅ Added better error handling

### 3. `server/routes/auth.js`
- ✅ Added detailed logging
- ✅ Added error handling for Google callback

### 4. `server/config/passport.js`
- ✅ Added console logging for debugging
- ✅ Added proxy support

---

## 🧪 Verify It Works

After restarting server, you should see in console:
```
✅ Google OAuth successful for user: [email]
🔄 Redirecting to: http://localhost:3000/auth/callback?token=[token]
```

---

## 🚀 For Production Deployment

When deploying to production:

1. Change `.env`:
   ```env
   NODE_ENV=production
   CLIENT_URL=https://your-domain.com
   GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback
   ```

2. Update Google Cloud Console:
   - Add production URL to authorized redirect URIs
   - Add production domain to authorized JavaScript origins

---

## 📚 More Details

For complete troubleshooting guide, see: `GOOGLE_OAUTH_FIX.md`

---

**That's it!** Restart your server and test Google OAuth on desktop! 🎉
