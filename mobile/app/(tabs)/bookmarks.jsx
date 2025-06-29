import { View, Text, Alert, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { styles } from '../../styles/feed.styles';
import { userAuthStore } from '../../store/authStore';
import { Image } from 'expo-image';
import Loader from '../../components/Loader';
import NoBookMarkFound from '../../components/NoBookMarkFound';
import { useFocusEffect } from 'expo-router';

export default function Bookmarks() {
  const [bookMarks, setBookMarks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = userAuthStore();

  const getBookMarks = async () => {
    try {
      // setRefreshing(true);
      const response = await fetch(`http://192.168.1.7:8000/api/post/get-bookmarks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return JSON: " + text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Something Went Wrong");
      }

      setBookMarks(data.data);
    } catch (error) {
      console.log("Error in getBookMarks: ", error.message);
      Alert.alert("Error", "Error in getting bookmarks.");
    } finally {
      // setRefreshing(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      getBookMarks();
    }, [])
  )

  if (bookMarks === undefined) {
    return <Loader />;
  }

  if (bookMarks.length === 0) {
    return <NoBookMarkFound />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* FlatList */}
      <FlatList
        data={bookMarks}
        keyExtractor={(item) => item._id}
        numColumns={3}
        refreshing={refreshing}
        onRefresh={getBookMarks}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={{ flex: 1 / 3, padding: 4 }}>
            <Image
              source={{ uri: item.postId.imageUrl }}
              style={{ width: "100%", aspectRatio: 1 }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </View>
        )}
      />
    </View>
  );
}
