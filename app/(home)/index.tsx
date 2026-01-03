import DreamCard from '@/components/DreamCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDreams } from '@/lib/database';
import { getErrorMessage, logError } from '@/lib/errorHandler';
import { Dream } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DreamsListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDreams = useCallback(async (isRefreshing = false) => {
    // Don't load dreams if user is not authenticated
    if (!user) {
      setDreams([]);
      setLoading(false);
      return;
    }

    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      const fetchedDreams = await fetchDreams();
      setDreams(fetchedDreams);
    } catch (err) {
      logError(err, 'Loading dreams');
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Clear dreams when user signs out
  useEffect(() => {
    if (!user) {
      console.log('🔒 User signed out, clearing dreams from view');
      setDreams([]);
      setError(null);
      setLoading(false);
    }
  }, [user]);

  // Reload dreams when screen comes into focus (e.g., after login or returning from dream detail)
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadDreams();
      }
    }, [user, loadDreams])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDreams(true);
  }, []);

  const handleDreamPress = (dreamId: string) => {
    router.push(`/dream/${dreamId}`);
  };

  const handleNewDream = () => {
    router.push('/dream/new');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="moon" size={80} color="#8B5CF6" />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Welcome to Your Dream Journal! 🌙
      </Text>
      <Text style={[styles.emptyText, { color: colors.text, opacity: 0.7 }]}>
        Ready to explore your subconscious? Record your first dream and get instant AI-powered insights about what it means.
      </Text>
      
      <View style={styles.emptyTipsContainer}>
        <View style={styles.emptyTip}>
          <Ionicons name="mic" size={20} color="#8B5CF6" />
          <Text style={[styles.emptyTipText, { color: colors.text }]}>
            Use voice or text input
          </Text>
        </View>
        <View style={styles.emptyTip}>
          <Ionicons name="sparkles" size={20} color="#8B5CF6" />
          <Text style={[styles.emptyTipText, { color: colors.text }]}>
            Get instant AI analysis
          </Text>
        </View>
        <View style={styles.emptyTip}>
          <Ionicons name="time" size={20} color="#8B5CF6" />
          <Text style={[styles.emptyTipText, { color: colors.text }]}>
            Record soon after waking
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.emptyButton} onPress={handleNewDream}>
        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Record Your First Dream</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={60} color="#EF4444" />
      <Text style={[styles.errorTitle, { color: colors.text }]}>
        Something went wrong
      </Text>
      <Text style={[styles.errorText, { color: colors.text, opacity: 0.7 }]}>
        {error}
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => loadDreams()}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Show loading spinner if no user (root layout will redirect to login)
  if (!user) {
    return (
      <View style={styles.authLoadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="moon" size={60} color="#8B5CF6" />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading your dreams...
        </Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderError()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={dreams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DreamCard dream={item} onPress={() => handleDreamPress(item.id)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          dreams.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
            colors={['#8B5CF6']}
          />
        }
      />
    </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyTipsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  emptyTip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  emptyTipText: {
    fontSize: 14,
    marginLeft: 12,
    opacity: 0.8,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
