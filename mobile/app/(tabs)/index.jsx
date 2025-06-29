import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { userAuthStore } from '../../store/authStore';
import { styles } from '../../styles/feed.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import Post from '../../components/Post';

export default function Index() {

  const { logOut, token } = userAuthStore();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://192.168.1.7:8000/api/post/get-all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid JSON response:", text);
        throw new Error("Server did not return valid JSON.");
      }
      // console.log("Fetched post data:", data);

      setPosts(Array.isArray(data.data) ? data.data : []);
      setIsLoading(false);
    } catch (error) {
      console.log("Error: ", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      Alert.alert("Error", "Logout Error");
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (posts.length === 0) {
    return (
      <View style={{ backgroundColor: "black", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: COLORS.primary, fontSize: 20 }}>No Post Found</Text>
        <Ionicons name='information-circle-outline' size={30} color="red" />
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Header  */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SpotLight</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* <ScrollView
        // horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {
          posts.map((post) => (
            <Post key={post._id} post={post} />
          ))
        }
      </ScrollView> */}

      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={fetchPosts}
      />
    </View>
  );
}