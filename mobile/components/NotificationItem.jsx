import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../styles/notifications.styles'
import { Link } from 'expo-router'
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function NotificationItem({ notification }) {
    return (
        <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>

                <Link href={`/user/${notification.senderId._id}`} asChild>
                    <TouchableOpacity>
                        <Image
                            source={notification.senderId.profileImage}
                            style={styles.avatar}
                            contentFit='cover'
                            transition={200}
                        />

                        <View>
                            {
                                notification.typeOfNotification === "like" ? (
                                    <Ionicons name='heart' size={15} color={COLORS.primary} />
                                ) : notification.typeOfNotification === "follow" ? (
                                    <Ionicons name='person-add' size={15} color="#885CF6" />
                                ) : (
                                    <Ionicons name='chatbubble' size={15} color="#3882F6" />
                                )
                            }
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}