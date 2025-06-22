import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Image, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../../styles/create.styles';
import { useRouter } from 'expo-router';
import { userAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';

export default function Create() {

  const router = useRouter();

  const { token, user } = userAuthStore();

  const [caption, setCaption] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }

    // if base64 is provided, use it
    if (result.assets[0].base64) {
      setImageBase64(result.assets[0].base64);
    } else {
      // Convert to base64
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      setImageBase64(base64);
    }
  }

  const submit = async () => {
    try {

      setIsSharing(true);
      if (!imageBase64) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const uriParts = selectedImage.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch("http://192.168.1.7:8000/api/post/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: imageDataUrl,
          caption: caption
        })
      });

      const text = await response.text();
      // console.log("Raw Response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return JSON: " + text);
      }


      if (!response.ok) {
        throw new Error(data.message || "Something Went Wrong");
      }

      setCaption("");
      setImageBase64(null);
      setSelectedImage(null)
      setIsSharing(false);

      router.replace('/(tabs)');

    } catch (error) {
      console.log("Error: ", error.message);
      Alert.alert("Error", "Error in upload post");
      return;
    } finally {
      setIsSharing(false);
    }
  }

  // console.log(selectedImage);

  if (!selectedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name='arrow-back' size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 30 }}></View>
        </View>
        <TouchableOpacity style={styles.emptyImageContainer} onPress={pickImage}>
          <Ionicons name='image-outline' size={50} color={COLORS.gray} />
          <Text style={{ color: "#fff" }}>Tap to select an image</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "height" : "padding"}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 20}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            setSelectedImage(null);
            setCaption("");
          }} disabled={isSharing}>
            <Ionicons name='close-outline' size={30} color={isSharing ? COLORS.gray : COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            onPress={submit}
            style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
            disabled={isSharing || !selectedImage}
          >
            {
              isSharing ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.shareText}>Share</Text>
              )
            }
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>

            {/* Image Section */}
            <View style={styles.imageSection}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} contentFit="cover" transition={200} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <Ionicons name='image-outline' size={20} color={COLORS.white} />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.captionContainer}>
              <Image source={{ uri: user.profileImage }}
                style={styles.userAvatar}
                contentFit="cover"
                transition={200}
              />

              <TextInput
                style={styles.captionInput}
                placeholder='Write a caption'
                placeholderTextColor="#fff"
                multiline
                value={caption}
                onChangeText={setCaption}
                editable={!isSharing}
              />
            </View>

          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}