# 🚀 Dreamy App - Quick Start Guide

Get the Dreamy app running in 15 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] You have a Supabase account (free: https://supabase.com)
- [ ] You have an OpenAI API key (https://platform.openai.com)
- [ ] You have a Google Cloud account (free: https://console.cloud.google.com)

---

## Step-by-Step Setup

### 1️⃣ Install Dependencies (2 minutes)

```bash
# Install all required packages
npm install @supabase/supabase-js @react-native-async-storage/async-storage expo-secure-store expo-auth-session expo-crypto expo-av react-native-url-polyfill expo-linear-gradient @react-native-community/datetimepicker
```

---

### 2️⃣ Set Up Supabase (5 minutes)

**A. Create Project:**
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `dreamy-dev`, Password: (generate & save), Region: closest to you
4. Wait 2-3 minutes

**B. Get Credentials:**
1. In Supabase Dashboard: Settings → API
2. Copy **Project URL** and **anon public key**

**C. Create `.env` file:**
```bash
# In project root, create .env file:
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**D. Run Database Setup:**
1. In Supabase Dashboard: SQL Editor → New Query
2. Copy entire contents of `supabase/setup.sql`
3. Paste and click "Run"
4. Verify: Go to Table Editor, see `profiles` and `dreams` tables

---

### 3️⃣ Configure Google OAuth (5 minutes)

**A. In Google Cloud Console** (https://console.cloud.google.com):
1. Create new project: "Dreamy"
2. APIs & Services → OAuth consent screen
   - External → App name: "Dreamy" → Save
3. Credentials → Create OAuth Client ID
   - Type: "Web application"
   - Name: "Dreamy Web"
   - Redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     (Replace YOUR_PROJECT_REF with yours from step 2)
   - Click "Create" → **Save Client ID and Secret**

**B. In Supabase Dashboard:**
1. Authentication → Providers → Google (toggle ON)
2. Paste Client ID and Secret from Google
3. Click "Save"

---

### 4️⃣ Deploy Edge Functions (3 minutes)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref YOUR_PROJECT_REF

# Set OpenAI API key (get from https://platform.openai.com/api-keys)
supabase secrets set OPENAI_API_KEY=sk-your-key-here

# Deploy functions
supabase functions deploy analyze-dream
supabase functions deploy transcribe-audio
```

✅ You should see "Deployed successfully" for both.

---

### 5️⃣ Run the App! (1 minute)

```bash
# Start development server
npm start

# Then press:
# - 'w' for web browser
# - 'i' for iOS simulator (macOS only)
# - 'a' for Android emulator
```

**Or scan QR code with Expo Go app on your phone!**

---

## ✅ Test It Works

1. **Sign In:**
   - Click "Sign in with Google"
   - Choose your account
   - Should redirect to home screen

2. **Create a Dream:**
   - Click "+" button (top right)
   - Type: "I was flying over mountains"
   - Click "Analyze Dream"
   - Wait ~5 seconds
   - See AI-generated title, mood, interpretation!

3. **View Dreams:**
   - See your dream in the list
   - Click to view full details
   - Check mood badge and keywords

---

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Invalid environment variables"
- Check `.env` file exists in project root
- No spaces around `=` in `.env`
- Restart: Ctrl+C → `npm start`

### "Google Sign-In fails"
- Check redirect URI matches EXACTLY (no trailing slash)
- Verify Google credentials saved in Supabase

### "AI analysis fails"
```bash
# Check Edge Function logs
supabase functions logs analyze-dream

# Verify OpenAI key is set
supabase secrets list

# Redeploy if needed
supabase functions deploy analyze-dream
```

---

## 📚 Next Steps

Once it's working:

- ✅ Read `README.md` for full documentation
- ✅ Check `SECURITY.md` for security features
- ✅ Review `DEPLOYMENT.md` before going to production
- ✅ Customize colors in `constants/Colors.ts`
- ✅ Add your own app icons in `assets/images/`

---

## 💬 Need Help?

- **Setup Issues:** See `SETUP_INSTRUCTIONS.md` for detailed guide
- **Supabase Help:** https://supabase.com/docs
- **Expo Help:** https://docs.expo.dev
- **OpenAI Help:** https://platform.openai.com/docs

---

## 🎉 You're Done!

You now have a fully functional AI-powered dream journal app running locally. Time to record some dreams! 🌙✨

**thx** for building with Dreamy!

