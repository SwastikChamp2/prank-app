import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import ProfileMenuItem from '../components/ProfileMenuItem';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AppInfoDrawer from './Profile/AppInfoDrawer';
import CustomerRatingDrawer from './Profile/CustomerRatingDrawer';
import LogoutDrawer from './Profile/LogoutDrawer';
import DeleteAccountDrawer from './Profile/DeleteAccountDrawer';

const Profile: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [myProfileToggle, setMyProfileToggle] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Drawer states
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [showCustomerRating, setShowCustomerRating] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  
  // Form data
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [phoneNumber, setPhoneNumber] = useState('9999999999');

  const handleBack = () => {
    router.back();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert changes
      setFirstName('John');
      setLastName('Doe');
      setPhoneNumber('9999999999');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    }, 200);
  };

  const handleProfileImagePress = () => {
    if (!isEditing) return;
    
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleTransactions = () => {
    router.push('/transactions');
  };

  const handleReferEarn = () => {
    router.push('/refer-earn');
  };

  const handleAppInfo = () => {
    setShowAppInfo(true);
  };

  const handleCustomerRating = () => {
    setShowCustomerRating(true);
  };

  const handleLegal = () => {
    router.push('/legal');
  };

  const handleTermsConditions = () => {
    router.push('/terms-conditions');
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccount(true);
  };

  const handleLogout = () => {
    setShowLogout(true);
  };

  const confirmLogout = () => {
    setShowLogout(false);
    router.replace('/');
  };

  const confirmDeleteAccount = () => {
    setShowDeleteAccount(false);
    console.log('Account deleted');
    // Handle account deletion logic here
    // You might want to navigate to login or show success message
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {isEditing ? (
          // Edit Mode
          <View style={styles.editProfileSection}>
            {/* Profile Image */}
            <View style={styles.editImageSection}>
              <TouchableOpacity onPress={handleProfileImagePress}>
                <View style={styles.editImageContainer}>
                  <Image
                    source={require('../assets/images/profile.jpg')}
                    style={styles.editProfileImage}
                    resizeMode="cover"
                  />
                  <View style={[styles.editImageOverlay, { backgroundColor: colors.primary }]}>
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Edit Form */}
            <View style={styles.editFormSection}>
              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    First Name
                  </Text>
                  <Input
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                    style={styles.input}
                  />
                </View>
                
                <View style={styles.nameInput}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    Last Name
                  </Text>
                  <Input
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.phoneSection}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Phone Number
                </Text>
                <Input
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                  placeholder="Enter phone number"
                  keyboardType="numeric"
                  leftIcon="call-outline"
                  maxLength={10}
                  style={styles.phoneInput}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.editButtonsContainer}>
                <Button
                  title="Cancel"
                  onPress={handleEditToggle}
                  variant="outline"
                  size="medium"
                  style={[styles.cancelButton, { borderColor: colors.grey1 }]}
                  textStyle={{ color: colors.grey1 }}
                />
                <Button
                  title="Save"
                  onPress={handleSave}
                  loading={loading}
                  size="medium"
                  style={[styles.saveButton, { backgroundColor: colors.primary }]}
                />
              </View>
            </View>

            {/* Menu Items also show in edit mode but below form */}
            <View style={styles.menuSection}>
              <ProfileMenuItem
                icon="person-circle-outline"
                title="Dark Mode"
                showArrow={false}
                showToggle={true}
                toggleValue={myProfileToggle}
                onToggleChange={setMyProfileToggle}
              />

              <ProfileMenuItem
                icon="card-outline"
                title="Transactions"
                onPress={handleTransactions}
              />

              <ProfileMenuItem
                icon="gift-outline"
                title="Refer & Earn"
                onPress={handleReferEarn}
              />

              <ProfileMenuItem
                icon="information-circle-outline"
                title="App Info"
                onPress={handleAppInfo}
              />

              <ProfileMenuItem
                icon="star-outline"
                title="Customer Rating"
                onPress={handleCustomerRating}
              />

              <ProfileMenuItem
                icon="scale-outline"
                title="Legal"
                onPress={handleLegal}
              />

              <ProfileMenuItem
                icon="document-text-outline"
                title="Terms & Conditions"
                onPress={handleTermsConditions}
              />
            </View>

            {/* Danger Zone in edit mode */}
            <View style={styles.dangerSection}>
              <ProfileMenuItem
                icon="trash-outline"
                title="Delete Account"
                onPress={handleDeleteAccount}
                showArrow={false}
                isDangerous={true}
              />

              <ProfileMenuItem
                icon="log-out-outline"
                title="Logout"
                onPress={handleLogout}
                showArrow={false}
                isDangerous={true}
              />
            </View>
          </View>
        ) : (
          // View Mode - Always render this when not editing
          <>
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={require('../assets/images/profile.jpg')}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {firstName} {lastName}
                </Text>
                <Text style={[styles.profilePhone, { color: colors.grey1 }]}>
                  +91 {phoneNumber}
                </Text>
              </View>
              
              <TouchableOpacity onPress={handleEditToggle} style={styles.editButton}>
                <Ionicons name="pencil" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Menu Items - View Mode */}
            <View style={styles.menuSection}>
              <ProfileMenuItem
                icon="person-circle-outline"
                title="Dark Mode"
                showArrow={false}
                showToggle={true}
                toggleValue={myProfileToggle}
                onToggleChange={setMyProfileToggle}
              />

              <ProfileMenuItem
                icon="card-outline"
                title="Transactions"
                onPress={handleTransactions}
              />

              <ProfileMenuItem
                icon="gift-outline"
                title="Refer & Earn"
                onPress={handleReferEarn}
              />

              <ProfileMenuItem
                icon="information-circle-outline"
                title="App Info"
                onPress={handleAppInfo}
              />

              <ProfileMenuItem
                icon="star-outline"
                title="Customer Rating"
                onPress={handleCustomerRating}
              />

              <ProfileMenuItem
                icon="scale-outline"
                title="Legal"
                onPress={handleLegal}
              />

              <ProfileMenuItem
                icon="document-text-outline"
                title="Terms & Conditions"
                onPress={handleTermsConditions}
              />
            </View>

            {/* Danger Zone - View Mode */}
            <View style={styles.dangerSection}>
              <ProfileMenuItem
                icon="trash-outline"
                title="Delete Account"
                onPress={handleDeleteAccount}
                showArrow={false}
                isDangerous={true}
              />

              <ProfileMenuItem
                icon="log-out-outline"
                title="Logout"
                onPress={handleLogout}
                showArrow={false}
                isDangerous={true}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* All Drawer Components */}
      <AppInfoDrawer
        isVisible={showAppInfo}
        onClose={() => setShowAppInfo(false)}
      />

      <CustomerRatingDrawer
        isVisible={showCustomerRating}
        onClose={() => setShowCustomerRating(false)}
      />

      <LogoutDrawer
        isVisible={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={confirmLogout}
      />

      <DeleteAccountDrawer
        isVisible={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={confirmDeleteAccount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 32,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // View Mode Styles
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  profilePhone: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  editButton: {
    padding: 8,
  },
  
  // Edit Mode Styles
  editProfileSection: {
    flex: 1,
  },
  editImageSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  editImageContainer: {
    position: 'relative',
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editFormSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  nameInput: {
    flex: 1,
  },
  input: {
    marginBottom: 0,
  },
  phoneSection: {
    marginBottom: 32,
  },
  phoneInput: {
    marginBottom: 0,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
  },
  
  // Menu Styles
  menuSection: {
    marginBottom: 32,
  },
  dangerSection: {
    marginBottom: 20,
  },
});

export default Profile;