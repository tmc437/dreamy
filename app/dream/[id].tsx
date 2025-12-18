import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchDreamById, deleteDream, analyzeDream, updateDream } from '@/lib/database';
import { Dream } from '@/lib/types';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import MoodBadge from '@/components/MoodBadge';
import LoadingOverlay from '@/components/LoadingOverlay';
import { getErrorMessage, logError, handleAIError } from '@/lib/errorHandler';

export default function DreamDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDream();
  }, [id]);

  const loadDream = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedDream = await fetchDreamById(id);
      if (!fetchedDream) {
        setError('Dream not found');
      } else {
        setDream(fetchedDream);
      }
    } catch (err) {
      logError(err, 'Loading dream detail');
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Dream?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDream(id);
              router.back();
            } catch (err) {
              logError(err, 'Deleting dream');
              Alert.alert('Error', 'Failed to delete dream. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleRetryAnalysis = async () => {
    if (!dream) return;

    try {
      setAnalyzing(true);

      const analysis = await analyzeDream(dream.content);

      const updatedDream = await updateDream(dream.id, {
        title: analysis.title,
        interpretation: analysis.interpretation,
        mood: analysis.mood,
        keywords: analysis.keywords,
      });

      setDream(updatedDream);
      Alert.alert('Success', 'Your dream has been analyzed!');
    } catch (err) {
      logError(err, 'Retrying dream analysis');
      Alert.alert('Analysis Failed', handleAIError(err));
    } finally {
      setAnalyzing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (error || !dream) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle" size={60} color="#EF4444" />
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error || 'Dream not found'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasAnalysis = dream.title || dream.interpretation || dream.mood;

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.dateContainer}>
              <Ionicons
                name={dream.is_lucid ? 'sparkles' : 'moon'}
                size={24}
                color={dream.is_lucid ? '#F59E0B' : '#8B5CF6'}
              />
              <Text style={[styles.date, { color: colors.text }]}>
                {formatDate(dream.dream_date)}
              </Text>
            </View>
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {dream.is_lucid && (
            <View style={styles.lucidBadge}>
              <Ionicons name="sparkles" size={16} color="#F59E0B" />
              <Text style={styles.lucidText}>Lucid Dream</Text>
            </View>
          )}
        </View>

        {/* AI Analysis Section */}
        {hasAnalysis ? (
          <View style={styles.analysisSection}>
            {/* Title */}
            {dream.title && (
              <Text style={[styles.title, { color: colors.text }]}>
                {dream.title}
              </Text>
            )}

            {/* Mood */}
            {dream.mood && (
              <View style={styles.moodContainer}>
                <MoodBadge mood={dream.mood} size="large" />
              </View>
            )}

            {/* Interpretation */}
            {dream.interpretation && (
              <View style={styles.interpretationContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="bulb" size={20} color="#8B5CF6" />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Interpretation
                  </Text>
                </View>
                <Text style={[styles.interpretation, { color: colors.text }]}>
                  {dream.interpretation}
                </Text>
              </View>
            )}

            {/* Keywords */}
            {dream.keywords && dream.keywords.length > 0 && (
              <View style={styles.keywordsSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="pricetags" size={20} color="#8B5CF6" />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Themes
                  </Text>
                </View>
                <View style={styles.keywordsContainer}>
                  {dream.keywords.map((keyword, index) => (
                    <View key={index} style={styles.keyword}>
                      <Text style={styles.keywordText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noAnalysisContainer}>
            <Ionicons name="alert-circle" size={48} color="#F59E0B" />
            <Text style={[styles.noAnalysisTitle, { color: colors.text }]}>
              No Analysis Yet
            </Text>
            <Text style={[styles.noAnalysisText, { color: colors.text }]}>
              This dream hasn't been analyzed by AI yet.
            </Text>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={handleRetryAnalysis}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={styles.analyzeButtonText}>Analyze Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Original Dream Content */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={20} color="#8B5CF6" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Dream
            </Text>
          </View>
          <Text style={[styles.content, { color: colors.text }]}>
            {dream.content}
          </Text>
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={[styles.metadataText, { color: colors.text }]}>
            Recorded on{' '}
            {new Date(dream.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Text>
        </View>
      </ScrollView>

      <LoadingOverlay visible={analyzing} message="Analyzing your dream..." />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  lucidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  lucidText: {
    marginLeft: 6,
    color: '#92400E',
    fontWeight: '600',
  },
  analysisSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 36,
  },
  moodContainer: {
    marginBottom: 20,
  },
  interpretationContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  interpretation: {
    fontSize: 16,
    lineHeight: 26,
  },
  keywordsSection: {
    marginBottom: 20,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keyword: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  noAnalysisContainer: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  noAnalysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noAnalysisText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: 'center',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contentSection: {
    marginBottom: 24,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
  },
  metadata: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  metadataText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

