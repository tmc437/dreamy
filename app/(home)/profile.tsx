import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Show loading if no user (root layout will redirect to login)
  if (!user) {
    return (
      <View style={styles.authLoadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const handleReviewWelcome = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenWelcome');
      router.push('/welcome');
    } catch (error) {
      console.error('Error clearing welcome status:', error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        {user?.user_metadata?.avatar_url ? (
          <Image
            source={{ uri: user.user_metadata.avatar_url }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 
               user?.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
        
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.user_metadata?.full_name || 'Dream Explorer'}
        </Text>
        
        <Text style={[styles.email, { color: colors.text, opacity: 0.7 }]}>
          {user?.email}
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Dreams Recorded</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB',
              borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
            },
          ]}
          onPress={handleReviewWelcome}
        >
          <Ionicons name="information-circle-outline" size={24} color="#8B5CF6" />
          <View style={styles.actionButtonText}>
            <Text style={[styles.actionButtonTitle, { color: colors.text }]}>
              Review Welcome Guide
            </Text>
            <Text style={[styles.actionButtonSubtitle, { color: colors.text }]}>
              See app tips and features again
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.3 }} />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About Dreamzzz
        </Text>
        <Text style={[styles.infoText, { color: colors.text, opacity: 0.7 }]}>
          Dreamzzz helps you record and understand your dreams using AI-powered
          insights. Track your dream patterns, emotions, and discover the meaning
          behind your subconscious thoughts.
        </Text>
      </View>

      {/* Version Info */}
      <Text style={[styles.versionText, { color: colors.text, opacity: 0.5 }]}>
        Version 1.0.0 (MVP)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  authLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  infoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 16,
  },
});

