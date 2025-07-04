import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
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

            console.log(data.data.user);

            setUserData(data.data);

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

    const handleBack = () => { };

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

                    <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
                        <Text style={[styles.followButtonText, isFollow && styles.followButtonText]}>
                            {
                                isFollow ? "Following" : "Follow"
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}