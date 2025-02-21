import { Alert } from 'react-native'

export class ErrorService {
  // WebSocket相关错误
  handleWebSocketError(error: any) {
    console.error('WebSocket错误:', error)
    Alert.alert('连接错误', '与服务器的连接发生错误，请稍后重试')
  }

  handleConnectionError(error: any) {
    console.error('连接错误:', error)
    Alert.alert('连接失败', '无法连接到服务器，请检查网络连接')
  }

  handleMaxReconnectError() {
    console.error('达到最大重连次数')
    Alert.alert('连接失败', '多次尝试连接服务器失败，请稍后重试')
  }

  handleNotConnectedError() {
    console.error('WebSocket未连接')
    Alert.alert('连接错误', '当前未连接到服务器，请稍后重试')
  }

  // 消息处理相关错误
  handleMessageParseError(error: any) {
    console.error('消息解析错误:', error)
    Alert.alert('数据错误', '收到的消息格式不正确')
  }

  handleMessageProcessError(error: any) {
    console.error('消息处理错误:', error)
    Alert.alert('处理错误', '处理消息时发生错误')
  }

  handleMessageSendError(error: any) {
    console.error('消息发送错误:', error)
    Alert.alert('发送失败', '消息发送失败，请重试')
  }

  // 业务逻辑相关错误
  handleNoActiveSessionError() {
    console.error('没有活动会话')
    Alert.alert('会话错误', '当前没有活动的会话')
  }

  handleServerError(message: string) {
    console.error('服务器错误:', message)
    Alert.alert('服务器错误', message || '服务器处理请求时发生错误')
  }

  // 通用错误处理
  handleUnexpectedError(error: any) {
    console.error('未预期的错误:', error)
    Alert.alert('错误', '发生未知错误，请重试')
  }
}