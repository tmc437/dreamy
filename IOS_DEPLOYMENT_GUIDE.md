# 🍎 iOS Deployment Guide for Dreamy

This guide will walk you through deploying your Dreamy app to the Apple App Store using EAS Build.

## ✅ Prerequisites Checklist

- [ ] Apple Developer Account ($99/year) - [Sign up here](https://developer.apple.com/programs/)
- [ ] EAS Account (free) - Already configured! ✓
- [ ] Apple ID credentials ready
- [ ] Access to Apple Developer Portal

---

## 📋 Step 1: Gather Your Apple Credentials

You'll need the following information from your Apple Developer account:

### 1.1 Apple ID Email

- This is the email address associated with your Apple Developer account
- Example: `yourname@example.com`

### 1.2 Apple Team ID

1. Go to [Apple Developer Account](https://developer.apple.com/account)
2. Sign in with your Apple ID
3. Navigate to **Membership** in the sidebar
4. Find **Team ID** (10-character alphanumeric code)
5. Example: `AB1CD2EF34`

### 1.3 App-Specific Password (Required for submission)

1. Go to [Apple ID Account](https://appleid.apple.com/)
2. Sign in
3. Navigate to **Security** → **App-Specific Passwords**
4. Click **Generate Password**
5. Name it: "EAS Submit"
6. **Save this password** - you'll use it during submission

---

## 🏗️ Step 2: Create Your App in App Store Connect

Before building, create your app listing:

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** button → **New App**
3. Fill in the form:
   - **Platform**: iOS
   - **Name**: Dreamy
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `com.dreamy.app` from dropdown
     - If not available, you need to register it:
       - Go to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
       - Click **+** → **App IDs** → **App** → Continue
       - Description: "Dreamy Dream Journal"
       - Bundle ID: `com.dreamy.app`
   - **SKU**: `dreamy-app` (any unique identifier for your records)
   - **User Access**: Full Access

4. Click **Create**

5. **Get Your ASC App ID**:
   - After creation, click on your app in App Store Connect
   - Look at the URL or go to **App Information**
   - Find the numeric **App ID** (looks like: `1234567890`)
   - Save this number!

---

## ⚙️ Step 3: Update Your Configuration Files

### 3.1 Update `eas.json`

Open `eas.json` and replace the placeholders with your actual values:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@example.com",        // Your Apple ID email
      "ascAppId": "1234567890",                      // Your ASC App ID (numeric)
      "appleTeamId": "AB1CD2EF34"                    // Your Apple Team ID
    }
  }
}
```

**Example with real values:**

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "john.doe@email.com",
      "ascAppId": "6472839104",
      "appleTeamId": "X9Y8Z7A6B5"
    }
  }
}
```

---

## 🔨 Step 4: Build Your App

Now you're ready to build!

### 4.1 First-Time Build Setup

Run the build command:

```bash
eas build --platform ios --profile production
```

**What happens:**

1. EAS will ask for your Apple ID and App-Specific Password
2. EAS will automatically:
   - Create a Distribution Certificate
   - Create a Provisioning Profile
   - Register your app with Apple
   - Build your app in the cloud

### 4.2 During the Build

- EAS will prompt for credentials if not already configured
- Build typically takes 10-20 minutes
- You can watch progress in your terminal or at: <https://expo.dev/accounts/tmccann/projects/dreamy/builds>

### 4.3 Build Success

When complete, you'll get:

- ✅ `.ipa` file (iOS app package)
- 🔗 Download link
- 📦 Ready for submission!

---

## 🚀 Step 5: Submit to App Store Connect

After a successful build, submit your app:

```bash
eas submit --platform ios --profile production
```

**What EAS will do:**

1. Ask for your App-Specific Password (from Step 1.3)
2. Upload the `.ipa` file to App Store Connect
3. Automatically set it up for TestFlight and App Store Review

**Alternative: Select a previous build**

```bash
eas submit --platform ios --profile production --latest
```

---

## 📝 Step 6: Complete App Store Listing

After submission, complete your App Store listing:

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select **Dreamy**
3. Fill in required information:

### App Information

- **Category**: Lifestyle (or Health & Fitness)
- **Content Rights**: Does not contain third-party content
- **Age Rating**: Complete questionnaire

### Version Information

- **Screenshots**: Provide at least 3 screenshots (required for 6.7", 6.5", and 5.5" displays)
  - Use iPhone 15 Pro Max, iPhone 15, etc.
  - Tip: Use Xcode Simulator or your actual device
- **Description**: Write compelling app description
  - "Dreamy is your personal AI-powered dream journal..."
- **Keywords**: dream journal, dreams, ai, analysis, sleep
- **Support URL**: Your support website or GitHub repo
- **Marketing URL** (optional): Your app's website

### Privacy Policy

- **Privacy Policy URL**: Required! Create one using:
  - [Free Privacy Policy Generator](https://www.freeprivacypolicy.com/)
  - Or host your own

### Build

- Click **+** next to **Build**
- Select the build EAS just uploaded
- Click **Done**

### Pricing and Availability

- Select **Free** (or set your price)
- Select countries/regions

---

## 🧪 Step 7: TestFlight (Optional but Recommended)

Before submitting for review, test with TestFlight:

1. In App Store Connect, go to **TestFlight** tab
2. Your build is automatically available
3. Add **Internal Testers** (up to 100, instant access)
4. Or add **External Testers** (needs Beta App Review)
5. Share the TestFlight link with testers

---

## ✅ Step 8: Submit for Review

When ready:

1. Go to **App Store** tab in App Store Connect
2. Click your version (1.0.0)
3. Verify all information is complete (green checkmarks)
4. Click **Add for Review**
5. Answer export compliance questions:
   - Does your app use encryption? (Usually "No" for standard HTTPS)
6. Click **Submit for Review**

**Review Timeline**: Typically 24-48 hours

---

## 🔄 Future Updates

When you want to release updates:

### Update Version Number

Edit `app.json`:

```json
"version": "1.0.1"  // Increment this
```

### Build & Submit

```bash
# Build new version
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

The `autoIncrement` in your `eas.json` automatically handles build numbers!

---

## 🐛 Troubleshooting

### "Could not find a valid distribution certificate"

```bash
eas credentials
```

Select iOS → Production → Manage Credentials

### "Invalid Bundle Identifier"

- Verify `com.dreamy.app` is registered in Apple Developer Portal
- Check it matches exactly in `app.json`

### "Missing Compliance"

- Answer export compliance questions in App Store Connect
- Usually apps only need "No" for standard encryption

### Build Fails

- Check build logs at: <https://expo.dev/accounts/tmccann/projects/dreamy/builds>
- Common issues:
  - Missing dependencies
  - TypeScript errors
  - Native module configuration

---

## 📚 Useful Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

---

## 🎉 Quick Reference Commands

```bash
# Login to EAS
eas login

# Build for production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production

# Check build status
eas build:list

# View credentials
eas credentials

# Update credentials
eas credentials --platform ios
```

---

## ✨ Your Current Configuration

- **EAS Project ID**: `e86634a8-0390-4637-b5c9-0020cc330ff3`
- **Bundle ID**: `com.dreamy.app`
- **App Name**: Dreamy
- **Version**: 1.0.0
- **Scheme**: dreamy

---

Good luck with your App Store submission! 🚀
