import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    icon: 'moon' as const,
    title: 'Welcome to Dreamy',
    description: 'Your personal AI-powered dream journal. Record, analyze, and understand your dreams like never before.',
    color: '#8B5CF6',
  },
  {
    icon: 'mic' as const,
    title: 'Record Your Dreams',
    description: 'Capture your dreams using text or voice input. The sooner you record, the more details you\'ll remember.',
    color: '#6366F1',
  },
  {
    icon: 'sparkles' as const,
    title: 'AI-Powered Insights',
    description: 'Get instant psychological interpretations, mood analysis, and discover recurring themes in your dreams.',
    color: '#3B82F6',
  },
  {
    icon: 'heart' as const,
    title: 'Track Your Patterns',
    description: 'Explore emotional patterns, lucid dreaming experiences, and unlock insights about your subconscious mind.',
    color: '#EC4899',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving welcome status:', error);
      router.replace('/(tabs)');
    }
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index <= currentStep ? '#8B5CF6' : '#D1D5DB',
                },
              ]}
            />
          ))}
        </View>

        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${currentStepData.color}20` },
          ]}
        >
          <Ionicons
            name={currentStepData.icon}
            size={80}
            color={currentStepData.color}
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {currentStepData.title}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: colors.text }]}>
          {currentStepData.description}
        </Text>

        {/* Features List (only on first step) */}
        {currentStep === 0 && (
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Secure & Private
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={[styles.featureText, { color: colors.text }]}>
                AI-Powered Analysis
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Voice & Text Input
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Pattern Recognition
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        {/* Skip Button (not on last step) */}
        {currentStep < ONBOARDING_STEPS.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={[styles.skipButtonText, { color: colors.text }]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}

        {/* Next/Get Started Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            currentStep === ONBOARDING_STEPS.length - 1 && styles.nextButtonFull,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === ONBOARDING_STEPS.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
          {currentStep < ONBOARDING_STEPS.length - 1 && (
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 120,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 28,
    marginBottom: 32,
  },
  featuresList: {
    width: '100%',
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: 'transparent',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.6,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
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
  nextButtonFull: {
    flex: 1,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});


