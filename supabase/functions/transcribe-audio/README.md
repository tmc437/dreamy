# Transcribe Audio Edge Function

This Supabase Edge Function transcribes audio recordings using OpenAI's Whisper API.

## Setup Instructions

### 1. Deploy the Function

```bash
supabase functions deploy transcribe-audio
```

Note: The OPENAI_API_KEY secret should already be set from the analyze-dream function.

### 2. Test the Function

```bash
# This function expects a form-data POST with an audio file
# Testing requires a multipart/form-data request with an audio file
```

## Usage in App

The function is called from the React Native app using:

```typescript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.m4a');

const response = await fetch(
  `${SUPABASE_URL}/functions/v1/transcribe-audio`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  }
);

const { text } = await response.json();
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
supabase functions logs transcribe-audio
```

## Supported Audio Formats

Whisper API supports: mp3, mp4, mpeg, mpga, m4a, wav, webm

The app uses m4a format for recordings.

