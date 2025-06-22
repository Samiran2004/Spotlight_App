import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../../styles/auth.styles';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { userAuthStore } from '../../store/authStore';

export default function Signup() {
    const router = useRouter();

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { user, isLoaded, register } = userAuthStore();

    const handleSignup = async () => {
        try {
            if (!fullname || !email || !password) {
                alert('Please fill in all fields');
                return;
            }

            // TODO: Replace with real API call
            // console.log({ fullname, email, password });

            const response = await register(fullname, email, password);

            if (!response.success) {
                Alert.alert("Error", response.error);
            }


            // Redirect to login after successful signup
            router.replace('/(auth)');
        } catch (error) {
            console.log("Signup error:", error);
        }
    };

    return (
        <KeyboardAvoidingView style={{
            flex: 1
        }} behavior={Platform.OS === "android" ? "padding" : "height"}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Ionicons name="leaf" size={42} color={COLORS.primary} />
                </View>
                <Text style={styles.appName}>Create Account</Text>

                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        resizeMode="contain"
                        style={styles.illustration}
                    />
                </View>

                <View style={styles.loginSection}>
                    <TextInput
                        placeholder="Full Name"
                        placeholderTextColor="#ccc"
                        value={fullname}
                        onChangeText={setFullname}
                        style={styles.input}
                    />
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
                        secureTextEntry
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        {
                            isLoaded ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.buttonText}>Sign Up</Text>
                        }
                    </TouchableOpacity>

                    <Text style={styles.helperText}>
                        Already have an account?{" "}
                        <Text style={styles.linkText} onPress={() => router.push('/')}>
                            Log In
                        </Text>
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
