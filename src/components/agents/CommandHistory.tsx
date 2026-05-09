'use client';

import * as React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Download, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui';
import { Separator } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import type { AgentCommand } from './types';

interface CommandHistoryItem {
  id: string;
  command: string;
  agentId?: string;
  status: 'success' | 'error' | 'pending' | 'running';
  timestamp: Date;
  duration?: number;
  result?: any;
  error?: string;
  parameters?: Record<string, any>;
}

interface CommandHistoryProps {
  commands: CommandHistoryItem[];
  onCommandReExecute?: (commandId: string) => void;
  onCommandDelete?: (commandId: string) => void;
  onExportHistory?: () => void;
  className?: string;
}

export function CommandHistory({ commands, onCommandReExecute, onCommandDelete, onExportHistory, className }: CommandHistoryProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'success' | 'error' | 'pending' | 'running'>('all');
  const [selectedCommands, setSelectedCommands] = React.useState<string[]>([]);

  const filteredCommands = React.useMemo(() => {
    let filtered = commands;
    
    if (searchTerm) {
      filtered = filtered.filter(cmd => 
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.agentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(cmd => cmd.status === filterStatus);
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [commands, searchTerm, filterStatus]);

  const handleCommandSelect = (commandId: string) => {
    setSelectedCommands(prev => 
      prev.includes(commandId) 
        ? prev.filter(id => id !== commandId)
        : [...prev, commandId]
    );
  };

  const handleReExecute = (commandId: string) => {
    onCommandReExecute?.(commandId);
  };

  const handleDelete = (commandId: string) => {
    onCommandDelete?.(commandId);
    setSelectedCommands(prev => prev.filter(id => id !== commandId));
  };

  const getStatusIcon = (status: CommandHistoryItem['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: CommandHistoryItem['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      case 'running': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${Math.floor(duration / 1000)}s`;
    return `${Math.floor(duration / 60000)}m ${Math.floor((duration % 60000) / 1000)}s`;
  };

  const getCommandStats = () => {
    const totalCommands = commands.length;
    const successfulCommands = commands.filter(cmd => cmd.status === 'success').length;
    const errorCommands = commands.filter(cmd => cmd.status === 'error').length;
    const avgDuration = commands
      .filter(cmd => cmd.status === 'success' && cmd.duration)
      .reduce((acc, cmd) => acc + (cmd.duration || 0), 0) / 
      commands.filter(cmd => cmd.status === 'success' && cmd.duration).length;

    return {
      totalCommands,
      successfulCommands,
      errorCommands,
      successRate: totalCommands > 0 ? ((successfulCommands / totalCommands) * 100).toFixed(1) : '0',
      avgDuration: avgDuration || 0
    };
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Command History</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {getCommandStats().totalCommands} commands
          </div>
          <Badge variant={getCommandStats().successRate === '100.0' ? 'default' : 'outline'}>
            {getCommandStats().successRate}% success rate
          </Badge>
          <Button variant="outline" onClick={onExportHistory}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Search & Filter</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search commands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                <SelectTrigger>
                  {filterStatus === 'all' ? 'All Status' : filterStatus}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {getCommandStats().totalCommands}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Commands</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {getCommandStats().successfulCommands}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Successful</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {getCommandStats().errorCommands}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Failed</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatDuration(getCommandStats().avgDuration)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Duration</div>
          </Card.Content>
        </Card>
      </div>

      {/* Command List */}
      <div className="space-y-4">
        {filteredCommands.map((command) => (
          <Card 
            key={command.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCommands.includes(command.id) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleCommandSelect(command.id)}
          >
            <Card.Header className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(command.status)}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{command.command}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {command.agentId ? `Agent: ${command.agentId}` : 'System Command'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {command.status}
                  </Badge>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(command.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </Card.Header>
            
            <Card.Content>
              <div className="space-y-3">
                {/* Parameters */}
                {command.parameters && Object.keys(command.parameters).length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Parameters</h5>
                    <div className="space-y-2">
                      {Object.entries(command.parameters).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{key}</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result/Error */}
                {command.result && (
                  <div>
                    <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Result</h5>
                    <div className="p-3 bg-green-50 dark:bg-green-900 rounded border border-green-200 dark:border-green-700">
                      <pre className="text-sm text-green-800 dark:text-green-200 overflow-x-auto">
                        {JSON.stringify(command.result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {command.error && (
                  <div>
                    <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Error</h5>
                    <div className="p-3 bg-red-50 dark:bg-red-900 rounded border border-red-200 dark:border-red-700">
                      <p className="text-sm text-red-800 dark:text-red-200">{command.error}</p>
                    </div>
                  </div>
                )}

                {/* Duration */}
                {command.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Duration</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatDuration(command.duration)}
                    </span>
                  </div>
                )}
              </div>
            </Card.Content>
            
            <Card.Footer className="pt-3">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReExecute(command.id)}
                    disabled={command.status === 'running'}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Re-execute
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(command.command)}
                  >
                    Copy Command
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(command.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {/* Export Options */}
      {selectedCommands.length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Export Options</h3>
          </Card.Header>
          <Card.Content>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Selected ({selectedCommands.length})
              </Button>
              <Button variant="outline">
                Archive Selected
              </Button>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
