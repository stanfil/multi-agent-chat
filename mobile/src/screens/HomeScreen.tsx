import React from 'react'
import { ScrollView } from 'react-native'
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  H4,
} from 'tamagui'
import { Plus, MessageSquare } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useChatStore } from '../store/chatStore'
import { formatDate } from '../utils/date'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ChatSession } from '../types'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export const HomeScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets()
  const { sessions, setCurrentSession } = useChatStore()

  const handleCreateNewChat = () => {
    navigation.navigate('AgentSelection')
  }

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSession(session)
    navigation.navigate('Chat')
  }

  return (
    <YStack
      flex={1}
      paddingTop={insets.top}
      padding="$4"
      space="$4"
      backgroundColor="$background"
    >
      <XStack justifyContent="space-between" alignItems="center">
        <H4 color="$color">聊天列表</H4>
        <Button
          icon={Plus}
          onPress={handleCreateNewChat}
          backgroundColor="$primary"
          size="$3"
          borderRadius="$4"
          scaleIcon={1.2}
        />
      </XStack>

      <ScrollView>
        <YStack gap="$3">
          {sessions.length === 0 ? (
            <YStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              padding="$8"
              space="$4"
            >
              <MessageSquare size={48} color="$gray8" />
              <Text color="$gray8" textAlign="center">
                还没有聊天记录
                {'\n'}
                点击右上角的加号开始新的对话
              </Text>
            </YStack>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                bordered
                animation="bouncy"
                pressStyle={{ scale: 0.97 }}
                backgroundColor="$backgroundHover"
                borderColor="$borderColor"
                borderRadius="$4"
                onPress={() => handleSelectSession(session)}
              >
                <Card.Header padding="$4">
                  <YStack space="$2">
                    <Text
                      fontSize="$4"
                      fontWeight="bold"
                      color="$color"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {session.title}
                    </Text>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="$3" color="$colorHover" numberOfLines={1}>
                        {session.participants.map(p => p.name).join(', ')}
                      </Text>
                      <Text fontSize="$2" color="$gray8">
                        {formatDate(session.updatedAt)}
                      </Text>
                    </XStack>
                  </YStack>
                </Card.Header>
              </Card>
            ))
          )}
        </YStack>
      </ScrollView>
    </YStack>
  )
}