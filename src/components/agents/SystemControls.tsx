'use client';

import * as React from 'react';
import { Settings, Shield, AlertTriangle, Activity, Download, Upload, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Progress } from '@/components/ui';
import { Separator } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui';
import { Label } from '@/components/ui';
import { Switch } from '@/components/ui';
import type { Agent, TemplateGalleryIntegration } from './types';

interface SystemControlsProps {
  agents: Agent[];
  templateGallery: TemplateGalleryIntegration;
  onSystemStatusCheck?: () => void;
  onSecurityAudit?: () => void;
  onBackupData?: () => void;
  onPerformanceAnalysis?: () => void;
  onSystemOptimization?: () => void;
  className?: string;
}

export function SystemControls({ agents, templateGallery, onSystemStatusCheck, onSecurityAudit, onBackupData, onPerformanceAnalysis, onSystemOptimization, className }: SystemControlsProps) {
  const [systemStatus, setSystemStatus] = React.useState({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 'good',
    apiResponseTime: 120,
    uptime: '99.9%'
  });

  const [securityStatus, setSecurityStatus] = React.useState({
    vulnerabilities: 0,
    lastScan: new Date(),
    threatsBlocked: 0,
    complianceScore: 92
  });

  const [performanceMetrics, setPerformanceMetrics] = React.useState({
    avgResponseTime: 850,
    requestsPerMinute: 45,
    errorRate: 0.2,
    uptime: '99.9%'
  });

  const getSystemHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getSystemHealthIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Activity className="h-4 w-4" />;
      case 'good': return <RefreshCw className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <Shield className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Controls</h2>
        <Badge variant="outline">
          {agents.length} Active Agents
        </Badge>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">CPU Usage</p>
                  <div className="flex items-center gap-2">
                    <Progress value={systemStatus.cpu} max={100} className="w-full" />
                    <span className="text-sm text-slate-900 dark:text-white">{systemStatus.cpu}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Memory Usage</p>
                  <div className="flex items-center gap-2">
                    <Progress value={systemStatus.memory} max={100} className="w-full" />
                    <span className="text-sm text-slate-900 dark:text-white">{systemStatus.memory}%</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Disk Usage</p>
                  <div className="flex items-center gap-2">
                    <Progress value={systemStatus.disk} max={100} className="w-full" />
                    <span className="text-sm text-slate-900 dark:text-white">{systemStatus.disk}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Network Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSystemHealthColor(systemStatus.network)}`}>
                      {getSystemHealthIcon(systemStatus.network)}
                    </div>
                    <span className="text-sm text-slate-900 dark:text-white">{systemStatus.network}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">API Response Time</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{systemStatus.apiResponseTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Uptime</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{systemStatus.uptime}</p>
                </div>
              </div>
            </div>
            </div>
          </Card.Content>
        </Card>

        {/* Security Status */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Vulnerabilities</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{securityStatus.vulnerabilities}</p>
                </div>
                <Button variant="outline" size="sm" onClick={onSecurityAudit}>
                  Run Audit
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Threats Blocked</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{securityStatus.threatsBlocked}</p>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Compliance Score</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{securityStatus.complianceScore}/100</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Last Scan</p>
                  <p className="text-sm text-slate-900 dark:text-white">{new Date(securityStatus.lastScan).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            </div>
          </Card.Content>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{performanceMetrics.avgResponseTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Requests/Min</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{performanceMetrics.requestsPerMinute}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Error Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{performanceMetrics.errorRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{(100 - performanceMetrics.errorRate).toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={onPerformanceAnalysis}>
                  <Activity className="h-4 w-4" />
                  Analyze Performance
                </Button>
                <Button variant="outline" onClick={onSystemOptimization}>
                  <Settings className="h-4 w-4" />
                  Optimize System
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Template Gallery Integration */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              Template Gallery
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connection Status</p>
                  <Badge variant={templateGallery.connected ? 'default' : 'secondary'}>
                    {templateGallery.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                  Sync Templates
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Templates Available</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{templateGallery.templateCount}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Download Templates
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Last Sync</p>
                  <p className="text-sm text-slate-900 dark:text-white">
                    {templateGallery.lastSync ? new Date(templateGallery.lastSync).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Gallery
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Agent Management */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Agent Management
            </h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Agents</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{agents.filter(a => a.status === 'active').length}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">Idle Agents</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{agents.filter(a => a.status === 'idle').length}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Commands Executed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">1,247</p>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline">
                  <Database className="h-4 w-4" />
                  Agent Analytics
                </Button>
                <Button variant="outline">
                  <Activity className="h-4 w-4" />
                  Agent Logs
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={onSystemStatusCheck}>
                <RefreshCw className="h-4 w-4" />
                Check System Status
              </Button>
              <Button variant="outline" onClick={onBackupData}>
                <Download className="h-4 w-4" />
                Backup All Data
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4" />
                Restore Backup
              </Button>
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4" />
                Emergency Restart
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
