# Deployment Guide - Dreamy App

This guide walks you through deploying the Dreamy app from development to production.

## Prerequisites

- [ ] Supabase account with production project created
- [ ] OpenAI API key with credits
- [ ] Apple Developer Account ($99/year) for iOS
- [ ] Google Play Developer Account ($25 one-time) for Android
- [ ] EAS (Expo Application Services) account
- [ ] Domain name (optional, for web)

---

## Step 1: Environment Setup

### 1.1 Create Production Supabase Project

1. Go to https://supabase.com/dashboard
2. Create a new project (choose a region close to your users)
3. Note the Project URL and Anon Key from Settings → API

### 1.2 Run Database Setup

1. Open SQL Editor in Supabase Dashboard
2. Copy contents of `supabase/setup.sql`
3. Execute the SQL script
4. Verify tables are created in Table Editor

### 1.3 Configure Google OAuth

**In Google Cloud Console:**
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Navigate to APIs & Services → Credentials
4. Create OAuth 2.0 Client IDs for:
   - **Web Application**
     - Authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - **iOS Application**
     - Bundle ID: `com.dreamy.app`
   - **Android Application**
     - Package name: `com.dreamy.app`
     - SHA-1 fingerprint: (get from EAS credentials)

**In Supabase Dashboard:**
1. Navigate to Authentication → Providers
2. Enable Google provider
3. Add Client ID and Client Secret from Google Cloud Console
4. Save configuration

### 1.4 Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your production project
supabase link --project-ref YOUR_PROJECT_REF

# Set OpenAI API key as secret
supabase secrets set OPENAI_API_KEY=sk-...

# Deploy analyze-dream function
supabase functions deploy analyze-dream

# Deploy transcribe-audio function
supabase functions deploy transcribe-audio

# Verify deployment
supabase functions list
```

### 1.5 Update Environment Variables

Create `.env` for production:
```
EXPO_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Step 2: Configure EAS Build

### 2.1 Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2.2 Initialize EAS

```bash
eas build:configure
```

This creates `eas.json`. Update it with:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your_dev_url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your_dev_key"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your_prod_url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your_prod_key"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2.3 Update app.json

Replace `your-eas-project-id` in `app.json` with actual EAS project ID:

```bash
eas init
```

---

## Step 3: Build for iOS

### 3.1 Enroll in Apple Developer Program

1. Visit https://developer.apple.com/programs/
2. Enroll ($99/year)
3. Complete verification (can take 1-2 days)

### 3.2 Build iOS App

```bash
# Create production build
eas build --platform ios --profile production

# Wait for build to complete (10-20 minutes)
# Download .ipa file or submit directly
```

### 3.3 Submit to App Store

```bash
# Submit to TestFlight first
eas submit --platform ios --profile production

# Or manually upload using Transporter app
```

### 3.4 App Store Listing

1. Go to https://appstoreconnect.apple.com
2. Create new app
3. Fill in metadata:
   - **Name:** Dreamy
   - **Subtitle:** AI-Powered Dream Journal
   - **Description:** Record and understand your dreams with AI
   - **Keywords:** dream, journal, ai, psychology, sleep
   - **Category:** Health & Fitness
   - **Privacy Policy URL:** (required)
