import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack, XStack, ScrollView, Input, Button, Text, Theme } from 'tamagui'
import { useChatStore } from '../store/chatStore'
import { socketService } from '../services/socketService'
import { Message } from '../types'

export const ChatScreen = () => {
  const insets = useSafeAreaInsets()
  const [inputText, setInputText] = useState('')
  const { currentSession, addMessage } = useChatStore()
  
  useEffect(() => {
    socketService.connect()
    return () => socketService.disconnect()
  }, [])

  const handleSend = () => {
    if (!inputText.trim()) return

    const message: Omit<Message, 'id' | 'timestamp'> = {
      content: inputText,
      senderId: 'user', // 这里需要替换为实际的用户ID
      type: 'text',
    }

    socketService.sendMessage(message)
    setInputText('')
  }

  const renderMessage = (message: Message) => {
    const isUser = message.senderId === 'user'
    const participant = currentSession?.participants.find(p => p.id === message.senderId)

    return (
      <XStack
        key={message.id}
        padding="$4"
        justifyContent={isUser ? 'flex-end' : 'flex-start'}
      >
        <YStack
          backgroundColor={isUser ? '$blue10' : '$gray5'}
          padding="$3"
          borderRadius="$4"
          maxWidth="80%"
        >
          {!isUser && (
            <Text color="$gray11" fontSize="$2" marginBottom="$1">
              {participant?.name || 'Unknown'}
            </Text>
          )}
          <Text color={isUser ? 'white' : '$gray12'}>{message.content}</Text>
        </YStack>
      </XStack>
    )
  }

  return (
    <Theme name="light">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <YStack flex={1} paddingTop={insets.top}>
          <ScrollView flex={1} bounces={false}>
            {currentSession?.messages.map(renderMessage)}
          </ScrollView>

          <XStack
            padding="$4"
            space="$2"
            borderTopWidth={1}
            borderTopColor="$gray5"
          >
            <Input
              flex={1}
              size="$4"
              placeholder="输入消息..."
              onChangeText={setInputText}
              value={inputText}
            />
            <Button size="$4" onPress={handleSend}>
              发送
            </Button>
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </Theme>
  )
} 