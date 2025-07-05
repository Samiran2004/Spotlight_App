import { View, Text, Alert, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { userAuthStore } from '../../store/authStore';
import { styles } from '../../styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Image } from 'expo-image';

export default function UserProfileScreen() {

    const token = userAuthStore(state => state.token);

    const { id } = useLocalSearchParams();

    const [userData, setUserData] = useState();
    const [isFollow, setIsFollow] = useState(false);
    const [posts, setPosts] = useState([]);
    // console.log(posts);
    const rouetr = useRouter();

    const getUserProfile = async () => {
        try {

            const response = await fetch(`http://192.168.1.7:8000/api/post/post_by_userId/${id}`, {
                method: "GET"
            });

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch (err) {
                console.log("Error: ", err.message);
            }

            if (!response.ok) {
                console.log("Error in response.");
            }

            // console.log(data.data.posts);

            setUserData(data?.data);
            setPosts(Array.isArray(data?.data?.posts) ? data.data.posts : []);

        } catch (error) {
            console.log("Error: ", error.message);
            Alert.alert("Error", "Error in get user profile");
        }
    }

    const checkFollow = async () => {
        try {

            const response = await fetch(`http://192.168.1.7:8000/api/post/is_follow/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.log("Error: ", error.message);
            }

            if (!response.ok) {
                console.log("Error in check is follow");
            }

            // console.log(data);

            setIsFollow(data.isFollow);

        } catch (error) {
            console.log("Error: ", error.message);
        }
    }

    const toggleFollow = async () => {
        try {

            const response = await fetch(`http://192.168.1.7:8000/api/post/toggle_follow`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    followingId: id
                })

            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.log("Error: ", error.message);
            }

            console.log(data);
            setIsFollow(!isFollow);

        } catch (error) {
            console.log("Error: ", error.message);
        }
    }

    const handleBack = () => {
        if (rouetr.canGoBack()) rouetr.back();
        else rouetr.replace("/(tabs)");
    };

    useEffect(() => {
        getUserProfile();
        checkFollow();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name='arrow-back' size={25} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {userData ? userData.user?.fullname : ""}
                </Text>
                <View style={{ width: 25 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarAndStats}>
                        {/* Avatar */}
                        <Image
                            source={userData?.user?.profileImage}
                            style={styles.avatar}
                            contentFit='cover'
                            cachePolicy="memory-disk"
                        />

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData?.user?.posts}</Text>
                                <Text style={{ color: COLORS.gray }}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData?.user?.followers}</Text>
                                <Text style={{ color: COLORS.gray }}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData?.user?.following}</Text>
                                <Text style={{ color: COLORS.gray }}>Following</Text>
                            </View>
                        </View>
                    </View>
                    {
                        userData?.user?.bio && <Text style={styles.bio}>{userData?.user?.bio}</Text>
                    }

                    <TouchableOpacity style={[styles.followButton, isFollow && styles.followingButton]} onPress={toggleFollow}>
                        <Text style={[styles.followButtonText, isFollow && styles.followingButtonText]}>
                            {
                                isFollow ? "Following" : "Follow"
                            }
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.postsGrid}>
                    {
                        posts.length === 0 ? (
                            <View style={styles.noPostsContainer}>
                                <Ionicons name='image-outline' size={50} color={COLORS.gray} />
                                <Text style={styles.noPostsText}>No Posts Yet</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={posts}
                                numColumns={3}
                                scrollEnabled={false}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.gridItem}>
                                        <Image
                                            source={item.imageUrl}
                                            style={{ width: '100%', height: 120 }}
                                            contentFit='cover'
                                            transition={200}
                                            cachePolicy='memory-disk'
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}