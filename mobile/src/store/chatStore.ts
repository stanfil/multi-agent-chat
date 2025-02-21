import { create } from 'zustand'
import { ChatSession, Message, Agent } from '../types'
import { PRESET_AGENTS } from '../constants/agents'
import { container } from '../di/container'

interface ChatStore {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  agents: Agent[];
  isConnected: boolean;
  messages: Message[];
  
  // Actions
  setCurrentSession: (session: ChatSession | null) => void;
  addMessage: (message: Message) => void;
  createSession: (agents: Agent[]) => void;
  updateSession: (session: ChatSession) => void;
  setConnectionStatus: (status: boolean) => void;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  addSession: (session: ChatSession) => void;
  
  // Agent管理
  addAgent: (agent: Agent) => void;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (agentId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentSession: null,
  sessions: [],
  agents: PRESET_AGENTS,
  isConnected: false,
  messages: [],

  setCurrentSession: (session) => set({
    currentSession: session,
    // 同时也要更新消息列表
    messages: session? session.messages : []
  }),
  
  addMessage: (message) => {
    set((state) => {
      const newMessages = [...state.messages, message];
      
      // 同时更新 currentSession 的消息列表
      const updatedSession = state.currentSession
        ? {
            ...state.currentSession,
            messages: newMessages,
          }
        : null;

      // 更新 sessions 中对应会话的消息列表
      const updatedSessions = state.sessions.map((s) =>
        s.id === state.currentSession?.id
          ? { ...s, messages: newMessages }
          : s
      );

      return {
        messages: newMessages,
        currentSession: updatedSession,
        sessions: updatedSessions,
      };
    });
  },

  createSession: (agents) => {
    // 清除当前会话状态
    set({ currentSession: null, messages: [] })
    container.resolve('webSocketService').createSession(agents)
  },

  updateSession: (session) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === session.id ? session : s)),
      currentSession: state.currentSession?.id === session.id ? session : state.currentSession,
    })),

  setConnectionStatus: (status) => set({ isConnected: status }),

  sendMessage: (content) => {
    container.resolve('webSocketService').sendChatMessage(content)
  },

  clearMessages: () => {
    set({ messages: [] })
  },

  addSession: (session) => {
    set((state) => ({
      sessions: [...state.sessions, session]
    }))
  },

  // Agent管理actions
  addAgent: (agent) =>
    set((state) => ({
      agents: [...state.agents, agent],
    })),

  updateAgent: (agent) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agent.id ? agent : a)),
    })),

  deleteAgent: (agentId) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== agentId),
    })),
}));