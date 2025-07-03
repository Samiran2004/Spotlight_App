import { Ionicons } from '@expo/vector-icons';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/notifications.styles';

dayjs.extend(relativeTime);


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

                <View style={styles.notificationInfo}>

                    <Link href={'/notifications'} asChild>
                        <TouchableOpacity>
                            <Text style={styles.username}>{notification.senderId.fullname}</Text>
                        </TouchableOpacity>
                    </Link>

                    <Text style={{ color: "gray" }}>
                        {notification.typeOfNotification === "follow" && "Started following you."}
                        {notification.typeOfNotification === "like" && "Liked your post."}
                        {notification.typeOfNotification === "comment" && (
                            `Commented: "${notification.commentId?.content || ""}"`
                        )}
                    </Text>

                    <Text style={{ color: "gray" }}>
                        {
                            dayjs(notification.createdAt).fromNow()
                        }
                    </Text>

                </View>
            </View>

            {
                notification.postId && (
                    <Image
                        source={notification.postId.imageUrl}
                        style={styles.postImage}
                        contentFit='cover'
                        transition={200}
                    />
                )
            }
        </View>
    )
}