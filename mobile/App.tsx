import { TamaguiProvider } from 'tamagui'
import config from './tamagui.config'
import { useFonts } from 'expo-font'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from './src/screens/HomeScreen'
import { ChatScreen } from './src/screens/ChatScreen'
import { AgentSelectionScreen } from './src/screens/AgentSelectionScreen'
import { container } from './src/di/container'
import { useEffect } from 'react'

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  AgentSelection: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const colorScheme = useColorScheme()

  useEffect(() => {
    // 在应用启动时初始化WebSocket连接
    container.resolve('webSocketService').connect()

    return () => {
      // 在应用退出时断开连接
      container.resolve('webSocketService').disconnect()
    }
  }, [])

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
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AgentSelection" component={AgentSelectionScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
