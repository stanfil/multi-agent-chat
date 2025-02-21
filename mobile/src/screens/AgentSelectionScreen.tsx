import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  H4,
  Checkbox,
} from 'tamagui'
import { Plus, Edit3, Trash2, ChevronLeft } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Agent } from '../types'
import { useChatStore } from '../store/chatStore'
import { AgentEditScreen } from './AgentEditScreen'
import { AgentAvatar } from '../components/AgentAvatar'
import { container } from '../di/container'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'AgentSelection'>

export const AgentSelectionScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets()
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set())
  const { createSession, agents, addAgent, updateAgent, deleteAgent } = useChatStore()
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const toggleAgent = (agentId: string) => {
    const newSelected = new Set(selectedAgents)
    if (newSelected.has(agentId)) {
      newSelected.delete(agentId)
    } else {
      newSelected.add(agentId)
    }
    setSelectedAgents(newSelected)
  }

  const handleStartChat = () => {
    if (selectedAgents.size === 0) return
    
    const selectedAgentsList = agents.filter(agent => selectedAgents.has(agent.id))
    
    // 创建会话并跳转
    createSession(selectedAgentsList)
    navigation.replace('Chat')
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleDeleteAgent = (agentId: string) => {
    deleteAgent(agentId)
    setSelectedAgents(prev => {
      const next = new Set(prev)
      next.delete(agentId)
      return next
    })
  }

  const renderAvatar = (agent: Agent) => {
    return <AgentAvatar avatarImage={agent.avatarImage} avatar={agent.avatar} />
  }

  if (isCreating) {
    return (
      <AgentEditScreen
        onSave={(agent) => {
          addAgent(agent)
          setIsCreating(false)
        }}
        onBack={() => setIsCreating(false)}
      />
    )
  }

  if (editingAgent) {
    return (
      <AgentEditScreen
        agent={editingAgent}
        onSave={(agent) => {
          updateAgent(agent)
          setEditingAgent(null)
        }}
        onBack={() => setEditingAgent(null)}
      />
    )
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
        <XStack space="$2" alignItems="center">
          <Button
            icon={ChevronLeft}
            onPress={handleBack}
            backgroundColor="transparent"
            paddingHorizontal="$2"
            scaleIcon={1}
          />
          <H4 color="$color">选择对话参与者</H4>
        </XStack>
        <Button
          icon={Plus}
          onPress={() => setIsCreating(true)}
          backgroundColor="$primary"
          size="$3"
          borderRadius="$4"
          scaleIcon={1.2}
        />
      </XStack>

      <ScrollView>
        <YStack space="$3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              bordered
              animation="bouncy"
              pressStyle={{ scale: 0.97 }}
              backgroundColor="$backgroundHover"
              borderColor="$borderColor"
              borderRadius="$4"
              onPress={() => toggleAgent(agent.id)}
            >
              <Card.Header padding="$4">
                <XStack space="$3" alignItems="center">
                  {renderAvatar(agent)}
                  <YStack flex={1} space="$1">
                    <Text
                      fontSize="$4"
                      fontWeight="bold"
                      color="$color"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {agent.name}
                    </Text>
                    <Text fontSize="$3" color="$colorHover">
                      {agent.description}
                    </Text>
                  </YStack>
                  <XStack space="$2" alignItems="center">
                    <Button
                      icon={Edit3}
                      onPress={(e) => {
                        e.stopPropagation()
                        setEditingAgent(agent)
                      }}
                      backgroundColor="transparent"
                      padding="$2"
                      chromeless
                      scaleIcon={1}
                    />
                    <Button
                      icon={Trash2}
                      onPress={(e) => {
                        e.stopPropagation()
                        handleDeleteAgent(agent.id)
                      }}
                      backgroundColor="transparent"
                      padding="$2"
                      chromeless
                      color="$red10"
                      scaleIcon={1}
                    />
                    <Checkbox
                      checked={selectedAgents.has(agent.id)}
                      onCheckedChange={() => toggleAgent(agent.id)}
                      size="$4"
                      backgroundColor={selectedAgents.has(agent.id) ? '$primary' : '$background'}
                      borderColor="$borderColor"
                    >
                      <Checkbox.Indicator>
                        <Text color={selectedAgents.has(agent.id) ? 'white' : '$color'}>✓</Text>
                      </Checkbox.Indicator>
                    </Checkbox>
                  </XStack>
                </XStack>
              </Card.Header>
            </Card>
          ))}
        </YStack>
      </ScrollView>

      <Button
        backgroundColor="$primary"
        disabled={selectedAgents.size === 0}
        onPress={handleStartChat}
        pressStyle={{ scale: 0.95 }}
        borderRadius="$4"
        padding="$3"
      >
        <Text color="white" fontWeight="bold">
          开始对话 ({selectedAgents.size})
        </Text>
      </Button>
    </YStack>
  )
}