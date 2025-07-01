import { View, Text, Alert, FlatList } from 'react-native'
import React from 'react'
import { useState } from 'react'
import Loader from '../../components/Loader';
import NoNotificationFound from '../../components/NoNotificationFound';
import { userAuthStore } from '../../store/authStore';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { styles } from '../../styles/notifications.styles';
import NotificationItem from '../../components/NotificationItem';

export default function Notification() {

    const [notifications, setNotifications] = useState([]);
    const { token } = userAuthStore();

    const getNotifications = async () => {
        try {

            const response = await fetch(`http://192.168.1.7:8000/api/post/notification`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
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

            // console.log(JSON.parse(data.data));
            console.log(data.data);
            setNotifications(data.data);

        } catch (error) {
            console.log("Error in get notifications: ", error.message);
            Alert.alert("Error", "Error in get notifications");
        }
    }

    useFocusEffect(
        useCallback(() => {
            getNotifications();
        }, [])
    )

    if (notifications === undefined) {
        return <Loader />
    }

    // if (notifications.length === 0) {
    //     return <NoNotificationFound />
    // }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                renderItem={({ item }) => <NotificationItem notification={item} />}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}