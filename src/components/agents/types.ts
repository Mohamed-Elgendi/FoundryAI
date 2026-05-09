/**
 * Agent System Types
 * Type definitions for chat agents and command center
 */

export interface Agent {
  id: string;
  name: string;
  type: 'chat' | 'command' | 'analysis' | 'creative' | 'strategic';
  status: 'active' | 'idle' | 'busy' | 'offline';
  avatar?: string;
  capabilities: AgentCapability[];
  model?: string;
  provider?: string;
  createdAt: Date;
  lastActive?: Date;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'analysis' | 'creation' | 'automation' | 'integration';
  enabled: boolean;
}

export interface AgentMessage {
  id: string;
  agentId: string;
  content: string;
  type: 'user' | 'agent' | 'system';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentCommand {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'business' | 'technical' | 'creative' | 'analysis';
  shortcut?: string;
  icon?: string;
  requiresAuth?: boolean;
}

export interface AgentSession {
  id: string;
  agentId: string;
  userId: string;
  startedAt: Date;
  messages: AgentMessage[];
  status: 'active' | 'paused' | 'ended';
  context?: Record<string, any>;
}

export interface CommandCenterState {
  activeAgent?: string;
  activeSession?: string;
  commandHistory: CommandHistoryItem[];
  availableAgents: Agent[];
  availableCommands: AgentCommand[];
  userPreferences: UserAgentPreferences;
}

export interface UserAgentPreferences {
  defaultAgent?: string;
  autoSwitch: boolean;
  personalityMode: 'professional' | 'casual' | 'creative';
  responseStyle: 'concise' | 'detailed' | 'step-by-step';
  theme: 'light' | 'dark' | 'auto';
}

export interface AgentTask {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  result?: any;
}

export interface TemplateGalleryIntegration {
  connected: boolean;
  apiKey?: string;
  lastSync?: Date;
  templateCount: number;
  categories: string[];
}
