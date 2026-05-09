'use client';

import * as React from 'react';
import { AgentCommandCenter } from '@/components/agents';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function AgentsPage() {
  return (
    <DashboardShell>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Agent Command Center</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage your AI agents, execute commands, and access the template gallery for complete digital entrepreneurship workflow.
          </p>
        </div>
        
        <AgentCommandCenter
          onAgentCreate={(agent) => console.log('Agent created:', agent)}
          onAgentUpdate={(agent) => console.log('Agent updated:', agent)}
          onAgentDelete={(agentId) => console.log('Agent deleted:', agentId)}
          onCommandExecute={(command, params) => console.log('Command executed:', command, params)}
          onTemplateUse={(templateId) => console.log('Template used:', templateId)}
        />
      </div>
    </DashboardShell>
  );
}
