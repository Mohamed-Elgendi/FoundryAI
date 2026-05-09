'use client';

import * as React from 'react';
import { Search, Terminal, Code, Zap, Cpu, Globe, Database, Lock, Key, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';
import { Separator } from '@/components/ui';
import { Command } from 'cmdk';
import type { AgentCommand } from './types';

interface CommandPaletteProps {
  agentId?: string;
  onCommandExecute?: (command: string, params?: string[]) => void;
  className?: string;
}

export function CommandPalette({ agentId, onCommandExecute, className }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [recentCommands, setRecentCommands] = React.useState<string[]>([]);

  const commands: AgentCommand[] = [
    {
      id: '1',
      name: 'Generate Business Plan',
      description: 'Create comprehensive business plan from idea',
      category: 'business',
      shortcut: 'ctrl+shift+b',
      icon: 'FileText',
      requiresAuth: false
    },
    {
      id: '2',
      name: 'Market Research',
      description: 'Analyze market trends and competition',
      category: 'analysis',
      shortcut: 'ctrl+shift+m',
      icon: 'Globe',
      requiresAuth: false
    },
    {
      id: '3',
      name: 'Opportunity Analysis',
      description: 'Evaluate business opportunities and ROI',
      category: 'analysis',
      shortcut: 'ctrl+shift+o',
      icon: 'TrendingUp',
      requiresAuth: false
    },
    {
      id: '4',
      name: 'Competitor Analysis',
      description: 'Research competitor strategies and positioning',
      category: 'analysis',
      shortcut: 'ctrl+shift+c',
      icon: 'Users',
      requiresAuth: false
    },
    {
      id: '5',
      name: 'Create Landing Page',
      description: 'Generate landing page for business idea',
      category: 'creative',
      shortcut: 'ctrl+shift+l',
      icon: 'Zap',
      requiresAuth: false
    },
    {
      id: '6',
      name: 'Build MVP',
      description: 'Create minimum viable product',
      category: 'technical',
      shortcut: 'ctrl+shift+v',
      icon: 'Code',
      requiresAuth: false
    },
    {
      id: '7',
      name: 'SEO Optimization',
      description: 'Optimize for search engines',
      category: 'technical',
      shortcut: 'ctrl+shift+s',
      icon: 'Search',
      requiresAuth: false
    },
    {
      id: '8',
      name: 'Database Query',
      description: 'Execute database operations',
      category: 'technical',
      shortcut: 'ctrl+shift+d',
      icon: 'Database',
      requiresAuth: true
    },
    {
      id: '9',
      name: 'Deploy to Production',
      description: 'Deploy application to live environment',
      category: 'general',
      shortcut: 'ctrl+shift+p',
      icon: 'Rocket',
      requiresAuth: true
    },
    {
      id: '10',
      name: 'Security Audit',
      description: 'Run security vulnerability assessment',
      category: 'general',
      shortcut: 'ctrl+shift+a',
      icon: 'Shield',
      requiresAuth: true
    },
    {
      id: '11',
      name: 'Performance Analysis',
      description: 'Analyze system performance metrics',
      category: 'general',
      shortcut: 'ctrl+shift+f',
      icon: 'Cpu',
      requiresAuth: false
    },
    {
      id: '12',
      name: 'Backup Data',
      description: 'Create secure backup of all data',
      category: 'general',
      shortcut: 'ctrl+shift+bksp',
      icon: 'Lock',
      requiresAuth: true
    }
  ];

  const filteredCommands = React.useMemo(() => {
    if (!searchTerm) return commands;
    
    return commands.filter(command => 
      command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [commands, searchTerm]);

  const executeCommand = (commandId: string, params: string[] = []) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (!command) return;
    
    // Add to recent commands
    setRecentCommands(prev => [command.name, ...prev.slice(0, 9)]);
    
    // Execute command
    onCommandExecute?.(command.name, params);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <Card.Header className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Command Palette</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Terminal className="h-4 w-4" />
                </Button>
              </div>
            </Card.Header>
            <Card.Content className="space-y-4">
              <Input
                placeholder="Type command or search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-lg"
                autoFocus
              />
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCommands.map((command) => (
                  <div
                    key={command.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    onClick={() => executeCommand(command.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded">
                        {getCommandIcon(command.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">{command.name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{command.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {command.category}
                      </Badge>
                      {command.shortcut && (
                        <kbd className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-300 dark:border-slate-600">
                          {command.shortcut}
                        </kbd>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </>
  );
}

function getCommandIcon(iconName: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    FileText: <FileText className="h-5 w-5" />,
    Globe: <Globe className="h-5 w-5" />,
    TrendingUp: <TrendingUp className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    Zap: <Zap className="h-5 w-5" />,
    Code: <Code className="h-5 w-5" />,
    Search: <Search className="h-5 w-5" />,
    Database: <Database className="h-5 w-5" />,
    Lock: <Lock className="h-5 w-5" />,
    Key: <Key className="h-5 w-5" />,
    Shield: <Shield className="h-5 w-5" />,
    AlertTriangle: <AlertTriangle className="h-5 w-5" />,
    Rocket: <Rocket className="h-5 w-5" />,
    Cpu: <Cpu className="h-5 w-5" />
  };
  
  return iconMap[iconName] || <Terminal className="h-5 w-5" />;
}
