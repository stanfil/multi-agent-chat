import { Realm } from '@realm/react';

export class AgentSchema extends Realm.Object<AgentSchema> {
  _id!: Realm.BSON.ObjectId;
  id!: string;
  name!: string;
  avatar!: string;
  description!: string;
  personality!: string;
  expertise!: string[];
  createdAt!: number;
  updatedAt!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Agent',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      id: 'string',
      name: 'string',
      avatar: 'string',
      description: 'string',
      personality: 'string',
      expertise: 'string[]',
      createdAt: 'int',
      updatedAt: 'int',
    },
  };
}

export class MessageSchema extends Realm.Object<MessageSchema> {
  _id!: Realm.BSON.ObjectId;
  id!: string;
  content!: string;
  senderId!: string;
  type!: 'text' | 'image' | 'system';
  timestamp!: number;
  sessionId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      id: 'string',
      content: 'string',
      senderId: 'string',
      type: { type: 'string', default: 'text' },
      timestamp: 'int',
      sessionId: 'string',
    },
  };
}

export class ChatSessionSchema extends Realm.Object<ChatSessionSchema> {
  _id!: Realm.BSON.ObjectId;
  id!: string;
  title!: string;
  participants!: AgentSchema[];
  messages!: MessageSchema[];
  createdAt!: number;
  updatedAt!: number;

  static schema: Realm.ObjectSchema = {
    name: 'ChatSession',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      id: 'string',
      title: 'string',
      participants: { type: 'list', objectType: 'Agent' },
      messages: { type: 'list', objectType: 'Message' },
      createdAt: 'int',
      updatedAt: 'int',
    },
  };
}