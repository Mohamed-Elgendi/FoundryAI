'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Zap } from 'lucide-react';
import type { Agent } from './types';

interface AgentTask {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
}

interface UserAgentPreferences {
  personalityMode: 'professional' | 'casual' | 'friendly' | 'technical';
  responseStyle: 'concise' | 'detailed' | 'conversational';
  theme: 'light' | 'dark' | 'auto';
}

interface AgentManagerProps {
  agents: Agent[];
  activeAgentId?: string;
  onAgentSelect: (agentId: string) => void;
  onAgentCreate?: (agent: Agent) => void;
  onAgentUpdate?: (agentId: string, updates: Partial<Agent>) => void;
  onAgentDelete?: (agentId: string) => void;
  className?: string;
}

export function AgentManager({ 
  agents, 
  activeAgentId, 
  onAgentSelect, 
  onAgentCreate = () => {}, 
  onAgentUpdate = () => {}, 
  onAgentDelete = () => {}, 
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
  const [activeTasks, setActiveTasks] = React.useState<AgentTask[]>([
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
          name: 'Text Generation',
          description: 'Generate human-like text responses',
          category: 'communication',
          enabled: true
        },
        {
          id: '2',
          name: 'Analysis',
          description: 'Analyze data and provide insights',
          category: 'analysis',
          enabled: true
        },
        {
          id: '3',
          name: 'Research',
          description: 'Search and gather information',
          category: 'analysis',
          enabled: true
        }
      ],
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    onAgentCreate(newAgent);
    setShowCreateModal(false);
  };

  const handleUpdateAgent = (agentId: string, updates: Partial<Agent>) => {
    onAgentUpdate(agentId, updates);
  };

  const handleDeleteAgent = (agentId: string) => {
    onAgentDelete(agentId);
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Manager</h2>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Agent
          </Button>
        </div>

        {/* Active Agent Info */}
        {activeAgent && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{activeAgent.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Type: {activeAgent.type} | Status: {activeAgent.status}
                  </p>
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Capabilities</h4>
                  <div className="space-y-2">
                    {activeAgent.capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="text-sm font-medium">{capability.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{capability.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Tasks Completed</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Success Rate</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">94.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Last Active</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{activeAgent.lastActive?.toLocaleDateString() || 'Never'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agent List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card 
              key={agent.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeAgentId === agent.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onAgentSelect(agent.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{agent.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {agent.type} | {agent.status}
                    </p>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Created</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{agent.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Last Active</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{agent.lastActive?.toLocaleDateString() || 'Never'}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => setEditingAgent(agent)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteAgent(agent.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Tasks */}
        {activeAgent && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Tasks</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{task.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Due: {task.dueDate?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Preferences */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">User Preferences</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Personality Mode</Label>
                <Select>
                  <SelectTrigger>{userPreferences.personalityMode}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Response Style</Label>
                <Select>
                  <SelectTrigger>{userPreferences.responseStyle}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Theme</Label>
                <Select>
                  <SelectTrigger>{userPreferences.theme}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Controls */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">System Controls</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-900 dark:text-white">Global Agent Status</span>
                <Badge variant="default">Operational</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">Total Agents</h4>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{agents.length}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">Active Agents</h4>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {agents.filter(agent => agent.status === 'active').length}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-white">System Performance</span>
                <Button variant="outline" size="sm">
                  Diagnostics
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Reset to Defaults
                </Button>
                <Button>
                  Create Agent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Agent</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <Label>Agent Name</Label>
                  <Input placeholder="Enter agent name..." />
                </div>
                <div>
                  <Label>Type</Label>
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
                  <Label>Model</Label>
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
