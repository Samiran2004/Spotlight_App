import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/theme'

export default function NoPostFound() {
    return (
        <View style={{
            flex: 1,
            borderWidth:2,
            height: 280,
            // borderColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.background
        }}>
            <Ionicons name="logo-tableau" color={COLORS.gray} size={35} />
            <Text style={{ color: COLORS.primary, fontSize: 25 }}>No Posts</Text>
        </View>
    )
}