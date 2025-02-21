import React from 'react'
import { Image } from 'react-native'
import { Circle, Text } from 'tamagui'
import { AVATAR_SIZES } from '../constants/theme'

interface AgentAvatarProps {
  avatarImage?: string
  avatar?: string
  size?: keyof typeof AVATAR_SIZES
}

export const AgentAvatar = ({ avatarImage, avatar = '🤖', size = 'small' }: AgentAvatarProps) => {
  const avatarSize = AVATAR_SIZES[size]

  if (avatarImage) {
    return (
      <Circle size={avatarSize} overflow="hidden">
        <Image 
          source={{ uri: avatarImage }} 
          style={{ width: avatarSize, height: avatarSize }}
        />
      </Circle>
    )
  }

  return <Text fontSize={avatarSize * 0.6}>{avatar}</Text>
} 