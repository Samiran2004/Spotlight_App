import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { styles } from '../../styles/feed.styles'
import { userAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function Profile() {

  const { logOut, token } = userAuthStore();

  const handleLogout = async () => {
      try {
        await logOut();
      } catch (error) {
        Alert.alert("Error", "Logout Error");
      }
    }

  return (
    <View style={styles.header}>
        <Text style={styles.headerTitle}>SpotLight</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
  )
}