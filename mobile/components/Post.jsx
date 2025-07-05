import { Image } from 'expo-image';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/feed.styles';
import { Link, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useState } from 'react';
import { userAuthStore } from '../store/authStore';
import CommentsModal from './CommentsModal';

export default function Post({ post }) {

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [totalLikes, setTotalLikes] = useState(post.likes);
  const [totalComments, setTotalComments] = useState(post.comments || 0);
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookMarked || false);
  // console.log(totalLikes);
  // console.log(totalComments);

  const { token, user } = userAuthStore();

  const handleLike = async () => {
    try {
      // console.log("Like function called for user: .", token);

      const response = await fetch("http://192.168.1.7:8000/api/post/like", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId: post._id
        })
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return JSON: " + text);
      }

      // console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Something Went Wrong");
      }

      setIsLiked(data.isLiked);
      setTotalLikes(prev => data.isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.log("Error in like: ", error.message);
      Alert.alert("Error: ", "Error in like.");
    }
  }

  const handleBookMark = async () => {
    try {

      const response = await fetch("http://192.168.1.7:8000/api/post/toggle-bookmark", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId: post._id
        })
      })

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

      // console.log(data.isBookmarked);

      setIsBookmarked(data.isBookmarked);

    } catch (error) {
      console.log("Error in bookmark: ", error.message);
      Alert.alert("Error: ", "Error in bookmark.");
    }
  }

  const handleDeletePost = async () => {
    try {
      const response = await fetch("http://192.168.1.7:8000/api/post/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId: post._id
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

      Alert.alert("Success", "Post deleted successfully.");
    } catch (error) {
      console.log("Error in delete post:", error.message);
      Alert.alert("Error", error.message || "Error in delete post.");
    }
  };


  // console.log(post.likes);

  return (
    <View style={styles.post}>
      {/* Post Header  */}
      <View style={styles.postHeader}>
        <Link href={
          user?._id === post?.userId._id ? "/(tabs)/profile" : `user/${post.userId._id}`
        } asChild>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.userId.profileImage}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.userId.fullname}</Text>
          </TouchableOpacity>
        </Link>

        {/* Show Delete button */}
        {user && user._id === post.userId._id ? (
          <TouchableOpacity onPress={handleDeletePost}>
            <Ionicons name='trash-outline' size={25} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View />
        )}

      </View>

      {/* Image */}
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        cachePolicy="memory-disk"
      />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={30} color={isLiked ? COLORS.primary : COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons name='chatbubble-outline' size={30} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleBookMark}>
            {
              isBookmarked ? (
                <Ionicons name='bookmark' size={30} color={COLORS.primary} />
              ) : (
                <Ionicons name='bookmark-outline' size={30} color={COLORS.white} />
              )
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Info */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>{totalLikes > 0 ? `${totalLikes.toString()} likes` : "Be the first to like"}</Text>
        {
          post.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionUsername}>{post.userId.fullname}</Text>
              <Text style={styles.captionText}>{post.caption}</Text>
            </View>
          )
        }

        <TouchableOpacity onPress={() => setShowComments(true)}>
          <Text style={styles.commentText}>
            {totalComments > 0
              ? `View all ${totalComments} comments`
              : "No comments yet"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.timeAgo}>2 hours ago</Text>
      </View>

      <CommentsModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setTotalComments((prev) => prev + 1)}
      />

    </View>
  );
}