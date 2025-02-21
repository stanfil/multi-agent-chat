import { create } from 'zustand'
import { ChatSession, Message, Agent } from '../types'
import { PRESET_AGENTS } from '../constants/agents'

interface ChatStore {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  agents: Agent[];
  isConnected: boolean;
  
  // Actions
  setCurrentSession: (session: ChatSession | null) => void;
  addMessage: (message: Message) => void;
  createSession: (agents: Agent[]) => void;
  updateSession: (session: ChatSession) => void;
  setConnectionStatus: (status: boolean) => void;
  
  // Agent管理
  addAgent: (agent: Agent) => void;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (agentId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentSession: null,
  sessions: [],
  agents: PRESET_AGENTS,
  isConnected: false,

  setCurrentSession: (session) => set({ currentSession: session }),
  
  addMessage: (message) =>
    set((state) => {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        messages: [...state.currentSession.messages, message],
        updatedAt: Date.now(),
      };

      const updatedSessions = state.sessions.map((s) =>
        s.id === updatedSession.id ? updatedSession : s
      );

      return {
        currentSession: updatedSession,
        sessions: updatedSessions,
      };
    }),

  createSession: (agents) =>
    set((state) => {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: '新对话',
        participants: agents,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      return {
        currentSession: newSession,
        sessions: [newSession, ...state.sessions],
      };
    }),

  updateSession: (session) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === session.id ? session : s)),
      currentSession: state.currentSession?.id === session.id ? session : state.currentSession,
    })),

  setConnectionStatus: (status) => set({ isConnected: status }),

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