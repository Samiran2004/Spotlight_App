import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { userAuthStore } from '../store/authStore';

export default function RootLayout() {

  const segment = useSegments();
  const router = useRouter();

  // const token = userAuthStore((state) => state.token);
  // const user = userAuthStore((state) => state.user);
  // const checkAuth = userAuthStore((state) => state.checkAuth);
  const { token, user, checkAuth } = userAuthStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsReady(true);
    };
    init();
  }, []);

  // useEffect(() => {
  //   console.log("Token:", token);
  //   console.log("User:", user);
  //   console.log("Segment:", segment);
  // }, [token, user, segment]);



  useEffect(() => {
    if (!isReady) return;

    const isInAuthGroup = segment[0] === "(auth)";
    const isLoggedIn = token && user;

    if (!isLoggedIn && !isInAuthGroup) {
      router.replace("/(auth)");
    }

    if (isLoggedIn && isInAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [token, user, isReady, segment]);


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}