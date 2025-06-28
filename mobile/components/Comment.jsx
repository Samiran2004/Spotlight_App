import { View, Text } from 'react-native';
import React from 'react';
import { styles } from '../styles/feed.styles';
import { Image } from 'expo-image';
import { formatDistanceToNow } from "date-fns";

export default function Comment({ comment }) {
    return (
        <View style={styles.commentContainer}>
            <Image
                source={{ uri: comment.userId.profileImage }}
                style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>
                    {comment.userId.fullname}
                </Text>
                <Text style={styles.commentText}>
                    {comment.content}
                </Text>
                <Text style={styles.commentTime}>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Text>
            </View>
        </View>
    );
}