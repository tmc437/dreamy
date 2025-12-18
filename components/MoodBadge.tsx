import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MoodBadgeProps {
  mood: string;
  size?: 'small' | 'large';
}

const MOOD_COLORS: Record<string, string> = {
  // Positive moods
  Happy: '#10B981',
  Joyful: '#10B981',
  Peaceful: '#3B82F6',
  Serene: '#3B82F6',
  Excited: '#F59E0B',
  Magical: '#8B5CF6',
  Adventurous: '#F59E0B',
  
  // Neutral moods
  Confusing: '#6B7280',
  Mysterious: '#6366F1',
  Curious: '#6366F1',
  Strange: '#6B7280',
  
  // Negative moods
  Anxious: '#EF4444',
  Scary: '#DC2626',
  Sad: '#6B7280',
  Frustrated: '#F97316',
  Worried: '#EF4444',
  
  // Default
  default: '#8B5CF6',
};

export default function MoodBadge({ mood, size = 'small' }: MoodBadgeProps) {
  const backgroundColor = MOOD_COLORS[mood] || MOOD_COLORS.default;
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor },
        isSmall ? styles.badgeSmall : styles.badgeLarge,
      ]}
    >
      <Text
        style={[
          styles.text,
          isSmall ? styles.textSmall : styles.textLarge,
        ]}
      >
        {mood}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 14,
  },
});

