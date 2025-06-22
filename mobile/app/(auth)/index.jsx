import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/auth.styles';
import { COLORS } from '../../constants/theme';
import { userAuthStore } from '../../store/authStore';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { token, user, isLoaded, login } = userAuthStore();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert('Please fill in both fields');
        return;
      }

      // TODO: Add real login API call
      // console.log({ email, password });

      const response = await login(email, password);

      if (!response.success) {
        Alert.alert("Error", response.error);
      }

      // router.replace('/(tabs)');
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : "height"}>
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={42} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>SpotLight</Text>
          <Text style={styles.tagline}>don’t miss anything</Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"
            style={styles.illustration}
          />
        </View>

        {/* Form Section */}
        <View style={styles.loginSection}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={false}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {
              isLoaded ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Login</Text>
            }
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Don’t have an account?{" "}
            <Text style={styles.linkText} onPress={() => router.push('/signup')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}