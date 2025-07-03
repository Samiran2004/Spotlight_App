import { Ionicons } from '@expo/vector-icons';
import { Alert, FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { userAuthStore } from '../../store/authStore';
import { styles } from '../../styles/profile.styles';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import { Image } from 'expo-image';
import NoPostFound from '../../components/NoPostFound';

export default function Profile() {

  const user = userAuthStore((state) => state.user);
  const token = userAuthStore((state) => state.token);
  const logOut = userAuthStore((state) => state.logOut);
  const update = userAuthStore((state) => state.update);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [name, setName] = useState(user?.fullname || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  // console.log(user);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log("Error: ", error.message);
      Alert.alert("Error", "Logout Error");
    }
  }

  async function fetchUserPostData() {
    try {

      const response = await fetch("http://192.168.1.7:8000/api/post/post_by_user", {
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
        console.log("Error: ", error.message);
        Alert.alert("Error", "Error in converting response.");
      }

      if (!response.ok) {
        console.log("Error: ", response.status);
      }

      // console.log(data.data);
      setPosts(Array.isArray(data.data) ? data.data : [])

    } catch (error) {
      console.log("Error: ", error.message);
      Alert.alert("Error", "Error in fetching user's post data.");
    }
  }

  useEffect(() => {
    setName(user?.fullname || "");
    setBio(user?.bio || "");

    fetchUserPostData();

  }, [user]);

  const handleSaveProfileInfo = async () => {
    try {
      const { token } = userAuthStore.getState();

      const response = await fetch("http://192.168.1.7:8000/api/auth/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          bio
        })
      })

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Invalid JSON response:", text);
        throw new Error("Server did not return valid JSON.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // console.log(data);
      update(data.user);
      setName(data.user.fullname);
      setBio(data.user.bio);
      setIsEditModalVisible(false);
    } catch (error) {
      console.log("Error in save user info: ", error.message);
      Alert.alert("Error: ", "Error in save user changes.");
    }
  }


  // if (!user || !token) {
  //   return (
  //     <Loader />
  //   )
  // }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{name}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={handleLogout}>
            <Ionicons name='log-out-outline' size={25} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>

          {/* Avatar */}
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={user?.profileImage}
                style={styles.avatar}
                contentFit='cover'
                transition={200}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.posts}</Text>
                <Text style={{ color: COLORS.gray }}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.followers}</Text>
                <Text style={{ color: COLORS.gray }}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.following}</Text>
                <Text style={{ color: COLORS.gray }}>Following</Text>
              </View>
            </View>

          </View>

          <Text style={styles.name}>{user?.fullname}</Text>
          {user?.bio && <Text style={styles.bio}>{user?.bio}</Text>}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name='share-outline' size={20} color={COLORS.white} />
            </TouchableOpacity>

          </View>
        </View>

        {user.posts === 0 && <NoPostFound />}

        <FlatList
          data={posts}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
              <Image
                source={item.imageUrl}
                style={styles.gridImage}
                contentFit='cover'
                transition={200}
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* Edit profile dets modal */}
      <Modal
        visible={isEditModalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "height" : "padding"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}> Edit Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name='close' size={25} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* Input sections */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholderTextColor={COLORS.gray}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={styles.input}
                  value={bio}
                  onChangeText={(text) => setBio(text)}
                  placeholderTextColor={COLORS.gray}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfileInfo}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>

          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

      </Modal>

      {/* View selected image modal */}
      <Modal
        visible={!!selectedPost}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalBackdrop}>
          {
            selectedPost && (
              <View style={styles.postDetailContainer}>
                <View style={styles.postDetailHeader}>
                  <TouchableOpacity onPress={() => setSelectedPost(null)}>
                    <Ionicons name='close' size={25} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <Image
                  source={selectedPost.imageUrl}
                  cachePolicy={"memory-disk"}
                  style={styles.postDetailImage}
                />
              </View>
            )
          }
        </View>

      </Modal>
    </View>
  )
}