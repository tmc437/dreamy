import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dream } from '@/lib/types';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import MoodBadge from './MoodBadge';

interface DreamCardProps {
  dream: Dream;
  onPress: () => void;
}

export default function DreamCard({ dream, onPress }: DreamCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colorScheme === 'dark' ? '#333' : '#E5E7EB',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name={dream.is_lucid ? 'sparkles' : 'moon-outline'}
            size={20}
            color={dream.is_lucid ? '#F59E0B' : '#8B5CF6'}
          />
          <Text style={[styles.date, { color: colors.text }]}>
            {formatDate(dream.dream_date)}
          </Text>
        </View>
        {dream.mood && <MoodBadge mood={dream.mood} />}
      </View>

      {/* Title */}
      {dream.title && (
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {dream.title}
        </Text>
      )}

      {/* Interpretation or Content */}
      <Text
        style={[styles.content, { color: colors.text, opacity: 0.7 }]}
        numberOfLines={3}
      >
        {dream.interpretation
          ? truncateText(dream.interpretation, 120)
          : truncateText(dream.content, 120)}
      </Text>

      {/* Keywords */}
      {dream.keywords && dream.keywords.length > 0 && (
        <View style={styles.keywordsContainer}>
          {dream.keywords.slice(0, 3).map((keyword, index) => (
            <View key={index} style={styles.keyword}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
          {dream.keywords.length > 3 && (
            <Text style={[styles.moreKeywords, { color: colors.text }]}>
              +{dream.keywords.length - 3}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.7,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  keyword: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  keywordText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  moreKeywords: {
    fontSize: 12,
    opacity: 0.6,
  },
});

