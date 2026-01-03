import LoadingOverlay from '@/components/LoadingOverlay';
import { useColorScheme } from '@/components/useColorScheme';
import VoiceRecorder from '@/components/VoiceRecorder';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { createAndAnalyzeDream } from '@/lib/database';
import { getErrorMessage, logError } from '@/lib/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NewDreamScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, loading } = useAuth();

  // All useState hooks must be declared before any conditional returns
  const [content, setContent] = useState('');
  const [dreamDate, setDreamDate] = useState(new Date());
  const [isLucid, setIsLucid] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  // Auth is handled at root layout level - show loading if not authenticated
  // The root layout will redirect unauthenticated users
  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const handleSave = async () => {
    if (content.trim().length === 0) {
      Alert.alert('Empty Dream', 'Please enter your dream description.');
      return;
    }

    if (content.trim().length < 10) {
      Alert.alert(
        'Too Short',
        'Please provide at least 10 characters to get meaningful insights.'
      );
      return;
    }

    try {
      setIsSaving(true);

      const dream = await createAndAnalyzeDream({
        content: content.trim(),
        dream_date: dreamDate.toISOString().split('T')[0],
        is_lucid: isLucid,
      });

      // Navigate to the dream detail screen
      router.replace(`/dream/${dream.id}`);
    } catch (error) {
      logError(error, 'Creating dream');
      Alert.alert(
        'Error',
        getErrorMessage(error) || 'Failed to save your dream. Please try again.'
      );
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (content.trim().length > 0) {
      Alert.alert(
        'Discard Dream?',
        'Your dream will not be saved.',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ],
        { cancelable: true }
      );
    } else {
      router.back();
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDreamDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleTranscription = (text: string) => {
    if (content.trim().length > 0) {
      // Append to existing content
      setContent(content + '\n\n' + text);
    } else {
      setContent(text);
    }
    setShowVoiceRecorder(false);
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Ionicons name="information-circle" size={20} color="#8B5CF6" />
          <Text style={[styles.instructionsText, { color: colors.text }]}>
            Describe your dream in detail. Our AI will analyze it and provide
            insights.
          </Text>
        </View>

        {/* Dream Content Input */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.text }]}>
              Dream Description *
            </Text>
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={() => setShowVoiceRecorder(!showVoiceRecorder)}
            >
              <Ionicons
                name={showVoiceRecorder ? 'close-circle' : 'mic-circle'}
                size={28}
                color="#8B5CF6"
              />
            </TouchableOpacity>
          </View>

          {showVoiceRecorder && (
            <View style={styles.voiceRecorderContainer}>
              <VoiceRecorder onTranscriptionComplete={handleTranscription} />
            </View>
          )}

          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.text,
                backgroundColor:
                  colorScheme === 'dark' ? '#1F2937' : '#F9FAFB',
                borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              },
            ]}
            placeholder="I was flying over the ocean..."
            placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#9CA3AF'}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
            maxLength={5000}
          />
          <Text style={[styles.charCount, { color: colors.text }]}>
            {content.length} / 5000
          </Text>
        </View>

        {/* Dream Date */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Dream Date</Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor:
                  colorScheme === 'dark' ? '#1F2937' : '#F9FAFB',
                borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons
              name="calendar"
              size={20}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <Text style={[styles.dateButtonText, { color: colors.text }]}>
              {formatDate(dreamDate)}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dreamDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Lucid Dream Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Text style={[styles.label, { color: colors.text, marginBottom: 0 }]}>
                Lucid Dream
              </Text>
              <Text
                style={[styles.toggleDescription, { color: colors.text }]}
              >
                Were you aware you were dreaming?
              </Text>
            </View>
            <Switch
              value={isLucid}
              onValueChange={setIsLucid}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={isLucid ? '#8B5CF6' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              { borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' },
            ]}
            onPress={handleCancel}
          >
            <Text
              style={[styles.cancelButtonText, { color: colors.text }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Analyze Dream</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LoadingOverlay
        visible={isSaving}
        message="Analyzing your subconscious..."
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  instructionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDE9FE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  instructionsText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#5B21B6',
  },
  section: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  voiceButton: {
    padding: 4,
  },
  voiceRecorderContainer: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  textInput: {
    minHeight: 150,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLeft: {
    flex: 1,
  },
  toggleDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

