import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import ModalDrawer from '../../components/ModalDrawer';
import Button from '../../components/ui/Button';

interface CustomerRatingDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const CustomerRatingDrawer: React.FC<CustomerRatingDrawerProps> = ({
  isVisible,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStarPress = (selectedRating: number) => {
    if (!isSubmitted) {
      setRating(selectedRating);
    }
  };

  const getRatingText = () => {
    if (isSubmitted) return 'Thank you for your feedback!';
    
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Tap stars to rate';
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Close after showing success message
      setTimeout(() => {
        onClose();
        // Reset state after closing
        setTimeout(() => {
          setIsSubmitted(false);
          setRating(0);
          setFeedback('');
        }, 200);
      }, 600);
    }, 400);
  };

  const isSubmitDisabled = rating === 0 || isSubmitted;

  // Success view
  if (isSubmitted) {
    return (
      <ModalDrawer 
        isVisible={isVisible} 
        onClose={onClose}
        height={400}
      >
        <View style={styles.successContainer}>
          <View style={[styles.successIconContainer, { backgroundColor: colors.lightRed }]}>
            <Ionicons name="checkmark-circle" size={60} color={colors.primary} />
          </View>
          
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Rating Submitted!
          </Text>
          
          <Text style={[styles.successMessage, { color: colors.grey1 }]}>
            Thank you for your feedback. Your rating helps us{'\n'}improve our helmet cleaning service.
          </Text>

          <View style={styles.submittedRating}>
            <View style={styles.submittedStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={24}
                  color={star <= rating ? colors.primary : colors.grey2}
                  style={styles.submittedStar}
                />
              ))}
            </View>
            <Text style={[styles.submittedRatingText, { color: colors.grey1 }]}>
              Your Rating: {rating} star{rating !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </ModalDrawer>
    );
  }

  return (
    <ModalDrawer 
      isVisible={isVisible} 
      onClose={onClose}
      height={650}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.content}>
          {/* Header */}
          <Text style={[styles.title, { color: colors.text }]}>Rate our Service</Text>
          <Text style={[styles.subtitle, { color: colors.grey1 }]}>
            Your feedback helps us provide better service
          </Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
                style={styles.starButton}
                activeOpacity={0.7}
                disabled={isSubmitted}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? colors.primary : colors.grey2}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.ratingText, { color: colors.grey1 }]}>
            {getRatingText()}
          </Text>

          {/* Feedback Input */}
          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackLabel, { color: colors.text }]}>
              Tell us more about your experience (optional)
            </Text>
            <TextInput
              style={[
                styles.feedbackInput,
                {
                  borderColor: colors.grey2,
                  color: colors.text,
                  backgroundColor: colors.background,
                }
              ]}
              placeholder={rating > 0 
                ? "Great Cleaning Experience" 
                : "Share your thoughts about our waterless helmet cleaning service..."
              }
              placeholderTextColor={colors.grey1}
              multiline
              numberOfLines={4}
              value={feedback}
              onChangeText={setFeedback}
              textAlignVertical="top"
              editable={!isSubmitted}
            />
          </View>

          {/* Service Stats */}
          <View style={styles.statsContainer}>
            <Text style={[styles.statsTitle, { color: colors.grey1 }]}>
              Our Service Stats
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>4.8</Text>
                <Text style={[styles.statLabel, { color: colors.primary }]}>Average</Text>
                <Text style={[styles.statLabel, { color: colors.primary }]}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>1200+</Text>
                <Text style={[styles.statLabel, { color: colors.primary }]}>Happy</Text>
                <Text style={[styles.statLabel, { color: colors.primary }]}>Customers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>99%</Text>
                <Text style={[styles.statLabel, { color: colors.primary }]}>Satisfaction</Text>
                <Text style={[styles.statLabel, { color: colors.primary }]}>Rate</Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            title={isSubmitting ? "Submitting..." : "Continue"}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            loading={isSubmitting}
            style={[
              styles.submitButton,
              {
                backgroundColor: isSubmitDisabled ? colors.grey2 : colors.primary,
              }
            ]}
          />
        </View>
      </ScrollView>
    </ModalDrawer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  starButton: {
    paddingHorizontal: 4,
  },
  ratingText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  feedbackContainer: {
    marginBottom: 32,
  },
  feedbackLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 12,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontFamily: Fonts.regular,
    fontSize: 14,
    minHeight: 100,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsTitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 20,
  },
  
  // Success styles
  successContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  submittedRating: {
    alignItems: 'center',
    paddingBottom: 80,
  },    
  submittedStars: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  submittedStar: {
    marginHorizontal: 2,
  },
  submittedRatingText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});

export default CustomerRatingDrawer;