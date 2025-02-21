import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Label,
  TextArea,
  Card,
  H4,
} from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Agent } from '../types'
import { AgentAvatar } from '../components/AgentAvatar'

interface AgentEditScreenProps {
  agent?: Agent
  onSave: (agent: Agent) => void
  onBack: () => void
}

export const AgentEditScreen = ({ agent, onSave, onBack }: AgentEditScreenProps) => {
  const insets = useSafeAreaInsets()
  const [name, setName] = useState(agent?.name || '')
  const [description, setDescription] = useState(agent?.description || '')
  const [personality, setPersonality] = useState(agent?.personality || '')
  const [expertise, setExpertise] = useState(agent?.expertise.join(', ') || '')
  const [avatar, setAvatar] = useState(agent?.avatar || '🤖')
  const [avatarImage, setAvatarImage] = useState(agent?.avatarImage || '')

  const handleSave = () => {
    const newAgent: Agent = {
      id: agent?.id || Date.now().toString(),
      name,
      description,
      personality,
      expertise: expertise.split(',').map(e => e.trim()).filter(Boolean),
      avatar,
      avatarImage: avatarImage || undefined,
    }
    onSave(newAgent)
  }

  return (
    <YStack
      flex={1}
      paddingTop={insets.top}
      padding="$4"
      space="$4"
      backgroundColor="$background"
    >
      <XStack space="$3" alignItems="center">
        <Button
          icon={ChevronLeft}
          onPress={onBack}
          backgroundColor="transparent"
          paddingHorizontal="$2"
          scaleIcon={1}
        />
        <H4 color="$color">{agent ? '编辑 Agent' : '创建 Agent'}</H4>
      </XStack>

      <ScrollView>
        <YStack space="$4" padding="$2">
          <YStack alignItems="center" paddingVertical="$4">
            <AgentAvatar 
              avatarImage={avatarImage} 
              avatar={avatar} 
              size="large" 
            />
          </YStack>

          <YStack space="$2">
            <Label color="$color">头像图片 URL</Label>
            <Input
              value={avatarImage}
              onChangeText={setAvatarImage}
              placeholder="输入头像图片URL（可选）"
              backgroundColor="$backgroundHover"
            />
          </YStack>

          <YStack space="$2">
            <Label color="$color">默认表情头像</Label>
            <Input
              value={avatar}
              onChangeText={setAvatar}
              placeholder="输入emoji表情"
              backgroundColor="$backgroundHover"
            />
            <Text fontSize="$2" color="$colorHover">
              当未设置头像图片URL时，将显示此表情
            </Text>
          </YStack>

          <YStack space="$2">
            <Label color="$color">名称</Label>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="输入Agent名称"
              backgroundColor="$backgroundHover"
            />
          </YStack>

          <YStack space="$2">
            <Label color="$color">描述</Label>
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="输入简短描述"
              backgroundColor="$backgroundHover"
            />
          </YStack>

          <YStack space="$2">
            <Label color="$color">个性特征</Label>
            <TextArea
              value={personality}
              onChangeText={setPersonality}
              placeholder="描述Agent的个性特征"
              backgroundColor="$backgroundHover"
              minHeight={100}
            />
          </YStack>

          <YStack space="$2">
            <Label color="$color">专业领域</Label>
            <TextArea
              value={expertise}
              onChangeText={setExpertise}
              placeholder="输入专业领域，用逗号分隔"
              backgroundColor="$backgroundHover"
              minHeight={100}
            />
          </YStack>
        </YStack>
      </ScrollView>

      <Button
        backgroundColor="$primary"
        onPress={handleSave}
        pressStyle={{ scale: 0.95 }}
        borderRadius="$4"
        padding="$3"
      >
        <Text color="white" fontWeight="bold">
          保存
        </Text>
      </Button>
    </YStack>
  )
} 