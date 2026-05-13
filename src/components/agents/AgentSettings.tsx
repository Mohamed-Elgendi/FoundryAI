'use client';

import * as React from 'react';
import { Save, X, Eye, EyeOff, Lock, Unlock, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui';
import { Separator } from '@/components/ui';
import { Slider } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Badge } from '@/components/ui';
import type { Agent, AgentCapability } from './types';

interface AgentSettingsProps {
  agent: Agent;
  onSave?: (agent: Agent) => void;
  onBack?: () => void;
  className?: string;
}

export function AgentSettings({ agent, onSave, onBack, className }: AgentSettingsProps) {
  const [settings, setSettings] = React.useState({
    name: agent.name,
    type: agent.type,
    model: agent.model || 'gpt-4',
    provider: agent.provider || 'openai',
    autoActivate: false,
    responseStyle: 'detailed',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: `You are ${agent.name}, a specialized ${agent.type} agent for the FoundryAI digital entrepreneurship platform. Your expertise is in ${agent.capabilities.map(c => c.name).join(', ')}. Help users build successful online businesses through structured guidance, analysis, and automation.`,
    customInstructions: '',
    privacyMode: 'standard',
    memoryEnabled: true,
    voiceEnabled: false,
    language: 'english',
    timezone: 'UTC'
  });

  const [hasChanges, setHasChanges] = React.useState(false);

  const handleSave = () => {
    const updatedAgent: Agent = {
      ...agent,
      name: settings.name,
      model: settings.model,
      provider: settings.provider,
      capabilities: agent.capabilities
    };
    onSave?.(updatedAgent);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings({
      ...settings,
      name: agent.name,
      type: agent.type,
      model: agent.model || 'gpt-4',
      provider: agent.provider || 'openai'
    });
    setHasChanges(false);
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Settings</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={hasChanges ? "default" : "outline"}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Basic Settings</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter agent name..."
              />
            </div>
            
            <div>
              <Label htmlFor="type">Agent Type</Label>
              <Select value={settings.type} onValueChange={(value) => setSettings(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  {settings.type}
                </SelectTrigger>
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
              <Label htmlFor="model">AI Model</Label>
              <Select value={settings.model} onValueChange={(value) => setSettings(prev => ({ ...prev, model: value }))}>
                <SelectTrigger>
                  {settings.model}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="claude-3.5-haiku">Claude 3.5 Haiku</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select value={settings.provider} onValueChange={(value) => setSettings(prev => ({ ...prev, provider: value }))}>
                <SelectTrigger>
                  {settings.provider}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                  <SelectItem value="together">Together AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Behavior Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Behavior</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="responseStyle">Response Style</Label>
              <Select value={settings.responseStyle} onValueChange={(value) => setSettings(prev => ({ ...prev, responseStyle: value }))}>
                <SelectTrigger>
                  {settings.responseStyle}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="step-by-step">Step-by-Step</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="temperature">Temperature ({settings.temperature})</Label>
              <Slider
                min={0}
                max={2}
                step={0.1}
                value={settings.temperature}
                onValueChange={(value) => setSettings(prev => ({ ...prev, temperature: value }))}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="maxTokens">Max Tokens ({settings.maxTokens})</Label>
              <Slider
                min={100}
                max={4000}
                step={100}
                value={settings.maxTokens}
                onValueChange={(value) => setSettings(prev => ({ ...prev, maxTokens: value }))}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoActivate"
                checked={settings.autoActivate}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoActivate: checked }))}
              />
              <Label htmlFor="autoActivate">Auto-activate on startup</Label>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Privacy & Security</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="memoryEnabled"
                checked={settings.memoryEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, memoryEnabled: checked }))}
              />
              <Label htmlFor="memoryEnabled">Enable conversation memory</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="voiceEnabled"
                checked={settings.voiceEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, voiceEnabled: checked }))}
              />
              <Label htmlFor="voiceEnabled">Enable voice input</Label>
            </div>

            <div>
              <Label htmlFor="privacyMode">Privacy Mode</Label>
              <Select value={settings.privacyMode} onValueChange={(value) => setSettings(prev => ({ ...prev, privacyMode: value }))}>
                <SelectTrigger>
                  {settings.privacyMode}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="enhanced">Enhanced</SelectItem>
                  <SelectItem value="incognito">Incognito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Advanced</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={settings.systemPrompt}
                onChange={(e) => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                placeholder="Define the agent's core behavior and expertise..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <div>
              <Label htmlFor="customInstructions">Custom Instructions</Label>
              <Textarea
                id="customInstructions"
                value={settings.customInstructions}
                onChange={(e) => setSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
                placeholder="Additional instructions for agent behavior..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  {settings.language}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  {settings.timezone}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                  <SelectItem value="CET">CET</SelectItem>
                  <SelectItem value="JST">JST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant={hasChanges ? "default" : "outline"}>
            {hasChanges ? "Unsaved Changes" : "All Settings Saved"}
          </Badge>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
