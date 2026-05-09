'use client';

import * as React from 'react';

interface DashboardContextType {
  user: {
    name: string;
    role: string;
  } | null;
  setUser: (user: DashboardContextType['user']) => void;
}

const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<DashboardContextType['user']>(null);

  return (
    <DashboardContext.Provider value={{ user, setUser }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
