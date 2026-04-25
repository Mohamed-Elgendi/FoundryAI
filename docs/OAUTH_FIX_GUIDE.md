# Google OAuth Fix Guide - redirect_uri_mismatch

## 🚨 Problem
**Error:** `redirect_uri_mismatch`

**Cause:** The redirect URL sent by the app doesn't match any of the authorized redirect URIs in Google Cloud Console.

---

## ✅ SOLUTION - Step by Step

### Step 1: Update Google Cloud Console (REQUIRED)

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Find your OAuth 2.0 Client ID**
   - Look for "Web client" or the client ID you're using
   - Click the edit icon (pencil)

3. **Add Authorized Redirect URIs:**
   
   Add these EXACT URLs (copy-paste carefully):
   ```
   https://foundryai-seven.vercel.app/auth/callback
   https://foundryai-seven.vercel.app/auth/callback?
   https://foundryai-seven.vercel.app/login
   https://foundryai-seven.vercel.app/signup
   ```

4. **Save the changes**

---

### Step 2: Update Supabase Auth Settings (REQUIRED)

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Navigate to:**
   - Your project > Authentication > URL Configuration

3. **Update Site URL:**
   ```
   https://foundryai-seven.vercel.app
   ```

4. **Add Redirect URLs:**
   ```
   https://foundryai-seven.vercel.app/**
   https://foundryai-seven.vercel.app/auth/callback
   https://foundryai-seven.vercel.app/login
   https://foundryai-seven.vercel.app/signup
   ```

5. **Save changes**

---

### Step 3: Update Environment Variables (CHECK)

Verify `.env.local` has correct URLs:

```bash
NEXT_PUBLIC_APP_URL=https://foundryai-seven.vercel.app
```

---

### Step 4: Test OAuth Flow

1. **Clear browser cache/cookies**
2. **Try Google Sign In again**
3. **Check browser console for errors**

---

## 🔧 QUICK FIX SCRIPT

Run this to verify configuration:

```bash
# Check current environment
echo "Current APP_URL:"
grep NEXT_PUBLIC_APP_URL .env.local

echo ""
echo "Supabase URL:"
grep NEXT_PUBLIC_SUPABASE_URL .env.local
```

---

## 📋 VERIFICATION CHECKLIST

- [ ] Google Cloud Console has redirect URIs configured
- [ ] Supabase Auth has site URL configured
- [ ] Supabase Auth has redirect URLs configured
- [ ] Environment variables use production URL
- [ ] No trailing slashes in URLs (can cause mismatch)
- [ ] HTTPS (not HTTP) for production

---

## 🎯 EXPECTED CALLBACK URL FORMAT

When user clicks "Sign in with Google":

```
https://foundryai-seven.vercel.app/auth/callback
```

This MUST exactly match what's in Google Cloud Console.

---

## 🔍 DEBUGGING

If still getting error:

1. **Check browser console** when clicking Google sign-in
2. **Look for the exact redirect URL** being sent
3. **Copy that URL exactly** to Google Cloud Console
4. **Wait 5 minutes** for Google changes to propagate

---

## 🚨 COMMON MISTAKES

❌ **Wrong:**
```
https://foundryai-seven.vercel.app/auth/callback/
https://foundryai-seven.vercel.app//auth/callback
http://foundryai-seven.vercel.app/auth/callback
```

✅ **Correct:**
```
https://foundryai-seven.vercel.app/auth/callback
```

---

## 📞 SUPPORT

If issues persist:
1. Check Supabase Auth logs
2. Check Google Cloud Console error details
3. Verify the exact redirect URL in browser network tab

---

**Status:** Fix documented ✅  
**Next:** Configure Google Cloud Console + Supabase Auth
