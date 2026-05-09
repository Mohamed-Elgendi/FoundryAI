'use client';

import * as React from 'react';
import { Bot, Zap, Code, Globe, Users, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Progress } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui';
import { Separator } from '@/components/ui';
import type { Agent, AgentCommand, AgentTask } from './types';

interface AIIntegrationProps {
  agents: Agent[];
  onAgentUpdate?: (agent: Agent) => void;
  onTaskUpdate?: (task: AgentTask) => void;
  className?: string;
}

interface AIProvider {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'idle' | 'error';
  quota: {
    used: number;
    limit: number;
    resetDate: Date;
  };
  capabilities: string[];
}

export function AIIntegration({ agents, onAgentUpdate, onTaskUpdate, className }: AIIntegrationProps) {
  const [selectedProvider, setSelectedProvider] = React.useState<string>('groq');
  const [activeTasks, setActiveTasks] = React.useState<AgentTask[]>([
    {
      id: '1',
      agentId: '1',
      title: 'Generate Business Plan',
      description: 'Create comprehensive business plan from idea',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      agentId: '2',
      title: 'Market Research',
      description: 'Analyze market trends and competition',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    }
  ]);

  const [aiProviders] = React.useState<AIProvider[]>([
    {
      id: 'groq',
      name: 'Groq',
      model: 'llama3-70b-8192',
      status: 'active',
      quota: {
        used: 1250,
        limit: 5000,
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      capabilities: ['text-generation', 'analysis', 'coding', 'business-planning']
    },
    {
      id: 'openai',
      name: 'OpenAI',
      model: 'gpt-4-turbo',
      status: 'active',
      quota: {
        used: 890,
        limit: 10000,
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      capabilities: ['text-generation', 'analysis', 'coding', 'business-planning']
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      model: 'claude-3.5-sonnet',
      status: 'idle',
      quota: {
        used: 450,
        limit: 2000,
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      capabilities: ['text-generation', 'analysis', 'coding', 'business-planning']
    },
    {
      id: 'mistral',
      name: 'Mistral',
      model: 'mistral-large',
      status: 'error',
      quota: {
        used: 0,
        limit: 1000,
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      capabilities: ['text-generation', 'analysis']
    },
    {
      id: 'together',
      name: 'Together AI',
      model: 'mixtral-8x7b',
      status: 'idle',
      quota: {
        used: 230,
        limit: 1500,
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      capabilities: ['text-generation', 'analysis', 'coding']
    }
  ]);

  const [commandQueue, setCommandQueue] = React.useState<AgentCommand[]>([
    {
      id: '1',
      name: 'Business Plan Generation',
      description: 'Generate comprehensive business plan',
      category: 'business',
      shortcut: 'ctrl+shift+b',
      requiresAuth: false
    },
    {
      id: '2',
      name: 'Market Analysis',
      description: 'Analyze market opportunities',
      category: 'analysis',
      shortcut: 'ctrl+shift+m',
      requiresAuth: false
    }
  ]);

  const handleProviderSwitch = (providerId: string) => {
    setSelectedProvider(providerId);
    // This would integrate with existing AI router system
    console.log('Switching to provider:', providerId);
  };

  const handleTaskExecute = (taskId: string) => {
    const task = activeTasks.find(t => t.id === taskId);
    if (!task) return;

    // Update task status
    const updatedTask = { ...task, status: 'in-progress' };
    onTaskUpdate?.(updatedTask);
    
    // Simulate task execution
    setTimeout(() => {
      const completedTask = { ...updatedTask, status: 'completed', completedAt: new Date() };
      onTaskUpdate?.(completedTask);
    }, 3000 + Math.random() * 2000);
  };

  const handleCommandExecute = (commandId: string) => {
    const command = commandQueue.find(c => c.id === commandId);
    if (!command) return;

    // This would integrate with the AI router to execute the command
    console.log('Executing command with AI:', command.name);
  };

  const getProviderStatusColor = (status: AIProvider['status']) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'idle': return 'text-slate-500';
      case 'error': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  const getTaskStatusIcon = (status: AgentTask['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <Zap className="h-4 w-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Integration</h2>
        <Badge variant="outline">
          {agents.length} Agents Connected
        </Badge>
      </div>

      {/* Provider Management */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Provider Management
          </h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900 dark:text-white">Primary Provider</label>
              <Select value={selectedProvider} onValueChange={handleProviderSwitch}>
                <SelectTrigger>
                  {aiProviders.find(p => p.id === selectedProvider)?.name}
                </SelectTrigger>
                <SelectContent>
                  {aiProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{provider.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {provider.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provider Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiProviders.map((provider) => (
                <Card 
                  key={provider.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    provider.id === selectedProvider ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleProviderSwitch(provider.id)}
                >
                  <Card.Header className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{provider.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{provider.model}</p>
                      </div>
                      <div className={`text-sm ${getProviderStatusColor(provider.status)}`}>
                        {provider.status}
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      {/* Quota */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">API Quota</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {provider.quota.used.toLocaleString()} / {provider.quota.limit.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={(provider.quota.used / provider.quota.limit) * 100} 
                          max={100} 
                          className="w-full"
                        />
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Resets: {new Date(provider.quota.resetDate).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div>
                        <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Capabilities</h5>
                        <div className="flex flex-wrap gap-1">
                          {provider.capabilities.map((capability) => (
                            <Badge key={capability} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Active Tasks */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Active AI Tasks
          </h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <div key={task.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTaskStatusIcon(task.status)}
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{task.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Agent: {agents.find(a => a.id === task.agentId)?.name || 'Unknown'}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No deadline'}
                  </div>
                </div>

                <div className="flex justify-between mt-3">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTaskExecute(task.id)}
                    disabled={task.status === 'in-progress'}
                  >
                    {task.status === 'in-progress' ? 'In Progress...' : 'Execute Task'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Command Queue */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="h-5 w-5" />
            Command Queue
          </h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {commandQueue.map((command) => (
              <div key={command.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded">
                    <Command className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{command.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{command.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {command.category}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCommandExecute(command.id)}
                  >
                    Execute
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Integration Status */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Integration Status
          </h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">AI Router Connected</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">Multi-provider routing active</p>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Template Gallery Sync</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">5 templates synced</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Agent Orchestration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">3 agents managed</p>
                </div>
              </div>
              <Badge variant="outline">Ready</Badge>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
