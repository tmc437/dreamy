# EAS Build Secrets Configuration

This guide explains how to manage environment variables and secrets for EAS Build.

## Overview

Your app requires these environment variables:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## Setup Methods

### Method 1: Using EAS Secrets (Recommended for Production)

EAS Secrets are encrypted environment variables stored securely on EAS servers.

#### Step 1: Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

#### Step 2: Login to EAS
```bash
eas login
```

#### Step 3: Create Secrets

**For your Supabase URL:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project-ref.supabase.co"
```

**For your Supabase Anon Key:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-public-key-here"
```

> **Important:** Replace the values with your actual Supabase credentials from:
> https://app.supabase.com/project/_/settings/api

#### Step 4: Verify Secrets
```bash
eas secret:list
```

You should see both secrets listed.

### Method 2: Using eas.json Environment Variables (Alternative)

You can also define environment variables directly in `eas.json`. **Note:** This is less secure for sensitive data as it gets committed to your repository.

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-project-ref.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```

⚠️ **Not recommended for secrets** - Only use this for non-sensitive configuration.

### Method 3: Using .env Files (Local Development Only)

For local development, create a `.env` file in your project root:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` with your actual values. This file is ignored by git (should be in `.gitignore`).

## Managing Secrets

### List all secrets
```bash
eas secret:list
```

### Delete a secret
```bash
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL
```

### Update a secret
Delete the old one and create a new one:
```bash
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "new-value"
```

## Environment-Specific Secrets

You can set different secrets for different build profiles:

### For development builds:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://dev-project.supabase.co" --type development
```

### For production builds:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://prod-project.supabase.co" --type production
```

## Quick Setup Script

Here's a quick setup script you can use:

```bash
#!/bin/bash

# Login to EAS
eas login

# Set your values here
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your-anon-public-key-here"

# Create secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "$SUPABASE_URL"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "$SUPABASE_ANON_KEY"

# Verify
eas secret:list

echo "✅ Secrets configured successfully!"
```

## Testing

After setting up secrets, test your build:

```bash
# For iOS
eas build --platform ios --profile production

# For Android  
eas build --platform android --profile production
```

## Troubleshooting

### "Missing environment variables" error
- Verify secrets are created: `eas secret:list`
- Make sure secret names match exactly (including `EXPO_PUBLIC_` prefix)
- Try deleting and recreating the secrets

### Secrets not available in build
- EAS Secrets are only available during EAS Build, not in local development
- For local dev, use a `.env` file
- Make sure `.env` is in your `.gitignore`

### Different values for development/production
- Use environment-specific secrets with `--type` flag
- Or configure different values in eas.json per profile

## Security Best Practices

1. ✅ **DO** use EAS Secrets for sensitive data (API keys, tokens)
2. ✅ **DO** keep `.env` files in `.gitignore`
3. ✅ **DO** use `EXPO_PUBLIC_` prefix for variables that need to be in the client bundle
4. ❌ **DON'T** commit secrets to git
5. ❌ **DON'T** share your `.env` file
6. ❌ **DON'T** use plaintext secrets in `eas.json` for production

## References

- [EAS Build Environment Variables](https://docs.expo.dev/build-reference/variables/)
- [EAS Secrets Documentation](https://docs.expo.dev/eas/secrets/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
