'use client';

'use client';

import * as React from 'react';
import { Bot, Users, Settings, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui';
import { Separator } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import { Avatar, AvatarFallback } from '@/components/ui';
import type { Agent, AgentTask, UserAgentPreferences } from './types';

interface AgentManagerProps {
  agents: Agent[];
  activeAgentId?: string;
  onAgentSelect?: (agentId: string) => void;
  onAgentCreate?: (agent: Agent) => void;
  onAgentUpdate?: (agent: Agent) => void;
  onAgentDelete?: (agentId: string) => void;
  className?: string;
}

export function AgentManager({ 
  agents, 
  activeAgentId, 
  onAgentSelect, 
  onAgentCreate, 
  onAgentUpdate, 
  onAgentDelete, 
  className 
}: AgentManagerProps) {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingAgent, setEditingAgent] = React.useState<Agent | null>(null);
  const [userPreferences, setUserPreferences] = React.useState<UserAgentPreferences>({
    personalityMode: 'professional',
    responseStyle: 'detailed',
    theme: 'auto'
  });

  const activeAgent = agents.find(agent => agent.id === activeAgentId);
  const activeTasks = React.useState<AgentTask[]>([
    {
      id: '1',
      agentId: activeAgentId || '',
      title: 'Analyze market opportunity',
      description: 'Research current market trends and identify gaps',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      agentId: activeAgentId || '',
      title: 'Generate business plan outline',
      description: 'Create structured business plan for identified opportunity',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ]);

  const handleCreateAgent = () => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: `Agent ${agents.length + 1}`,
      type: 'chat',
      status: 'idle',
      capabilities: [
        {
          id: '1',
          name: 'Business Analysis',
          description: 'Analyze business models and opportunities',
          category: 'analysis',
          enabled: true
        },
        {
          id: '2',
          name: 'Strategic Planning',
          description: 'Create and optimize business strategies',
          category: 'strategic',
          enabled: true
        }
      ],
      createdAt: new Date()
    };
    onAgentCreate?.(newAgent);
    setShowCreateModal(false);
  };

  const handleUpdateAgent = (agent: Agent) => {
    onAgentUpdate?.(agent);
    setEditingAgent(null);
  };

  const handleDeleteAgent = (agentId: string) => {
    onAgentDelete?.(agentId);
  };

  const getAgentStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'idle': return 'text-slate-500';
      case 'busy': return 'text-yellow-600';
      case 'offline': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  const getAgentStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'idle': return <Square className="h-4 w-4" />;
      case 'busy': return <Pause className="h-4 w-4" />;
      case 'offline': return <Users className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Manager</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Active Agent Overview */}
      {activeAgent && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    <Bot className="h-6 w-6 text-blue-500" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{activeAgent.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {activeAgent.type} Agent • {activeAgent.model}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={activeAgent.status === 'active' ? 'default' : 'secondary'}>
                  {activeAgent.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Capabilities</h4>
                <div className="space-y-2">
                  {activeAgent.capabilities.map((capability) => (
                    <div key={capability.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{capability.name}</span>
                      <Badge variant={capability.enabled ? 'default' : 'outline'} className="text-xs">
                        {capability.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Active Tasks</h4>
                <div className="space-y-2">
                  {activeTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
                          {task.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card 
            key={agent.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              agent.id === activeAgentId ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onAgentSelect?.(agent.id)}
          >
            <Card.Header className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <Bot className="h-5 w-5 text-blue-500" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{agent.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {agent.type} Agent
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${getAgentStatusColor(agent.status)} border-current`}
                  >
                    <div className="flex items-center gap-1">
                      {getAgentStatusIcon(agent.status)}
                      <span className="ml-1">{agent.status}</span>
                    </div>
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Type</span>
                  <Badge variant="outline" className="text-xs">
                    {agent.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Model</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{agent.model || 'Default'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Created</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Last Active</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {agent.lastActive ? new Date(agent.lastActive).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* User Preferences */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Agent Preferences</h3>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-slate-900 dark:text-white">Default Agent</label>
              <Select value={userPreferences.defaultAgent || ''} onValueChange={(value) => setUserPreferences(prev => ({ ...prev, defaultAgent: value }))}>
                <SelectTrigger>
                  {userPreferences.defaultAgent || 'Select default agent...'}
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 dark:text-white">Personality Mode</label>
              <Select value={userPreferences.personalityMode} onValueChange={(value) => setUserPreferences(prev => ({ ...prev, personalityMode: value as any }))}>
                <SelectTrigger>
                  {userPreferences.personalityMode}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 dark:text-white">Response Style</label>
              <Select value={userPreferences.responseStyle} onValueChange={(value) => setUserPreferences(prev => ({ ...prev, responseStyle: value as any }))}>
                <SelectTrigger>
                  {userPreferences.responseStyle}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="step-by-step">Step-by-Step</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 dark:text-white">Theme</label>
              <Select value={userPreferences.theme} onValueChange={(value) => setUserPreferences(prev => ({ ...prev, theme: value as any }))}>
                <SelectTrigger>
                  {userPreferences.theme}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline">
              Save Preferences
            </Button>
            <Button>
              Reset to Defaults
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <Card.Header>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Agent</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Agent Name</label>
                  <Input placeholder="Enter agent name..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Type</label>
                  <Select>
                    <SelectTrigger>Chat Agent</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">Chat Agent</SelectItem>
                      <SelectItem value="command">Command Agent</SelectItem>
                      <SelectItem value="analysis">Analysis Agent</SelectItem>
                      <SelectItem value="creative">Creative Agent</SelectItem>
                      <SelectItem value="strategic">Strategic Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Model</label>
                  <Input placeholder="e.g., gpt-4, claude-3.5-sonnet" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleCreateAgent}>
                  Create Agent
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
}
