import { Realm } from '@realm/react';
import { AgentSchema, MessageSchema, ChatSessionSchema } from '../models/ChatSchema';
import { Agent, Message, ChatSession } from '../types';
import { BSON } from 'realm';

export class StorageService {
  private realm: Realm | null = null;
  private errorService: any;

  constructor(errorService: any) {
    this.errorService = errorService;
    this.initRealm();
  }

  private async initRealm() {
    try {
      this.realm = await Realm.open({
        schema: [AgentSchema.schema, MessageSchema.schema, ChatSessionSchema.schema],
        schemaVersion: 1,
      });
    } catch (error) {
      this.errorService.handleStorageError(error);
    }
  }

  // Agent操作
  async saveAgent(agent: Agent) {
    if (!this.realm) return null;

    try {
      let savedAgent;
      this.realm.write(() => {
        savedAgent = this.realm!.create('Agent', {
          _id: new BSON.ObjectId(),
          ...agent,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });
      return savedAgent;
    } catch (error) {
      this.errorService.handleStorageError(error);
      return null;
    }
  }

  async getAllAgents(): Promise<Agent[]> {
    if (!this.realm) return [];

    try {
      const agents = this.realm.objects<AgentSchema>('Agent');
      return Array.from(agents);
    } catch (error) {
      this.errorService.handleStorageError(error);
      return [];
    }
  }

  // Session操作
  async saveSession(session: ChatSession) {
    if (!this.realm) return null;

    try {
      let savedSession;
      this.realm.write(() => {
        savedSession = this.realm!.create('ChatSession', {
          _id: new BSON.ObjectId(),
          ...session,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });
      return savedSession;
    } catch (error) {
      this.errorService.handleStorageError(error);
      return null;
    }
  }

  async getAllSessions(): Promise<ChatSession[]> {
    if (!this.realm) return [];

    try {
      const sessions = this.realm.objects<ChatSessionSchema>('ChatSession');
      return Array.from(sessions);
    } catch (error) {
      this.errorService.handleStorageError(error);
      return [];
    }
  }

  async updateSession(session: ChatSession) {
    if (!this.realm) return null;

    try {
      let updatedSession;
      this.realm.write(() => {
        updatedSession = this.realm!.create('ChatSession', {
          ...session,
          participants: session.participants.map(agent => ({
            _id: new BSON.ObjectId(),
            ...agent
          })),
          messages: session.messages.map(message => ({
            _id: new BSON.ObjectId(),
            ...message,
            timestamp: message.timestamp
          })),
          updatedAt: Date.now(),
        }, true);
      });
      return updatedSession;
    } catch (error) {
      this.errorService.handleStorageError(error);
      return null;
    }
  }

  // Message操作
  async saveMessage(message: Message) {
    if (!this.realm) return null;

    try {
      let savedMessage;
      this.realm.write(() => {
        savedMessage = this.realm!.create('Message', {
          _id: new BSON.ObjectId(),
          ...message,
          timestamp: message.timestamp || Date.now(),
        });
      });
      return savedMessage;
    } catch (error) {
      this.errorService.handleStorageError(error);
      return null;
    }
  }

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    if (!this.realm) return [];

    try {
      const messages = this.realm.objects<MessageSchema>('Message')
        .filtered('sessionId == $0', sessionId);
      return Array.from(messages);
    } catch (error) {
      this.errorService.handleStorageError(error);
      return [];
    }
  }

  // 清理资源
  cleanup() {
    if (this.realm) {
      this.realm.close();
      this.realm = null;
    }
  }
}