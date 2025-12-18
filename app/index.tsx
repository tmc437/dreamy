import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function WelcomeScreen() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect after authentication
  useEffect(() => {
    const checkWelcomeStatus = async () => {
      console.log('📱 Login Screen State:');
      console.log('  Loading:', loading);
      console.log('  User:', user ? `Authenticated (${user.email})` : 'Not authenticated');
      
      if (!loading && user) {
        console.log('✅ User authenticated, checking welcome status...');
        try {
          const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
          console.log('  Has seen welcome:', hasSeenWelcome);
          
          if (hasSeenWelcome === 'true') {
            console.log('➡️ Redirecting to home tabs...');
            router.replace('/(tabs)');
          } else {
            console.log('➡️ Redirecting to welcome screen...');
            router.replace('/welcome');
          }
        } catch (error) {
          console.error('❌ Error checking welcome status:', error);
          console.log('➡️ Defaulting to welcome screen...');
          router.replace('/welcome');
        }
      } else if (!loading && !user) {
        console.log('ℹ️ No user, staying on login screen');
      }
    };

    checkWelcomeStatus();
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    console.log('🔘 User clicked Sign in with Google button');
    try {
      setIsSigningIn(true);
      console.log('⏳ Initiating Google sign-in...');
      await signInWithGoogle();
      console.log('✅ Sign-in process completed');
      // Navigation will happen automatically via the useEffect above
    } catch (error) {
      console.error('❌ Sign in error:', error);
      Alert.alert(
        'Sign In Failed',
        'Unable to sign in with Google. Please try again.',
        [{ text: 'OK' }]
      );
      setIsSigningIn(false);
    }
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // Don't show welcome screen if user is authenticated
  if (user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <Ionicons name="moon" size={80} color="#FFFFFF" />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Dreamy</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Understand your dreams with AI</Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <Ionicons name="mic" size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>Voice & text recording</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="bulb" size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>AI-powered insights</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="heart" size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>Track your emotions</Text>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          {isSigningIn ? (
            <ActivityIndicator color="#8B5CF6" />
          ) : (
            <>
              <Ionicons name="logo-google" size={24} color="#8B5CF6" />
              <Text style={styles.signInButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Privacy Notice */}
        <Text style={styles.privacyText}>
          Your dreams are private and secure
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 48,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 48,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    opacity: 0.95,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 12,
  },
  privacyText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 24,
    textAlign: 'center',
  },
});

