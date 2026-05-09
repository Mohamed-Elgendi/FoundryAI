import React from 'react';

export function Tier1FoundationPanel() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border border-slate-200 dark:border-slate-700">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Tier 1 Foundation Panel
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          This is the foundation panel for Tier 1 users, providing core business planning and foundational tools.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Business Plan Generator
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Generate comprehensive business plans with AI assistance
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Confidence Core
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Build and maintain unshakable confidence in business decisions
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Risk Assessment
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Evaluate and mitigate business risks automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tier1FoundationPanel;
