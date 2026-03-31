'use client';

import { createContext, useContext, ReactNode } from 'react';

interface DashboardContextType {
  isLoading: boolean;
  refreshData: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const refreshData = () => {
    // Refresh data implementation
    console.log('Refreshing dashboard data...');
  };

  return (
    <DashboardContext.Provider value={{ isLoading: false, refreshData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
