# Dreamy - AI-Powered Dream Journal

A cross-platform mobile and web application for recording and analyzing your dreams using artificial intelligence.

## Features

- 🌙 **Dream Recording** - Record dreams via text or voice input
- 🤖 **AI Analysis** - Get instant psychological insights powered by GPT-4
- 💭 **Mood Tracking** - Track emotional patterns in your dreams
- 🏷️ **Keyword Tagging** - Automatic theme extraction and categorization
- ✨ **Lucid Dream Tracking** - Mark and track lucid dreaming experiences
- 📱 **Cross-Platform** - Available on iOS, Android, and Web
- 🔒 **Secure & Private** - Your dreams are encrypted and never shared

## Tech Stack

- **Frontend:** React Native + Expo
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **AI:** OpenAI GPT-4o-mini & Whisper
- **Authentication:** Google OAuth via Supabase Auth
- **Routing:** Expo Router (file-based)

## Project Structure

```
dreamy/
├── app/                      # Expo Router screens
│   ├── (home)/              # Main tab navigation
│   │   ├── index.tsx        # Dreams list
│   │   └── profile.tsx      # User profile
│   ├── dream/               # Dream-related screens
│   │   ├── new.tsx          # Create new dream
│   │   └── [id].tsx         # Dream detail view
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Welcome/Login screen
├── components/              # Reusable components
│   ├── DreamCard.tsx
│   ├── MoodBadge.tsx
│   ├── LoadingOverlay.tsx
│   └── VoiceRecorder.tsx
├── contexts/                # React contexts
│   └── AuthContext.tsx
├── lib/                     # Utilities & business logic
│   ├── supabase.ts          # Supabase client
│   ├── database.ts          # Database operations
│   ├── errorHandler.ts      # Error handling
│   └── types.ts             # TypeScript types
├── supabase/                # Supabase configuration
│   ├── setup.sql            # Database schema
│   └── functions/           # Edge Functions
│       ├── analyze-dream/
│       └── transcribe-audio/
├── .env.example             # Environment template
├── SECURITY.md              # Security documentation
└── DEPLOYMENT.md            # Deployment guide
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI
- Supabase account
- OpenAI API key
- Google Cloud project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dreamy.git
   cd dreamy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   Additional required packages:
   ```bash
   npm install @supabase/supabase-js @react-native-async-storage/async-storage expo-secure-store expo-auth-session expo-crypto expo-av react-native-url-polyfill expo-linear-gradient @react-native-community/datetimepicker
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase backend**
   
   a. Create a Supabase project at https://supabase.com
   
   b. Run the database setup script:
   - Open SQL Editor in Supabase Dashboard
   - Copy and run `supabase/setup.sql`
   
   c. Configure Google OAuth:
   - Follow instructions in `DEPLOYMENT.md`
   
   d. Deploy Edge Functions:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase secrets set OPENAI_API_KEY=your_openai_key
   supabase functions deploy analyze-dream
   supabase functions deploy transcribe-audio
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

### Running the App

- **Web:** Press `w` or run `npm run web`
- **iOS:** Press `i` or run `npm run ios` (requires macOS + Xcode)
- **Android:** Press `a` or run `npm run android` (requires Android Studio)

## Development

### Database Schema

See `supabase/setup.sql` for the complete database schema.

**Main Tables:**
- `profiles` - User profile information
- `dreams` - Dream entries with AI analysis

All tables have Row Level Security (RLS) enabled to ensure data privacy.

### Environment Variables

Required environment variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Centralized error handling
- Modular component architecture

## Testing

### Manual Testing Checklist

- [ ] User can sign in with Google
- [ ] User can create a dream (text)
- [ ] User can create a dream (voice)
- [ ] AI analysis completes successfully
- [ ] Dreams list displays correctly
- [ ] Dream detail view works
- [ ] User can delete a dream
- [ ] User can sign out
- [ ] Session persists after app restart

### Security Testing

- [ ] RLS policies prevent unauthorized access
- [ ] Edge Functions require authentication
- [ ] No API keys exposed in client code
- [ ] HTTPS/TLS for all connections

## Deployment

See `DEPLOYMENT.md` for comprehensive deployment instructions.

**Quick Deploy:**

1. Configure EAS:
   ```bash
   npm install -g eas-cli
   eas build:configure
   ```

2. Build for iOS:
   ```bash
   eas build --platform ios --profile production
   ```

3. Build for Android:
   ```bash
   eas build --platform android --profile production
   ```

4. Deploy web:
   ```bash
   npx expo export --platform web
   vercel --prod
   ```

## Security

This app implements multiple security layers:

- ✅ Row Level Security (RLS) on all database tables
- ✅ JWT-based authentication
- ✅ API keys stored as server secrets
- ✅ Input validation and sanitization
- ✅ HTTPS/TLS encryption
- ✅ Secure token storage

See `SECURITY.md` for detailed security documentation.

## Roadmap

### v1.0 (MVP) ✅
- User authentication
- Dream recording (text & voice)
- AI analysis
- Basic dream management

### v1.5 (Planned)
- Dashboard with statistics
- Mood heatmap calendar
- Pattern recognition
- Search and filter

### v2.0 (Future)
- Lucid dreaming tools
- Reality check notifications
- Astrological integration
- Social features (optional sharing)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

- Email: support@dreamy.app
- Documentation: See DEPLOYMENT.md and SECURITY.md
- Issues: GitHub Issues

## Acknowledgments

- OpenAI for GPT-4 and Whisper APIs
- Supabase for backend infrastructure
- Expo for cross-platform framework
- React Native community

---

Made with 💜 by the Dreamy team

**Note:** This is an MVP (Minimum Viable Product). Features and functionality will continue to evolve based on user feedback.

