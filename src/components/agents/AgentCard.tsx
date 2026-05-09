'use client';

import * as React from 'react';
import { Bot, User, Settings, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Avatar, AvatarFallback } from '@/components/ui';
import { Button } from '@/components/ui';
import type { Agent } from './types';

interface AgentCardProps {
  agent: Agent;
  isActive?: boolean;
  onActivate?: (agentId: string) => void;
  onDeactivate?: (agentId: string) => void;
  onConfigure?: (agentId: string) => void;
  onEdit?: (agentId: string) => void;
  onDelete?: (agentId: string) => void;
  className?: string;
}

export function AgentCard({ 
  agent, 
  isActive, 
  onActivate, 
  onDeactivate, 
  onConfigure, 
  onEdit, 
  onDelete, 
  className 
}: AgentCardProps) {
  return (
    <Card className={`transition-all hover:shadow-lg ${
      isActive ? 'ring-2 ring-blue-500' : ''
    } ${className || ''}`}>
      <Card.Header className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {agent.type === 'chat' ? (
                  <Bot className="h-6 w-6 text-blue-500" />
                ) : agent.type === 'analysis' ? (
                  <User className="h-6 w-6 text-green-500" />
                ) : agent.type === 'creative' ? (
                  <MoreVertical className="h-6 w-6 text-purple-500" />
                ) : (
                  <Settings className="h-6 w-6 text-orange-500" />
                )}
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
              variant={agent.status === 'active' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {agent.status}
            </Badge>
            <div className="flex items-center gap-1">
              {agent.model && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {agent.model}
                </span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {agent.provider}
              </span>
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {/* Capabilities */}
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Capabilities</h4>
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.map((capability) => (
                <Badge 
                  key={capability.id} 
                  variant={capability.enabled ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {capability.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {new Date(agent.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last Active</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {agent.lastActive ? new Date(agent.lastActive).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Description</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {agent.type === 'chat' && 'AI-powered conversational assistant for business guidance and support.'}
              {agent.type === 'analysis' && 'Business analyst agent for market research and competitive analysis.'}
              {agent.type === 'creative' && 'Creative partner for content creation, design, and innovative solutions.'}
              {agent.type === 'command' && 'Command execution agent for automating tasks and workflows.'}
              {agent.type === 'strategic' && 'Strategic advisor for business planning and growth strategies.'}
            </p>
          </div>
        </div>
      </Card.Content>
      <Card.Footer className="pt-3">
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            {!isActive ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onActivate?.(agent.id)}
              >
                Activate
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDeactivate?.(agent.id)}
              >
                Deactivate
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onConfigure?.(agent.id)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit?.(agent.id)}
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete?.(agent.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
}
