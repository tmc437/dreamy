# Dreamy App - Complete Setup Instructions

This guide will walk you through setting up the Dreamy app from scratch. Follow each step carefully.

## Table of Contents

1. [Initial Setup](#1-initial-setup)
2. [Install Dependencies](#2-install-dependencies)
3. [Configure Supabase](#3-configure-supabase)
4. [Set Up Google OAuth](#4-set-up-google-oauth)
5. [Deploy Edge Functions](#5-deploy-edge-functions)
6. [Run the App](#6-run-the-app)
7. [Troubleshooting](#troubleshooting)

---

## 1. Initial Setup

### 1.1 System Requirements

- **Node.js:** 18.0 or higher
- **npm:** 9.0 or higher
- **Git:** Latest version
- **Code editor:** VS Code recommended

### 1.2 Check Prerequisites

Open your terminal and verify:

```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
git --version   # Should show a version
```

If any are missing, install them:

- **Node.js:** <https://nodejs.org>
- **Git:** <https://git-scm.com>

---

## 2. Install Dependencies

### 2.1 Clone the Repository (if applicable)

```bash
git clone https://github.com/yourusername/dreamy.git
cd dreamy
```

### 2.2 Install Base Dependencies

```bash
npm install
```

### 2.3 Install Additional Required Packages

Run this command to install all required dependencies:

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage expo-secure-store expo-auth-session expo-crypto expo-av react-native-url-polyfill expo-linear-gradient @react-native-community/datetimepicker
```

### 2.4 Verify Installation

```bash
npm list @supabase/supabase-js
# Should show version number
```

---

## 3. Configure Supabase

### 3.1 Create Supabase Account

1. Go to <https://supabase.com>
2. Click "Start your project"
3. Sign up with GitHub or email

### 3.2 Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name:** dreamy-prod (or any name)
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine for testing
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

### 3.3 Get Project Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (long string)

### 3.4 Configure Environment Variables

1. In your project root, create a `.env` file:

   ```bash
   touch .env
   ```

2. Open `.env` and add:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

   Replace with your actual values from step 3.3.

3. **IMPORTANT:** Never commit `.env` to Git. It's already in `.gitignore`.

### 3.5 Set Up Database Schema

1. In Supabase Dashboard, click **SQL Editor** in the left sidebar
2. Click "New query"
3. Open the file `supabase/setup.sql` from your project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run" (bottom right)
7. You should see: "Success. No rows returned"

8. Verify tables were created:
   - Click **Table Editor** in sidebar
   - You should see `profiles` and `dreams` tables

---

## 4. Set Up Google OAuth

### 4.1 Create Google Cloud Project

1. Go to <https://console.cloud.google.com>
2. Click "Select a project" → "New Project"
3. Name it "Dreamy" → Click "Create"
4. Wait for project to be created

### 4.2 Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services → OAuth consent screen**
2. Select "External" → Click "Create"
3. Fill in:
   - **App name:** Dreamy
   - **User support email:** <your-email@example.com>
   - **Developer contact:** <your-email@example.com>
4. Click "Save and Continue"
5. **Scopes:** Click "Save and Continue" (use defaults)
6. **Test users:** Add your email → Click "Save and Continue"
7. Click "Back to Dashboard"

### 4.3 Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Name: "Dreamy Web"
5. **Authorized redirect URIs:** Add this (replace YOUR_PROJECT_REF):

   ```
   https://YOUR_PROJECT_REF.supabase.conpm 
   ```

6. Click "Create"
7. **SAVE** the Client ID and Client Secret shown

### 4.4 Configure Supabase Authentication

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Find "Google" and toggle it ON
3. Paste your Google OAuth credentials:
   - **Client ID:** from step 4.3
   - **Client Secret:** from step 4.3
4. Click "Save"

---

## 5. Deploy Edge Functions

Edge Functions process AI requests securely on the server.

### 5.1 Get OpenAI API Key

1. Go to <https://platform.openai.com>
2. Sign up or log in
3. Click your profile (top right) → "View API keys"
4. Click "Create new secret key"
5. Name it "Dreamy" → Click "Create secret key"
6. **COPY THE KEY** (you won't see it again)
7. Add $5-10 credits in Billing settings

### 5.2 Install Supabase CLI

**On macOS/Linux:**

```bash
npm install -g supabase
```

**On Windows:**

```powershell
npm install -g supabase
```

Verify installation:

```bash
supabase --version
```

### 5.3 Login to Supabase CLI

```bash
supabase login
```

This will open a browser. Authorize the CLI.

### 5.4 Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with the part of your URL:
`https://YOUR_PROJECT_REF.supabase.co`

When prompted for database password, use the one from step 3.2.

### 5.5 Set OpenAI API Key Secret

```bash
supabase secrets set OPENAI_API_KEY=sk-your-actual-openai-key-here
```

Replace with your actual OpenAI API key from step 5.1.

### 5.6 Deploy Edge Functions

Deploy the dream analysis function:

```bash
supabase functions deploy analyze-dream
```

Deploy the audio transcription function:

```bash
supabase functions deploy transcribe-audio
```

You should see "Deployed successfully" for both.

Verify:

```bash
supabase functions list
```

Both functions should show as "ACTIVE".

---

## 6. Run the App

### 6.1 Start the Development Server

```bash
npm start
```

You'll see the Expo DevTools menu.

### 6.2 Run on Different Platforms

**Web:**

- Press `w` in the terminal
- Or run: `npm run web`
- Browser will open at <http://localhost:8081>

**iOS Simulator (macOS only):**

- Press `i` in the terminal
- Or run: `npm run ios`
- Requires Xcode installed

**Android Emulator:**

- Press `a` in the terminal
- Or run: `npm run android`
- Requires Android Studio with emulator running

**Physical Device:**

- Install "Expo Go" app from App Store or Play Store
- Scan the QR code shown in terminal

### 6.3 Test the App

1. **Sign In:**
   - Click "Sign in with Google"
   - Choose your Google account
   - Authorize the app

2. **Create a Dream:**
   - Click the "+" button (top right)
   - Type or record a dream
   - Click "Analyze Dream"
   - Wait ~5 seconds for AI analysis

3. **View Dreams:**
   - See your dream in the list
   - Click to view details
   - Check AI interpretation, mood, and keywords

---

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution:**

```bash
npm install @supabase/supabase-js
```

### Issue: "Invalid environment variables"

**Solution:**

- Check `.env` file exists in project root
- Verify no typos in variable names
- Restart development server: Ctrl+C, then `npm start`

### Issue: "Google Sign-In not working"

**Solutions:**

1. Check redirect URI in Google Cloud Console matches exactly:

   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```

2. Verify Google credentials in Supabase Authentication → Providers
3. Clear browser cache (for web)
4. Check `scheme: "dreamy"` is in `app.json`

### Issue: "Edge Function fails"

**Solutions:**

1. Check function logs:

   ```bash
   supabase functions logs analyze-dream
   ```

2. Verify OpenAI API key is set:

   ```bash
   supabase secrets list
   ```

3. Check OpenAI account has credits
4. Redeploy function:

   ```bash
   supabase functions deploy analyze-dream
   ```

### Issue: "Database error" or "RLS policy violation"

**Solutions:**

1. Verify you're signed in with Google
2. Check SQL setup completed successfully
3. Rerun `supabase/setup.sql` in SQL Editor
4. Verify RLS is enabled on tables:
   - Go to Table Editor → Click table → "RLS is enabled" should show

### Issue: "App crashes on startup"

**Solutions:**

1. Clear cache:

   ```bash
   npm start -- --clear
   ```

2. Reinstall dependencies:

   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check for TypeScript errors:

   ```bash
   npx tsc --noEmit
   ```

---

## Next Steps

Once the app is running:

1. **Test all features** using the checklist in `README.md`
2. **Read SECURITY.md** to understand security measures
3. **Review DEPLOYMENT.md** when ready to deploy to production
4. **Customize** the app (colors, branding, features)

---

## Getting Help

- **GitHub Issues:** Report bugs or ask questions
- **Documentation:** Check README.md, SECURITY.md, DEPLOYMENT.md
- **Expo Docs:** <https://docs.expo.dev>
- **Supabase Docs:** <https://supabase.com/docs>

---

## Quick Reference

**Start dev server:**

```bash
npm start
```

**View Supabase logs:**

```bash
supabase functions logs analyze-dream
```

**Redeploy functions:**

```bash
supabase functions deploy analyze-dream
supabase functions deploy transcribe-audio
```

**Check environment:**

```bash
cat .env
```

**Clear cache:**

```bash
npm start -- --clear
```

---

Success! You should now have a fully functional Dreamy app running locally. 🎉
