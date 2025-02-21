export interface AIServiceConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

// 默认配置
export const defaultConfig: AIServiceConfig = {
  apiKey: process.env.AI_SERVICE_API_KEY || '',
  baseUrl: 'https://api.siliconflow.cn/v1',
  model: 'deepseek-ai/DeepSeek-V2.5', // 默认使用 DeepSeek-V2.5 模型
}

// 支持的模型列表
export const supportedModels = [
  'deepseek-ai/DeepSeek-V2.5',
  'gpt-4-turbo-preview',
  'gpt-4',
  'gpt-3.5-turbo',
] 