'use client';

import * as React from 'react';
import { Send, Bot, User, Settings, MessageSquare, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Card } from '@/components/ui';
import { Input } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import { Avatar, AvatarFallback } from '@/components/ui';
import { Separator } from '@/components/ui';
import type { Agent, AgentMessage, AgentSession } from './types';

interface ChatAgentProps {
  agent: Agent;
  onMessageSend?: (message: string) => void;
  onSessionStart?: (agentId: string) => void;
  onSessionEnd?: (sessionId: string) => void;
  className?: string;
}

export function ChatAgent({ agent, onMessageSend, onSessionStart, onSessionEnd, className }: ChatAgentProps) {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<AgentMessage[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [session, setSession] = React.useState<AgentSession | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Simulate initial greeting when agent becomes active
    if (agent.status === 'active' && messages.length === 0) {
      const greeting = generateAgentGreeting(agent);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: agent.id,
        content: greeting,
        type: 'agent',
        timestamp: new Date(),
        metadata: { isGreeting: true }
      }]);
    }
  }, [agent.status, agent.id]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      agentId: agent.id,
      content: message,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = generateAgentResponse(agent, message);
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
      onMessageSend?.(message);
    }, 1000 + Math.random() * 2000);
  };

  const startSession = () => {
    const newSession: AgentSession = {
      id: Date.now().toString(),
      agentId: agent.id,
      userId: 'current-user', // Would come from auth context
      startedAt: new Date(),
      messages: [],
      status: 'active',
      context: {}
    };
    setSession(newSession);
    onSessionStart?.(agent.id);
  };

  const endSession = () => {
    if (session) {
      setSession(prev => ({ ...prev, status: 'ended' }));
      onSessionEnd?.(session.id);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 ${className || ''}`}>
      {/* Agent Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              <Bot className="h-6 w-6 text-blue-500" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{agent.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {agent.type} Agent • {agent.model}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
              {agent.status}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => agent.status === 'active' ? endSession() : startSession()}
            >
              {agent.status === 'active' ? 'End Session' : 'Start Session'}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Capabilities */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Capabilities</h4>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((capability) => (
            <Badge key={capability.id} variant="outline" className="text-xs">
              {capability.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                }`}
              >
                {msg.type === 'user' ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-blue-500" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.metadata?.isGreeting && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Zap className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-blue-500" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          <Input
            placeholder={`Message ${agent.name}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function generateAgentGreeting(agent: Agent): string {
  const greetings = {
    chat: `Hello! I'm ${agent.name}, your AI assistant. I'm here to help you build your digital business. What would you like to work on today?`,
    command: `${agent.name} ready. I can execute commands, analyze data, and automate tasks. What's your first objective?`,
    analysis: `Hi! I'm ${agent.name}, your business analyst. I can help with market research, competitive analysis, and opportunity identification. Ready to dive deep into your business challenges.`,
    creative: `Hey! I'm ${agent.name}, your creative partner. I can help with content creation, design, and innovative solutions for your digital business. Let's create something amazing together!`,
    strategic: `Greetings! I'm ${agent.name}, your strategic advisor. I specialize in business planning, market positioning, and growth strategies. I'll help you make data-driven decisions for your entrepreneurial journey.`
  };
  
  return greetings[agent.type as keyof typeof greetings] || greetings.chat;
}

function generateAgentResponse(agent: Agent, userMessage: string): AgentMessage {
  const responses = {
    chat: [
      `I understand you want to ${userMessage.toLowerCase().includes('help') ? 'get help with' : 'work on'} that. Let me break this down into actionable steps for your digital business.`,
      `Great question! Based on your input, I recommend focusing on ${getRandomBusinessArea()}. This aligns with your current business stage and has the highest ROI potential right now.`,
      `I've analyzed your request. Here are three strategic approaches you can take: 1) Quick win implementation, 2) Long-term strategic play, or 3) Resource optimization. Which interests you most?`
    ],
    command: [
      `Command received: "${userMessage}". Processing...`,
      `Executing: ${userMessage}. This may take a few moments to complete.`,
      `Task completed: ${userMessage}. Results: ${generateMockResult()}. Ready for next command.`
    ],
    analysis: [
      `Analyzing business implications of "${userMessage}"...`,
      `Market analysis shows this opportunity has ${Math.floor(Math.random() * 50 + 50)}% validation score.`,
      `Competitive landscape indicates ${Math.floor(Math.random() * 5 + 1)} main competitors in this space.`,
      `Recommendation: Proceed with ${getRandomStrategy()} approach for optimal results.`
    ],
    creative: [
      `That's an interesting creative challenge! Let me brainstorm some innovative approaches for "${userMessage}".`,
      `I'm seeing ${Math.floor(Math.random() * 3 + 2)} potential creative directions we could explore.`,
      `My top recommendation: ${getRandomCreativeIdea()} - this has strong viral potential and aligns with current market trends.`
    ],
    strategic: [
      `Strategic analysis of "${userMessage}" initiated...`,
      `SWOT analysis reveals: Strengths in ${getRandomBusinessArea()}, Opportunities in emerging markets, but Threats from established competitors.`,
      `Recommended strategic pivot: Focus on ${getRandomStrategicFocus()} while maintaining core business value proposition.`
    ]
  };

  return {
    id: Date.now().toString(),
    agentId: agent.id,
    content: responses[agent.type as keyof typeof responses][Math.floor(Math.random() * responses[agent.type as keyof typeof responses].length)],
    type: 'agent',
    timestamp: new Date(),
    metadata: { responseCategory: getRandomResponseCategory() }
  };
}

function getRandomBusinessArea(): string {
  const areas = ['content marketing', 'SaaS development', 'affiliate marketing', 'digital products', 'online courses', 'automation systems', 'marketplace strategy'];
  return areas[Math.floor(Math.random() * areas.length)];
}

function getRandomStrategy(): string {
  const strategies = ['blue ocean strategy', 'first-mover advantage', 'cost leadership', 'differentiation focus', 'market penetration', 'niche domination'];
  return strategies[Math.floor(Math.random() * strategies.length)];
}

function getRandomCreativeIdea(): string {
  const ideas = [
    'AI-powered content automation system',
    'Interactive business plan generator',
    'Personalized entrepreneurship curriculum',
    'Multi-platform brand management tool',
    'Real-time market opportunity scanner'
  ];
  return ideas[Math.floor(Math.random() * ideas.length)];
}

function getRandomStrategicFocus(): string {
  const focuses = ['customer acquisition', 'product innovation', 'operational efficiency', 'strategic partnerships', 'brand positioning', 'revenue optimization'];
  return focuses[Math.floor(Math.random() * focuses.length)];
}

function getRandomResponseCategory(): string {
  const categories = ['actionable', 'analytical', 'creative', 'strategic'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function generateMockResult(): string {
  const results = [
    'Successfully optimized workflow efficiency by 35%',
    'Identified 3 new revenue opportunities',
    'Reduced operational costs by $2,500/month',
    'Improved customer acquisition by 150%',
    'Generated 12 actionable business insights'
  ];
  return results[Math.floor(Math.random() * results.length)];
}
