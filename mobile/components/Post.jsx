import { Image } from 'expo-image';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/feed.styles';
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function Post({ post }) {
  return (
    <View style={styles.post}>
      {/* Post Header  */}
      <View style={styles.postHeader}>
        <Link href={"/(tabs)/notifications"}>
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
        <TouchableOpacity>
          <Ionicons name='trash-outline' size={25} color={COLORS.white} />
        </TouchableOpacity>
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
          <TouchableOpacity>
            <Ionicons name='heart-outline' size={30} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='chatbubble-outline' size={30} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity>
            <Ionicons name='bookmark-outline' size={30} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Info */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>Be the first to like</Text>
        {
          post.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionUsername}>{post.userId.fullname}</Text>
              <Text style={styles.captionText}>{post.caption}</Text>
            </View>
          )
        }

        <TouchableOpacity>
          <Text style={styles.commentText}>View all 2 comments</Text>
        </TouchableOpacity>

        <Text style={styles.timeAgo}>2 hours ago</Text>
      </View>

    </View>
  );
}