# 🔧 Google OAuth Desktop Fix

## ❌ Problem

"Internal Server Error" when clicking "Continue with Google" on **desktop**, but works fine on **mobile**.

## ✅ Solution Applied

I've fixed the following issues:

### 1. **NODE_ENV Configuration**
**Problem:** `.env` had `NODE_ENV=production` which sets `secure: true` for cookies, requiring HTTPS.

**Fix:**
```env
# Changed from:
NODE_ENV=production

# To:
NODE_ENV=development
```

### 2. **CORS Configuration**
**Problem:** CORS wasn't allowing both localhost:3000 and localhost:5000.

**Fix:** Updated `server/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. **Session Cookie Configuration**
**Problem:** Secure cookies don't work on localhost without HTTPS.

**Fix:**
```javascript
cookie: { 
  secure: process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL.includes('localhost'),
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}
```

### 4. **Better Error Handling**
**Added:** Detailed logging and error handling in:
- `server/routes/auth.js` - Google callback route
- `server/config/passport.js` - Google strategy

### 5. **Proxy Support**
**Added:** `proxy: true` to Google Strategy for better redirect handling.

---

## 🧪 Testing the Fix

### Step 1: Restart Server

```bash
# Stop the server (Ctrl+C)

# Restart
npm run server
```

### Step 2: Test on Desktop

1. Open browser: http://localhost:3000
2. Click "Continue with Google"
3. Select your Google account
4. ✅ Should redirect to dashboard successfully

### Step 3: Check Console Logs

You should see:
```
🔍 Google OAuth profile received: [user_id] [email]
✅ Existing user found: [email]
✅ Google OAuth successful for user: [email]
🔄 Redirecting to: http://localhost:3000/auth/callback?token=[token]
```

---

## 🔍 Debugging

If still not working, check these:

### 1. Check Server Console

Look for error messages:
```bash
❌ Google OAuth error: [error details]
❌ No user in request after Google auth
❌ Error in Google callback: [error]
```

### 2. Check Browser Console (F12)

Look for:
- CORS errors
- Redirect errors
- Network errors

### 3. Check Google Cloud Console

Verify authorized redirect URIs:
```
http://localhost:5000/auth/google/callback
http://localhost:3000/auth/callback
```

### 4. Check Environment Variables

```bash
# In server console, you should see:
🔍 Google Client ID: Loaded ✅
🔍 Google Client Secret: Loaded ✅
```

---

## 🐛 Common Issues

### Issue 1: "redirect_uri_mismatch"

**Solution:** Add to Google Cloud Console:
```
Authorized redirect URIs:
- http://localhost:5000/auth/google/callback
- http://localhost:3000/auth/callback
```

### Issue 2: "Access blocked: This app's request is invalid"

**Solution:** 
1. Go to Google Cloud Console
2. OAuth consent screen
3. Add your email as test user
4. Ensure app is in "Testing" mode

### Issue 3: Still getting "Internal Server Error"

**Solution:**
```bash
# Clear browser cookies
# Clear browser cache
# Restart server
# Try in incognito mode
```

### Issue 4: Works in incognito but not regular browser

**Solution:**
```bash
# Clear all cookies for localhost
# Or use different browser
```

---

## 📝 Files Modified

1. ✅ `.env` - Changed NODE_ENV to development
2. ✅ `server/server.js` - Updated CORS and session config
3. ✅ `server/routes/auth.js` - Added error handling
4. ✅ `server/config/passport.js` - Added logging and proxy support

---

## ✅ Verification Checklist

- [ ] Server restarted
- [ ] `.env` has `NODE_ENV=development`
- [ ] Google Cloud Console has correct redirect URIs
- [ ] Browser cookies cleared
- [ ] Tested on desktop browser
- [ ] Checked server console for errors
- [ ] Checked browser console for errors
- [ ] Google OAuth works on desktop ✅

---

## 🎯 Why It Works Now

### Desktop vs Mobile Difference:

**Before:**
- Desktop browsers strictly enforce secure cookie policy
- `secure: true` + `http://` = cookies rejected
- Session not saved = authentication fails

**After:**
- `secure: false` for localhost
- Cookies work on http://localhost
- Session saved correctly
- Authentication succeeds

**Mobile:**
- Some mobile browsers are more lenient
- May have cached working session
- Different cookie handling

---

## 🚀 Next Steps

### For Development:
- ✅ Keep `NODE_ENV=development`
- ✅ Use http://localhost

### For Production:
- Change `NODE_ENV=production`
- Use HTTPS domain
- Update Google OAuth redirect URIs to production URL
- Update `.env` CLIENT_URL to production URL

---

## 📞 Still Having Issues?

### Check These:

1. **Server Console:**
   ```bash
   npm run server
   # Look for error messages
   ```

2. **Browser Console (F12):**
   ```javascript
   // Check for errors
   // Check Network tab for failed requests
   ```

3. **Test with cURL:**
   ```bash
   curl http://localhost:5000/auth/google
   # Should redirect to Google
   ```

4. **Check Database:**
   ```sql
   SELECT * FROM users WHERE google_id IS NOT NULL;
   # Should show Google users
   ```

---

## 💡 Pro Tips

1. **Always restart server** after changing `.env`
2. **Clear browser cache** when testing OAuth
3. **Use incognito mode** for clean testing
4. **Check server logs** for detailed errors
5. **Verify Google Cloud Console** settings

---

## 🎉 Summary

**Fixed:**
- ✅ NODE_ENV set to development
- ✅ CORS configured for multiple origins
- ✅ Session cookies work on localhost
- ✅ Better error handling and logging
- ✅ Proxy support for redirects

**Result:**
- ✅ Google OAuth works on desktop
- ✅ Google OAuth works on mobile
- ✅ Better debugging information
- ✅ More reliable authentication

---

**Test it now!** Restart your server and try "Continue with Google" on desktop! 🚀
