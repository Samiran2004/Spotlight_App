import { View, Text, Modal, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '../styles/feed.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import Loader from '../components/Loader';
import Comment from './Comment';
import { userAuthStore } from '../store/authStore';

export default function CommentsModal({ postId, visible, onClose, onCommentAdded }) {

  const { token } = userAuthStore();

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  // console.log(comments);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`http://192.168.1.7:8000/api/post/comment?postId=${postId}`, {
          method: "GET",
        });
        const text = await response.text()
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON response:", text);
          throw new Error("Server did not return valid JSON.");
        }

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        // console.log(data);

        setComments(data.data);


      } catch (error) {
        console.log("Error in get all comments ", error.message);
        Alert.alert("Error", "Error in get all comments");
      }
    }
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    try {
      const response = await fetch("http://192.168.1.7:8000/api/post/comment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId: postId,
          content: newComment
        })
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON response:", text);
        throw new Error("Server did not return valid JSON.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setComments((prev) => [...prev, data.comment]);
      onCommentAdded();
      setNewComment("");
      console.log(data);
    } catch (error) {
      console.log("Error in post comment ", error.message);
      Alert.alert("Error", "Error in post comment.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView

        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name='close' size={25} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }}></View>
        </View>

        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            renderItem={({ item }) => <Comment comment={item} />}
          />
        )}

        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder='Add a comment...'
            value={newComment}
            placeholderTextColor={COLORS.gray}
            onChangeText={setNewComment}
            multiline
          />

          <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
            <Text style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </Modal>
  )
}