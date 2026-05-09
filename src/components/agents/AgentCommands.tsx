'use client';

import * as React from 'react';
import { Code, Zap, Play, Pause, Square, RotateCw, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui';
import { Separator } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Progress } from '@/components/ui';
import type { AgentCommand } from './types';

interface AgentCommandsProps {
  agentId?: string;
  onCommandUpdate?: (command: AgentCommand) => void;
  onCommandCreate?: (command: AgentCommand) => void;
  onCommandDelete?: (commandId: string) => void;
  className?: string;
}

export function AgentCommands({ agentId, onCommandUpdate, onCommandCreate, onCommandDelete, className }: AgentCommandsProps) {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingCommand, setEditingCommand] = React.useState<AgentCommand | null>(null);
  const [filterCategory, setFilterCategory] = React.useState<'all' | 'business' | 'technical' | 'creative' | 'analysis' | 'general'>('all');
  const [commands, setCommands] = React.useState<AgentCommand[]>([
    {
      id: '1',
      name: 'Generate Business Plan',
      description: 'Create comprehensive business plan with market analysis, competitive landscape, and financial projections',
      category: 'business',
      shortcut: 'ctrl+shift+b',
      icon: 'FileText',
      parameters: [
        { name: 'business_idea', type: 'text', required: true, description: 'Business idea or concept' },
        { name: 'target_market', type: 'text', required: true, description: 'Target market segment' },
        { name: 'timeframe', type: 'select', required: true, options: ['1-3 months', '3-6 months', '6-12 months', '1-2 years'] }
      ],
      examples: ['Generate business plan for AI-powered SaaS', 'Create e-commerce business strategy']
    },
    {
      id: '2',
      name: 'Market Opportunity Scan',
      description: 'Analyze market trends, identify gaps, and validate business opportunities',
      category: 'analysis',
      shortcut: 'ctrl+shift+m',
      icon: 'Globe',
      parameters: [
        { name: 'industry', type: 'select', required: true, options: ['SaaS', 'E-commerce', 'Digital Products', 'Online Services', 'Content Creation'] },
        { name: 'geography', type: 'select', required: true, options: ['Global', 'North America', 'Europe', 'Asia Pacific'] },
        { name: 'keywords', type: 'text', required: false, description: 'Optional keywords for focused analysis' }
      ],
      examples: ['Analyze AI SaaS market trends', 'Scan e-commerce opportunities in Europe']
    },
    {
      id: '3',
      name: 'Competitor Intelligence',
      description: 'Research and analyze competitor strategies, positioning, and market share',
      category: 'analysis',
      shortcut: 'ctrl+shift+c',
      icon: 'Users',
      parameters: [
        { name: 'competitors', type: 'text', required: true, description: 'Competitor names or URLs' },
        { name: 'analysis_depth', type: 'select', required: true, options: ['Basic', 'Comprehensive', 'Deep Dive'] }
      ],
      examples: ['Analyze top 5 SaaS competitors', 'Deep dive into e-commerce leader strategies']
    },
    {
      id: '4',
      name: 'Content Generation',
      description: 'Generate marketing content, blog posts, social media content, and ad copy',
      category: 'creative',
      shortcut: 'ctrl+shift+l',
      icon: 'Zap',
      parameters: [
        { name: 'content_type', type: 'select', required: true, options: ['Blog Post', 'Social Media', 'Ad Copy', 'Email Newsletter', 'Product Description'] },
        { name: 'tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Creative', 'Persuasive'] },
        { name: 'length', type: 'number', required: true, description: 'Content length in words' },
        { name: 'seo_optimized', type: 'boolean', required: false, description: 'Include SEO keywords' }
      ],
      examples: ['Generate 10 blog posts about AI SaaS', 'Create social media campaign for product launch']
    },
    {
      id: '5',
      name: 'Technical Implementation',
      description: 'Generate code, APIs, database schemas, and technical documentation',
      category: 'technical',
      shortcut: 'ctrl+shift+v',
      icon: 'Code',
      parameters: [
        { name: 'tech_stack', type: 'select', required: true, options: ['Next.js', 'React', 'Node.js', 'Python', 'Docker', 'AWS', 'Vercel'] },
        { name: 'feature', type: 'text', required: true, description: 'Feature to implement' },
        { name: 'complexity', type: 'select', required: true, options: ['Simple', 'Medium', 'Complex'] },
        { name: 'documentation', type: 'boolean', required: false, description: 'Include technical documentation' }
      ],
      examples: ['Generate Next.js API for user authentication', 'Create database schema for e-commerce platform']
    },
    {
      id: '6',
      name: 'Deployment Pipeline',
      description: 'Automate deployment processes, CI/CD pipelines, and infrastructure management',
      category: 'technical',
      shortcut: 'ctrl+shift+p',
      icon: 'Rocket',
      parameters: [
        { name: 'environment', type: 'select', required: true, options: ['Development', 'Staging', 'Production'] },
        { name: 'deploy_target', type: 'select', required: true, options: ['Vercel', 'Netlify', 'AWS', 'DigitalOcean', 'Self-hosted'] },
        { name: 'rollback', type: 'boolean', required: false, description: 'Enable automatic rollback on failure' },
        { name: 'health_checks', type: 'boolean', required: false, description: 'Run pre and post-deployment health checks' }
      ],
      examples: ['Deploy to Vercel production', 'Set up CI/CD pipeline for automated deployments']
    },
    {
      id: '7',
      name: 'Data Analysis',
      description: 'Analyze business metrics, user behavior, and performance data',
      category: 'analysis',
      shortcut: 'ctrl+shift+f',
      icon: 'RotateCw',
      parameters: [
        { name: 'metrics', type: 'select', required: true, options: ['Revenue', 'Users', 'Conversion', 'Retention', 'Engagement'] },
        { name: 'timeframe', type: 'select', required: true, options: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom Range'] },
        { name: 'export_format', type: 'select', required: true, options: ['JSON', 'CSV', 'PDF', 'Dashboard'] }
      ],
      examples: ['Generate revenue analytics report', 'Analyze user engagement patterns', 'Export conversion data to CSV']
    },
    {
      id: '8',
      name: 'Security Audit',
      description: 'Perform security vulnerability assessment and compliance checks',
      category: 'general',
      shortcut: 'ctrl+shift+a',
      icon: 'Shield',
      parameters: [
        { name: 'scan_type', type: 'select', required: true, options: ['Quick Scan', 'Comprehensive Audit', 'Penetration Testing'] },
        { name: 'target', type: 'select', required: true, options: ['Application', 'Infrastructure', 'Data', 'Network'] },
        { name: 'compliance', type: 'select', required: true, options: ['GDPR', 'SOC2', 'PCI DSS', 'HIPAA'] }
      ],
      examples: ['Run quick security scan', 'Perform GDPR compliance check', 'Conduct penetration testing']
    }
  ]);

  const filteredCommands = React.useMemo(() => {
    if (filterCategory === 'all') return commands;
    return commands.filter(cmd => cmd.category === filterCategory);
  }, [commands, filterCategory]);

  const handleCreateCommand = () => {
    const newCommand: AgentCommand = {
      id: Date.now().toString(),
      name: 'New Command',
      description: 'Custom command created by user',
      category: 'general',
      shortcut: '',
      icon: 'MoreHorizontal',
      parameters: []
    };
    onCommandCreate?.(newCommand);
    setShowCreateModal(false);
  };

  const handleUpdateCommand = (command: AgentCommand) => {
    onCommandUpdate?.(command);
    setEditingCommand(null);
  };

  const handleDeleteCommand = (commandId: string) => {
    onCommandDelete?.(CommandId);
  };

  const handleExecuteCommand = (command: AgentCommand) => {
    // This would integrate with the AI router to execute the command
    console.log('Executing command:', command.name);
    // In a real implementation, this would call the AI API
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Commands</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {commands.length} Commands
            </Badge>
            {agentId && (
              <Badge variant="default">
                Active Agent: {agentId}
              </Badge>
            )}
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Command
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as any)}>
            <SelectTrigger>
              {filterCategory === 'all' ? 'All Commands' : filterCategory}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Commands</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Command Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommands.map((command) => (
          <Card key={command.id} className="hover:shadow-lg transition-all">
            <Card.Header className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {getCommandIcon(command.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{command.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {command.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {command.shortcut && (
                    <kbd className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-300 dark:border-slate-600">
                      {command.shortcut}
                    </kbd>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleUpdateCommand(command)}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCommand(command.id)}>
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {command.description}
              </p>
              
              {command.parameters.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Parameters</h4>
                  <div className="space-y-2">
                    {command.parameters.map((param, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {param.name}
                          </span>
                          {param.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {param.type === 'select' ? (
                            <Select defaultValue={param.options?.[0]}>
                              {param.options?.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </Select>
                          ) : param.type === 'boolean' ? (
                            <Switch defaultChecked={param.default} />
                          ) : (
                            <Input 
                              type={param.type}
                              placeholder={param.description}
                              defaultValue={param.default}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {command.examples.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Examples</h4>
                  <div className="space-y-2">
                    {command.examples.map((example, index) => (
                      <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <Button 
                  variant="default" 
                  onClick={() => handleExecuteCommand(command)}
                  disabled={!agentId}
                >
                  Execute Command
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Create Command Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <Card.Header>
              <h3 className="text-xl font-bold text-white">Create New Command</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white">Command Name</label>
                <Input placeholder="Enter command name..." />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white">Description</label>
                <Textarea 
                  placeholder="Describe what this command does..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white">Category</label>
                <Select defaultValue="general">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCommand}>
                  Create Command
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
}

function getCommandIcon(category: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    business: <FileText className="h-5 w-5" />,
    technical: <Code className="h-5 w-5" />,
    creative: <Zap className="h-5 w-5" />,
    analysis: <RotateCw className="h-5 w-5" />,
    general: <MoreHorizontal className="h-5 w-5" />
  };
  
  return iconMap[category] || <MoreHorizontal className="h-5 w-5" />;
}
