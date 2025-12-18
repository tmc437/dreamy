import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';

// Complete the auth session after redirect (required for web)
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🔐 AuthProvider initialized');

  useEffect(() => {
    console.log('🔍 Checking for existing session...');
    
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
      }
      
      if (session) {
        console.log('✅ Session found!');
        console.log('  User ID:', session.user.id);
        console.log('  Email:', session.user.email);
        console.log('  Expires at:', new Date(session.expires_at! * 1000).toLocaleString());
      } else {
        console.log('ℹ️ No existing session found');
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    console.log('👂 Setting up auth state listener...');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state changed:', event);
      
      if (session) {
        console.log('✅ Session active');
        console.log('  User ID:', session.user.id);
        console.log('  Email:', session.user.email);
      } else {
        console.log('ℹ️ No session (user logged out or session expired)');
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('🔇 Unsubscribing from auth state changes');
      subscription.unsubscribe();
    };
  }, []);

  // Handle OAuth redirect URL for mobile
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web OAuth is handled automatically by Supabase
      return;
    }

    const handleDeepLink = async (url: string) => {
      if (!url) {
        return;
      }

      if (url.includes('#access_token=') || url.includes('?access_token=')) {
        try {
          console.log('Auth callback received, exchanging code for session...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(url);

          if (error) {
            console.error('❌ Error exchanging auth code:', error);
            return;
          }

          if (data?.session) {
            console.log('✅ Session established from deep link');
          } else {
            console.warn('⚠️ No session returned from deep link exchange');
          }
        } catch (exchangeError) {
          console.error('❌ Unexpected deep link handling error:', exchangeError);
        }
      }
    };

    // Listen for URL changes (deep linking)
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // Check if app was opened with a URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const signInWithGoogle = async () => {
    console.log('🚀 Starting Google Sign-In...');
    console.log('  Platform:', Platform.OS);
    
    try {
      if (Platform.OS === 'web') {
        console.log('🌐 Using web OAuth flow');
        console.log('  Redirect URL:', window.location.origin);
        
        // Web: Use standard OAuth flow
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) {
          console.error('❌ OAuth error:', error);
          throw error;
        }
        
        console.log('✅ OAuth request sent, redirecting to Google...');
      } else {
        // Mobile: Use browser-based OAuth with deep linking
        console.log('📱 Using mobile OAuth flow');
        
        const redirectUrl = makeRedirectUri({
          scheme: 'dreamy',
          path: 'auth/callback',
        });

        console.log('  Redirect URL:', redirectUrl);

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
          },
        });

        if (error) {
          console.error('❌ OAuth error:', error);
          throw error;
        }

        if (data?.url) {
          console.log('✅ Opening browser for authentication...');
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl
          );

          console.log('  Browser result:', result.type);

          if (result.type === 'success') {
            console.log('✅ OAuth completed successfully');
          } else if (result.type === 'cancel') {
            console.log('❌ User cancelled authentication');
            throw new Error('Authentication was cancelled');
          }
        }
      }
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign-out error:', error);
        throw error;
      }
      console.log('✅ Successfully signed out');
    } catch (error) {
      console.error('❌ Unexpected sign-out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

