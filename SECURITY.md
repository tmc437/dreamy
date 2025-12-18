# Security Documentation - Dreamy App

## Security Measures Implemented

### 1. Authentication & Authorization

✅ **Supabase Authentication**
- Google OAuth 2.0 integration
- JWT token-based authentication
- Session management with automatic token refresh
- Secure token storage using AsyncStorage

✅ **Protected Routes**
- All authenticated routes check for valid session
- Automatic redirect to login for unauthenticated users
- Auth state managed globally via React Context

### 2. Database Security

✅ **Row Level Security (RLS)**
- All tables have RLS enabled
- Users can only access their own data
- Policies enforce `auth.uid() = user_id` checks

**Profiles Table:**
```sql
-- Users can view and update only their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

**Dreams Table:**
```sql
-- Users have full CRUD access to only their dreams
CREATE POLICY "Users can view own dreams" ON dreams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dreams" ON dreams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dreams" ON dreams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dreams" ON dreams FOR DELETE USING (auth.uid() = user_id);
```

### 3. API Security

✅ **Edge Functions**
- OpenAI API key stored as Supabase secret (never exposed to client)
- All Edge Function requests require valid JWT token
- User authentication verified on every request
- CORS properly configured

✅ **Input Validation**
- Dream content length limited (5000 characters)
- Required fields validated before submission
- SQL injection prevented by Supabase client's parameterized queries

✅ **Rate Limiting**
- TODO: Implement rate limiting in Edge Functions
- Recommended: 10 AI requests per hour per user

### 4. Data Privacy

✅ **User Data**
- All personal data encrypted at rest (Supabase default)
- TLS/HTTPS for all data in transit
- No third-party analytics or tracking
- User data never shared with external services (except OpenAI for analysis)

✅ **Environment Variables**
- Sensitive credentials stored in `.env` (gitignored)
- Different environments (dev/prod) use separate Supabase projects
- No hardcoded secrets in source code

### 5. Client-Side Security

✅ **Secure Storage**
- Auth tokens stored in encrypted AsyncStorage
- No sensitive data in plain text
- Session tokens automatically cleared on logout

✅ **Error Handling**
- Errors logged without exposing sensitive info
- User-friendly error messages (no stack traces to users)
- Centralized error handling in `lib/errorHandler.ts`

### 6. Mobile App Security

✅ **iOS**
- Bundle identifier: `com.dreamy.app`
- Microphone permission with clear usage description
- Deep linking with custom URL scheme (`dreamy://`)

✅ **Android**
- Package name: `com.dreamy.app`
- Permissions: RECORD_AUDIO, CAMERA (minimal required)
- ProGuard/R8 code obfuscation in production builds

## Security Checklist

Before deploying to production:

- [ ] Change all default environment variables
- [ ] Use separate Supabase projects for dev/staging/prod
- [ ] Enable 2FA on Supabase account
- [ ] Review and test all RLS policies
- [ ] Implement rate limiting on Edge Functions
- [ ] Set up monitoring and alerting for suspicious activity
- [ ] Review CORS settings in Edge Functions
- [ ] Enable database backups in Supabase
- [ ] Set up proper logging (avoid logging sensitive data)
- [ ] Review and minimize Android/iOS permissions
- [ ] Enable code obfuscation for production builds
- [ ] Set up Content Security Policy for web version

## Reporting Security Issues

If you discover a security vulnerability, please email: security@dreamy.app

Do NOT create public GitHub issues for security vulnerabilities.

## Third-Party Services

1. **Supabase** (Authentication & Database)
   - SOC 2 Type II compliant
   - GDPR compliant
   - https://supabase.com/security

2. **OpenAI** (AI Analysis)
   - API data not used for model training (as of policy)
   - https://openai.com/policies/api-data-usage-policies

## Regular Security Tasks

- [ ] Review RLS policies quarterly
- [ ] Rotate API keys annually
- [ ] Update dependencies monthly (security patches)
- [ ] Audit authentication logs monthly
- [ ] Review Edge Function logs weekly
- [ ] Penetration testing before major releases

## Data Retention

- User dreams: Retained until user deletes account
- Auth tokens: 7 day expiry (automatic refresh)
- Error logs: Retained for 30 days
- Account deletion: All user data permanently deleted within 24 hours

## Compliance

- GDPR: Users have right to export and delete data
- CCPA: California users have right to data disclosure
- COPPA: App not intended for users under 13

Last Updated: December 2025

