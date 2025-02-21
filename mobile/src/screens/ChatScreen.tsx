import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack, XStack, ScrollView, Input, Button, Text, Theme } from 'tamagui'
import { ChevronLeft, Send } from '@tamagui/lucide-icons'
import { useChatStore } from '../store/chatStore'
import { Message } from '../types'
import { AgentAvatar } from '../components/AgentAvatar'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>

export const ChatScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets()
  const [inputText, setInputText] = useState('')
  const { messages, currentSession, isConnected, sendMessage, addMessage } = useChatStore()
  
  useEffect(() => {
    // 添加系统消息显示加入的 Agents
    if (currentSession && messages.length === 0) {
      const joinMessages: Message[] = currentSession.participants.map(agent => ({
        id: `join-${agent.id}`,
        content: `${agent.name} 加入了聊天`,
        senderId: 'system',
        timestamp: Date.now(),
        type: 'system'
      }))
      
      // 直接添加到本地消息列表
      joinMessages.forEach(msg => addMessage(msg))
    }
  }, [currentSession?.id]) // 只在 currentSession 改变时重新执行

  const handleSend = () => {
    if (!inputText.trim() || !isConnected) return
    
    // 发送到服务器，消息会通过 WebSocket 返回后添加到列表
    sendMessage(inputText.trim())
    setInputText('')
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const renderMessage = (message: Message) => {
    if (message.type === 'system') {
      return (
        <YStack key={message.id} padding="$2" alignItems="center">
          <Text 
            color="$gray10" 
            fontSize="$2"
            backgroundColor="$gray3"
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius="$4"
          >
            {message.content}
          </Text>
        </YStack>
      )
    }

    const isUser = message.senderId === 'user'
    const agent = isUser ? null : currentSession?.participants.find(p => p.id === message.senderId)

    return (
      <YStack key={message.id} padding="$2" alignItems={isUser ? 'flex-end' : 'flex-start'}>
        <XStack space="$2" flexDirection={isUser ? 'row-reverse' : 'row'} alignItems="flex-end">
          <AgentAvatar
            avatar={isUser ? '👤' : agent?.avatar}
            avatarImage={isUser ? undefined : agent?.avatarImage}
            size="small"
          />
          <YStack
            backgroundColor={isUser ? '$green8' : 'white'}
            padding="$3"
            borderRadius="$4"
            maxWidth="75%"
            borderWidth={1}
            borderColor={isUser ? '$green8' : '$gray4'}
          >
            <Text color="$gray12">{message.content}</Text>
          </YStack>
        </XStack>
      </YStack>
    )
  }

  return (
    <Theme name="light">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <YStack flex={1} paddingTop={insets.top}>
          <XStack alignItems="center" padding="$4">
            <Button
              icon={ChevronLeft}
              onPress={handleBack}
              backgroundColor="transparent"
              paddingHorizontal="$2"
              scaleIcon={1}
            />
            <Text fontSize="$5" fontWeight="bold" color="$color">
              聊天
            </Text>
          </XStack>

          <ScrollView flex={1} bounces={false}>
            {messages.map(renderMessage)}
          </ScrollView>

          <XStack
            padding="$4"
            space="$2"
            borderTopWidth={1}
            borderTopColor="$gray5"
            backgroundColor="$gray1"
          >
            <Input
              flex={1}
              value={inputText}
              onChangeText={setInputText}
              placeholder="输入消息..."
              onSubmitEditing={handleSend}
            />
            <Button
              icon={Send}
              disabled={!inputText.trim() || !isConnected}
              onPress={handleSend}
            />
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </Theme>
  )
}