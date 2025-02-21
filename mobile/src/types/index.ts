export interface Agent {
  id: string;
  name: string;
  avatar: string;          // emoji表情符号作为默认头像
  avatarImage?: string;    // 可选的自定义头像图片URL
  description: string;
  personality: string;
  expertise: string[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string; // 可以是用户ID或Agent ID
  timestamp: number;
  type: 'text' | 'image' | 'system';
  replyTo?: string; // 回复某条消息的ID
}

export interface ChatSession {
  id: string;
  title: string;
  participants: Agent[];
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
} 