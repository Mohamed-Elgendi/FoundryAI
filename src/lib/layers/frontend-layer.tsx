/**
 * Layer 9: Frontend UI Layer with Analytical Dashboard Shell
 * Dashboard layout, navigation, routing, real-time updates
 */

'use client';

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Radar, 
  FileText, 
  Settings, 
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Navigation items
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  requiredPermission?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'plan', label: 'Plan Your Idea', icon: Lightbulb, href: '/plan' },
  { id: 'radar', label: 'Opportunity Radar', icon: Radar, href: '/radar' },
  { id: 'plans', label: 'My Plans', icon: FileText, href: '/plans' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

// Dashboard context
interface DashboardContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  autoDismiss?: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

// Dashboard provider
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotification, ...prev]);

    if (notification.autoDismiss) {
      setTimeout(() => {
        dismissNotification(newNotification.id);
      }, 5000);
    }
  }, [dismissNotification]);

  return (
    <DashboardContext.Provider
      value={{
        currentView,
        setCurrentView,
        sidebarOpen,
        setSidebarOpen,
        notifications,
        addNotification,
        dismissNotification,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// Dashboard shell component
interface DashboardShellProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onSignOut?: () => void;
}

export function DashboardShell({ children, user, onSignOut }: DashboardShellProps) {
  const { sidebarOpen, setSidebarOpen, notifications, dismissNotification } = useDashboard();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo - Clickable */}
        <Link href="/dashboard" className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-slate-900 dark:text-white">FoundryAI</span>
            )}
          </div>
        </Link>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200",
                  !sidebarOpen && "justify-center"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-400 text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onSignOut}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors",
                !sidebarOpen && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {/* Top header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="font-semibold text-slate-900 dark:text-white">
              {NAV_ITEMS.find(i => pathname === i.href || pathname.startsWith(i.href + '/'))?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle variant="ghost" />
            
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>

            {/* User */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Notifications overlay */}
      <div className="fixed top-20 right-6 z-50 space-y-2 w-80">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "p-4 rounded-lg shadow-lg border animate-in slide-in-from-right",
              notification.type === 'success' && "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
              notification.type === 'error' && "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300",
              notification.type === 'warning' && "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
              notification.type === 'info' && "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="opacity-60 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Page layout components
export function PageHeader({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description?: string; 
  action?: ReactNode 
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Card({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <div className={cn("bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  change?: string; 
  icon: React.ComponentType<{ className?: string }> 
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">{change}</p>
          )}
        </div>
        <div className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
          <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
      </div>
    </Card>
  );
}