4. Upload screenshots (5.5", 6.5", 12.9" iPad)
5. Submit for review

---

## Step 4: Build for Android

### 4.1 Create Google Play Developer Account

1. Visit https://play.google.com/console/signup
2. Pay one-time $25 fee
3. Complete account setup

### 4.2 Build Android App

```bash
# Create production build
eas build --platform android --profile production

# Wait for build to complete (10-20 minutes)
# Download .aab file
```

### 4.3 Submit to Google Play

```bash
# Submit to internal testing first
eas submit --platform android --profile production

# Or manually upload in Play Console
```

### 4.4 Play Store Listing

1. Go to https://play.google.com/console
2. Create new app
3. Fill in metadata:
   - **App name:** Dreamy
   - **Short description:** AI-powered dream journal and analysis
   - **Full description:** Detailed description with features
   - **Category:** Health & Fitness
   - **Content rating:** Complete questionnaire
4. Upload graphics:
   - Feature graphic (1024x500)
   - App icon (512x512)
   - Screenshots (at least 2)
5. Set pricing (Free)
6. Submit for review

---

## Step 5: Deploy Web Version

### 5.1 Build for Web

```bash
# Create production web build
npx expo export --platform web

# Output is in dist/ folder
```

### 5.2 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd dist
vercel --prod

# Set environment variables in Vercel dashboard
```

### 5.3 Alternative: Deploy to Netlify

1. Push `dist/` folder to Git
2. Connect repository to Netlify
3. Set build command: `npx expo export --platform web`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

---

## Step 6: Post-Deployment

### 6.1 Monitor Edge Functions

```bash
# View logs
supabase functions logs analyze-dream
supabase functions logs transcribe-audio

# Set up alerts in Supabase dashboard
```

### 6.2 Set Up Analytics (Optional)

Consider adding:
- Google Analytics for web
- Firebase Analytics for mobile
- PostHog for open-source analytics

### 6.3 Enable Crash Reporting

Add Sentry or similar:

```bash
npm install @sentry/react-native
```

### 6.4 Set Up Database Backups

1. In Supabase Dashboard → Database → Backups
2. Enable automatic backups
3. Configure retention policy

### 6.5 Configure Monitoring

- Set up Uptime monitoring (e.g., UptimeRobot)
- Monitor OpenAI API usage and costs
- Set budget alerts in Supabase

---

## Step 7: Testing Production

### 7.1 Test Authentication

- [ ] Google Sign-In works on web
- [ ] Google Sign-In works on iOS
- [ ] Google Sign-In works on Android
- [ ] Session persists after app restart
- [ ] Sign out works correctly

### 7.2 Test Core Features

- [ ] Create new dream (text input)
- [ ] Create new dream (voice input)
- [ ] AI analysis completes successfully
- [ ] Dreams list loads correctly
- [ ] Dream detail view displays properly
- [ ] Delete dream works
- [ ] Pull-to-refresh works

### 7.3 Test Security

- [ ] Cannot access other users' dreams
- [ ] RLS policies work correctly
- [ ] Edge Functions require authentication
- [ ] API keys not exposed in client

---

## Step 8: Launch Checklist

- [ ] All environment variables set correctly
- [ ] Database backups enabled
- [ ] SSL/TLS certificates valid
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email set up (support@dreamy.app)
- [ ] Social media accounts created
- [ ] App Store/Play Store listings complete
- [ ] TestFlight/Internal testing completed
- [ ] Production testing on all platforms
- [ ] Monitoring and alerts configured
- [ ] Crash reporting enabled

---

## Updating the App

### For Bug Fixes (Patch Update)

```bash
# Increment version in app.json (1.0.0 → 1.0.1)
# Build and submit
eas build --platform all --profile production
eas submit --platform all --profile production
```

### For New Features (Minor Update)

```bash
# Increment version in app.json (1.0.0 → 1.1.0)
# Update database schema if needed
# Deploy new Edge Functions if needed
# Build and submit
```

### Over-The-Air Updates (for React Native changes only)

```bash
# Create OTA update (no native code changes)
eas update --branch production
```

---

## Rollback Procedure

If critical bug found in production:

1. **Web:** Revert to previous Vercel deployment
2. **Mobile (OTA):** `eas update --branch production --message "Rollback"`
3. **Mobile (Native):** Submit previous working build with incremented version
4. **Database:** Restore from backup if needed (Supabase Dashboard)

---

## Cost Estimation

- **Supabase:** Free tier → $25/month (Pro) as you grow
- **OpenAI API:** ~$0.002 per dream analysis (~$2 per 1000 analyses)
- **Expo EAS:** Free for personal → $29/month for teams
- **Apple Developer:** $99/year
- **Google Play:** $25 one-time
- **Domain + Hosting:** ~$10-20/month

**Total (Year 1):** ~$500-800 depending on usage

---

## Support Resources

- **Expo Docs:** https://docs.expo.dev
- **Supabase Docs:** https://supabase.com/docs
- **React Native Docs:** https://reactnative.dev/docs
- **OpenAI API Docs:** https://platform.openai.com/docs

---

## Troubleshooting

### Build Fails
- Check `eas.json` configuration
- Ensure all dependencies are installed
- Verify bundle identifiers match

### Authentication Not Working
- Check redirect URIs in Google Cloud Console
- Verify Supabase Auth settings
- Check scheme in `app.json` matches deep link configuration

### Edge Functions Failing
- Check Supabase function logs
- Verify OPENAI_API_KEY secret is set
- Ensure proper CORS headers

---

Good luck with your launch! 🚀

