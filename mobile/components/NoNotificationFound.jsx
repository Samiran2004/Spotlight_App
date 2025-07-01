import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'
import { Ionicons } from '@expo/vector-icons'

export default function NoBookMarkFound() {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.background
        }}>
            <Ionicons name="notifications-off-outline" color={COLORS.primary} size={35} />
            <Text style={{ color: COLORS.primary, fontSize: 25 }}>No Notifications</Text>
        </View>
    )
}