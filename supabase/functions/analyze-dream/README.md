# Analyze Dream Edge Function

This Supabase Edge Function securely proxies requests to the OpenAI API for dream analysis.

## Setup Instructions

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

You can find your project reference in your Supabase project URL:
`https://YOUR_PROJECT_REF.supabase.co`

### 4. Set Environment Secrets

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

### 5. Deploy the Function

```bash
supabase functions deploy analyze-dream
```

### 6. Test the Function

After deployment, you can test it:

```bash
supabase functions invoke analyze-dream --data '{"dreamContent":"I was flying over the ocean"}'
```

## Usage in App

The function is called from the React Native app using:

```typescript
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/analyze-dream`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ dreamContent: 'Your dream here...' }),
  }
);
```

## Security Features

- ✅ User authentication required (validates JWT token)
- ✅ OpenAI API key kept secret on server
- ✅ CORS enabled for web/mobile access
- ✅ Input validation
- ✅ Error handling and logging

## Monitoring

View function logs:

```bash
supabase functions logs analyze-dream
```

## Rate Limiting

TODO: Implement rate limiting by tracking user requests in the database.

