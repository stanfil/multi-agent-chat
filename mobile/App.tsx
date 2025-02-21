import { TamaguiProvider } from 'tamagui'
import config from './tamagui.config'
import { useFonts } from 'expo-font'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ChatScreen } from './src/screens/ChatScreen'
import { AgentSelectionScreen } from './src/screens/AgentSelectionScreen'
import { useChatStore } from './src/store/chatStore'

export default function App() {
  const colorScheme = useColorScheme()
  const currentSession = useChatStore((state) => state.currentSession)
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
        {currentSession ? <ChatScreen /> : <AgentSelectionScreen />}
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
