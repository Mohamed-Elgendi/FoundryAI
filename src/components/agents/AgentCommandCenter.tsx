'use client';

import * as React from 'react';
import { Bot, MessageSquare, Command, Settings, History, Database, Zap, TrendingUp, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Separator } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import { ChatAgent } from './ChatAgent';
import { AgentManager } from './AgentManager';
import { CommandPalette } from './CommandPalette';
import { AgentHistory } from './AgentHistory';
import { AgentCommands } from './AgentCommands';
import { SystemControls } from './SystemControls';
import { TemplateGallery } from './TemplateGallery';
import type { Agent, AgentCommand, AgentSession, CommandCenterState, TemplateGalleryIntegration } from './types';

interface AgentCommandCenterProps {
  className?: string;
  onAgentCreate?: (agent: Agent) => void;
  onAgentUpdate?: (agentId: string, updates: Partial<Agent>) => void;
  onAgentDelete?: (agentId: string) => void;
  onCommandExecute?: (command: string, params?: string[]) => void;
  onTemplateUse?: (templateId: string) => void;
}

export function AgentCommandCenter({ 
  className, 
  onAgentCreate, 
  onAgentUpdate, 
  onAgentDelete, 
  onCommandExecute, 
  onTemplateUse 
}: AgentCommandCenterProps) {
  const [activeTab, setActiveTab] = React.useState<'agents' | 'chat' | 'commands' | 'history' | 'templates' | 'system'>('agents');
  const [activeAgentId, setActiveAgentId] = React.useState<string>('1');
  const [showCommandPalette, setShowCommandPalette] = React.useState(false);

  // Mock data - would come from context/API
  const [agents] = React.useState<Agent[]>([
    {
      id: '1',
      name: 'Business Strategist',
      type: 'strategic',
      status: 'active',
      model: 'claude-3.5-sonnet',
      provider: 'anthropic',
      capabilities: [
        {
          id: '1',
          name: 'Business Planning',
          description: 'Create comprehensive business strategies',
          category: 'analysis',
          enabled: true
        },
        {
          id: '2',
          name: 'Market Analysis',
          description: 'Analyze market trends and opportunities',
          category: 'analysis',
          enabled: true
        },
        {
          id: '3',
          name: 'Competitive Intelligence',
          description: 'Research competitor strategies',
          category: 'analysis',
          enabled: true
        }
      ],
      createdAt: new Date('2024-01-15'),
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Technical Architect',
      type: 'command',
      status: 'idle',
      model: 'gpt-4',
      provider: 'openai',
      capabilities: [
        {
          id: '4',
          name: 'Code Generation',
          description: 'Generate and optimize code',
          category: 'automation',
          enabled: true
        },
        {
          id: '5',
          name: 'Deployment Automation',
          description: 'Automate deployment pipelines',
          category: 'automation',
          enabled: true
        }
      ],
      createdAt: new Date('2024-02-20'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Creative Director',
      type: 'creative',
      status: 'idle',
      model: 'claude-3-opus',
      provider: 'anthropic',
      capabilities: [
        {
          id: '6',
          name: 'Content Creation',
          description: 'Generate marketing content',
          category: 'creation',
          enabled: true
        },
        {
          id: '7',
          name: 'Design Generation',
          description: 'Create visual designs',
          category: 'creation',
          enabled: true
        }
      ],
      createdAt: new Date('2024-03-10'),
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const [sessions] = React.useState<AgentSession[]>([
    {
      id: '1',
      agentId: '1',
      userId: 'current-user',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      messages: [],
      status: 'active',
      context: { currentProject: 'AI SaaS', phase: 'planning' }
    }
  ]);

  const [templateGallery] = React.useState<TemplateGalleryIntegration>({
    connected: true,
    templateCount: 5,
    categories: ['business-plan', 'landing-page', 'saas', 'ecommerce', 'content', 'automation'],
    lastSync: new Date()
  });

  const activeAgent = agents.find(agent => agent.id === activeAgentId);

  const handleAgentSelect = (agentId: string) => {
    setActiveAgentId(agentId);
    setActiveTab('chat');
  };

  const handleCommandExecute = (command: string, params?: string[]) => {
    onCommandExecute?.(command, params);
    // Here you would integrate with the existing AI router system
    console.log('Executing command:', command, params);
  };

  const handleTemplateUse = (templateId: string) => {
    onTemplateUse?.(templateId);
    // This would trigger the template usage workflow
    console.log('Using template:', templateId);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`flex flex-col h-full bg-slate-50 dark:bg-slate-900 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Command Center</h1>
          </div>
          <Badge variant="outline" className="text-sm">
            {agents.filter(a => a.status === 'active').length} Active Agents
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCommandPalette(true)}
          >
            <Command className="h-4 w-4 mr-2" />
            Command Palette (Ctrl+K)
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1">
        <TabsList className="grid w-full grid-cols-6 h-auto">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Agents</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="commands" className="flex items-center gap-2">
            <Command className="h-4 w-4" />
            <span className="hidden sm:inline">Commands</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="agents" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <AgentManager
              agents={agents}
              activeAgentId={activeAgentId}
              onAgentSelect={handleAgentSelect}
              onAgentCreate={onAgentCreate}
              onAgentUpdate={onAgentUpdate}
              onAgentDelete={onAgentDelete}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 mt-0">
          {activeAgent ? (
            <ChatAgent
              agent={activeAgent}
              onMessageSend={handleCommandExecute}
              onSessionStart={(agentId) => console.log('Session started:', agentId)}
              onSessionEnd={(sessionId) => console.log('Session ended:', sessionId)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Active Agent</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Select an agent from the Agents tab to start chatting</p>
                <Button onClick={() => setActiveTab('agents')}>
                  <Users className="h-4 w-4 mr-2" />
                  Go to Agents
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="commands" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <AgentCommands
              agentId={activeAgentId}
              onCommandUpdate={(command) => console.log('Command updated:', command)}
              onCommandCreate={(command) => console.log('Command created:', command)}
              onCommandDelete={(commandId) => console.log('Command deleted:', commandId)}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="history" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <AgentHistory
              sessions={sessions}
              onSessionSelect={(sessionId) => console.log('Session selected:', sessionId)}
              onSessionDelete={(sessionId) => console.log('Session deleted:', sessionId)}
              onSessionExport={(sessionId) => console.log('Session exported:', sessionId)}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <TemplateGallery />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="system" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <SystemControls
              agents={agents}
              templateGallery={templateGallery}
              onSystemStatusCheck={() => console.log('System status check')}
              onSecurityAudit={() => console.log('Security audit initiated')}
              onBackupData={() => console.log('Data backup initiated')}
              onPerformanceAnalysis={() => console.log('Performance analysis initiated')}
              onSystemOptimization={() => console.log('System optimization initiated')}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CommandPalette
            agentId={activeAgentId}
            onCommandExecute={handleCommandExecute}
          />
        </div>
      )}
    </div>
  );
}
