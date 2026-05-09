'use client';

import * as React from 'react';
import { Search, Filter, Download, Trash2, Archive, Eye, EyeOff, MessageSquare, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui';
import { Avatar, AvatarFallback } from '@/components/ui';
import { Separator } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import type { AgentMessage, AgentSession } from './types';

interface AgentHistoryProps {
  sessions: AgentSession[];
  onSessionSelect?: (sessionId: string) => void;
  onSessionDelete?: (sessionId: string) => void;
  onSessionExport?: (sessionId: string) => void;
  className?: string;
}

export function AgentHistory({ sessions, onSessionSelect, onSessionDelete, onSessionExport, className }: AgentHistoryProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedSessions, setSelectedSessions] = React.useState<string[]>([]);

  const filteredSessions = React.useMemo(() => {
    let filtered = sessions;
    
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.messages.some(msg => 
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (filterType !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filterType) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(session => 
        new Date(session.startedAt) >= filterDate
      );
    }
    
    return filtered;
  }, [sessions, searchTerm, filterType]);

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
    onSessionSelect?.(sessionId);
  };

  const handleSessionDelete = (sessionId: string) => {
    onSessionDelete?.(sessionId);
    setSelectedSessions(prev => prev.filter(id => id !== sessionId));
  };

  const getSessionStats = () => {
    const totalSessions = sessions.length;
    const totalMessages = sessions.reduce((acc, session) => acc + session.messages.length, 0);
    const avgMessagesPerSession = totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0;
    
    return {
      totalSessions,
      totalMessages,
      avgMessagesPerSession
    };
  };

  const formatSessionDuration = (startedAt: Date, messages: AgentMessage[]) => {
    if (messages.length === 0) return '0 min';
    
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    const duration = lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    
    if (minutes < 60) return `${minutes} min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
    return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Agent History</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {getSessionStats().totalSessions} sessions • {getSessionStats().totalMessages} messages
          </div>
          <Badge variant="outline">
            {getSessionStats().avgMessagesPerSession} avg msgs/session
          </Badge>
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
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                <SelectTrigger>
                  {filterType === 'all' ? 'All Time' : filterType}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Session List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card 
            key={session.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedSessions.includes(session.id) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleSessionSelect(session.id)}
          >
            <Card.Header className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Session {session.id.slice(-8)}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(session.startedAt).toLocaleDateString()} • {formatSessionDuration(session.startedAt, session.messages)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                    {session.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSessionDelete(session.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card.Header>
            
            <Card.Content>
              <div className="space-y-3">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {session.messages.length} messages
                </div>
                
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {session.messages.slice(-3).map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex gap-3 p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-slate-50 dark:bg-slate-800' 
                            : 'bg-blue-50 dark:bg-blue-900'
                        }`}
                      >
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          {message.type === 'user' ? (
                            <AvatarFallback>
                              <User className="h-4 w-4 text-slate-600" />
                            </AvatarFallback>
                          ) : (
                            <AvatarFallback>
                              <MessageSquare className="h-4 w-4 text-blue-500" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${
                            message.type === 'user' 
                              ? 'text-slate-900 dark:text-white' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {message.content}
                          </p>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {session.messages.length > 3 && (
                  <div className="text-center">
                    <Button variant="ghost" size="sm">
                      Show More Messages
                    </Button>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Export Options */}
      {selectedSessions.length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Export Options</h3>
          </Card.Header>
          <Card.Content>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Selected ({selectedSessions.length})
              </Button>
              <Button variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archive Selected
              </Button>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
