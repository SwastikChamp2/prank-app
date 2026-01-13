import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import ModalDrawer from '../../components/ModalDrawer';
import Button from '../../components/ui/Button';

interface DeleteAccountDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountDrawer: React.FC<DeleteAccountDrawerProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ModalDrawer 
      isVisible={isVisible} 
      onClose={onClose}
      height={460}
    >
      <View style={styles.container}>
        {/* Icon positioned to peek out of drawer */}
        <View style={styles.iconSection}>
          <View style={[styles.iconContainer, { backgroundColor: colors.lightRed }]}>
            <Ionicons name="trash-outline" size={32} color={colors.primary} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>Delete Account?</Text>

          {/* Message */}
          <Text style={[styles.message, { color: colors.grey1 }]}>
            This action cannot be undone. All your data{'\n'}including order history, preferences, and account{'\n'}information will be permanently deleted.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <Button
              title="Yes, Delete Account"
              onPress={onConfirm}
              style={[styles.confirmButton, { backgroundColor: colors.primary }]}
            />
            <TouchableOpacity 
              onPress={onClose}
              style={styles.cancelButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: colors.grey1 }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ModalDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconSection: {
    alignItems: 'center',
    position: 'absolute',
    top: -80,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    marginBottom: 16,
    marginTop: 20,
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  buttonsContainer: {
    width: '100%',
  },
  confirmButton: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});

export default DeleteAccountDrawer;