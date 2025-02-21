import { AIServiceConfig, defaultConfig } from '../config'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export class AIService {
  private config: AIServiceConfig
  private openai: OpenAI

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseUrl,
    })
  }

  async generateResponse(messages: ChatCompletionMessageParam[]) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      })

      return response.choices[0].message.content || ''
    } catch (error) {
      console.error('Error generating response:', error)
      throw error
    }
  }

  // 更新配置
  updateConfig(newConfig: Partial<AIServiceConfig>) {
    this.config = { ...this.config, ...newConfig }
    
    // 重新初始化客户端
    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseUrl,
    })
  }
}