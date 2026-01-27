import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('Index page - Auth state:', { isAuthenticated, loading, userId: user?.uid });

    if (!loading) {
      if (isAuthenticated) {
        console.log('User is authenticated, navigating to home');
        router.replace('/home');
      } else {
        console.log('User is not authenticated, navigating to get-started');
        router.replace('/get-started');
      }
    }
  }, [isAuthenticated, loading]);

  // Show loading indicator while checking auth state
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#E8764B" />
      <Text style={{ marginTop: 20, color: '#666' }}>
        {loading ? 'Checking authentication...' : 'Redirecting...'}
      </Text>
    </View>
  );
}