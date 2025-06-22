import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { userAuthStore } from '../../store/authStore';

export default function Index() {

  const { logOut } = userAuthStore();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      Alert.alert("Error", "Logout Error");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello </Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}