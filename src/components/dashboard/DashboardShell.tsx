'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/layer-1-security/auth/auth-provider';
import {
  LayoutDashboard,
  Brain,
  Target,
  Zap,
  TrendingUp,
  GraduationCap,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Home,
  BarChart3,
  Award,
  Heart,
  Lightbulb,
  BookOpen,
  Coins,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Navigation structure
const navigation = {
  main: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ],
  tiers: [
    {
      id: 'tier1',
      name: 'Foundation',
      icon: Brain,
      color: 'blue',
      items: [
        { name: 'Belief Architecture', href: '/dashboard/tier1/belief', icon: Brain },
        { name: 'Mindset Forge', href: '/dashboard/tier1/mindset', icon: Target },
        { name: 'Confidence Core', href: '/dashboard/tier1/confidence', icon: Zap },
        { name: 'Brain Dump', href: '/dashboard/tier1/brain-dump', icon: Brain },
        { name: 'Emotion Tracker', href: '/dashboard/tier1/emotion', icon: Heart },
        { name: 'Focus Mode', href: '/dashboard/tier1/focus', icon: Target },
        { name: 'Journal', href: '/dashboard/tier1/journal', icon: BookOpen },
        { name: 'Momentum', href: '/dashboard/tier1/momentum', icon: TrendingUp },
      ]
    },
    {
      id: 'tier2',
      name: 'Intelligence',
      icon: Target,
      color: 'emerald',
      items: [
        { name: 'Ideas', href: '/dashboard/tier2/ideas', icon: Lightbulb },
        { name: 'Opportunities', href: '/dashboard/tier2/opportunities', icon: Target },
      ]
    },
    {
      id: 'tier3',
      name: 'Product Factory',
      icon: Zap,
      color: 'amber',
      items: [
        { name: 'Product Builder', href: '/dashboard/tier3', icon: Zap },
      ]
    },
    {
      id: 'tier4',
      name: 'Growth Engine',
      icon: TrendingUp,
      color: 'purple',
      items: [
        { name: 'Character Stats', href: '/dashboard/tier4/character-stats', icon: BarChart3 },
        { name: 'Productivity', href: '/dashboard/tier4/productivity', icon: Zap },
        { name: 'Self Discovery', href: '/dashboard/tier4/self-discovery', icon: User },
      ]
    },
    {
      id: 'tier5',
      name: 'Academy',
      icon: GraduationCap,
      color: 'pink',
      items: [
        { name: 'Gamification', href: '/dashboard/tier5/gamification', icon: Award },
        { name: 'Learning', href: '/dashboard/tier5/learning', icon: BookOpen },
        { name: 'Review', href: '/dashboard/tier5/review', icon: Star },
        { name: 'Skills', href: '/dashboard/tier5/skills', icon: Zap },
      ]
    },
    {
      id: 'tier6',
      name: 'Monetization',
      icon: DollarSign,
      color: 'orange',
      items: [
        { name: 'Affiliate', href: '/dashboard/tier6/affiliate', icon: DollarSign },
        { name: 'Coins', href: '/dashboard/tier6/coins', icon: Coins },
        { name: 'Credits', href: '/dashboard/tier6/credits', icon: CreditCard },
        { name: 'Membership', href: '/dashboard/tier6/membership', icon: Users },
        { name: 'Revenue', href: '/dashboard/tier6/revenue', icon: BarChart3 },
      ]
    },
  ],
  settings: [
    { name: 'Profile', href: '/dashboard/settings/profile', icon: User },
    { name: 'Account', href: '/dashboard/settings/account', icon: Shield },
    { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
    { name: 'Appearance', href: '/dashboard/settings/appearance', icon: Palette },
    { name: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
  ],
};

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<string[]>(['tier1']);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const toggleTier = (tierId: string) => {
    setExpandedTiers(prev => 
      prev.includes(tierId) 
        ? prev.filter(id => id !== tierId)
        : [...prev, tierId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      window.location.href = '/login';
    }
  };

  const getTierStyles = (color: string, isActive: boolean, isExpanded: boolean) => {
    const styles: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { 
        bg: isActive || isExpanded ? 'bg-blue-50 dark:bg-blue-900/20' : '', 
        text: isActive || isExpanded ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-300', 
        icon: 'text-blue-600 dark:text-blue-400' 
      },
      emerald: { 
        bg: isActive || isExpanded ? 'bg-emerald-50 dark:bg-emerald-900/20' : '', 
        text: isActive || isExpanded ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300', 
        icon: 'text-emerald-600 dark:text-emerald-400' 
      },
      amber: { 
        bg: isActive || isExpanded ? 'bg-amber-50 dark:bg-amber-900/20' : '', 
        text: isActive || isExpanded ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300', 
        icon: 'text-amber-600 dark:text-amber-400' 
      },
      purple: { 
        bg: isActive || isExpanded ? 'bg-purple-50 dark:bg-purple-900/20' : '', 
        text: isActive || isExpanded ? 'text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-300', 
        icon: 'text-purple-600 dark:text-purple-400' 
      },
      pink: { 
        bg: isActive || isExpanded ? 'bg-pink-50 dark:bg-pink-900/20' : '', 
        text: isActive || isExpanded ? 'text-pink-700 dark:text-pink-300' : 'text-slate-600 dark:text-slate-300', 
        icon: 'text-pink-600 dark:text-pink-400' 
      },
      orange: { 
        bg: isActive || isExpanded ? 'bg-orange-50 dark:bg-orange-900/20' : '', 
        text: isActive || isExpanded ? 'text-orange-700 dark:text-orange-300' : 'text-slate-600 dark:text-slate-300', 
        icon: 'text-orange-600 dark:text-orange-400' 
      },
    };
    return styles[color] || styles.blue;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">FoundryAI</span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 
        bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">FoundryAI</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Main Navigation */}
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Main
          </p>
          {navigation.main.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active 
                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-violet-600 dark:text-violet-400' : ''}`} />
                {item.name}
              </Link>
            );
          })}

          {/* Tiers */}
          <p className="px-3 py-2 mt-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Platform Tiers
          </p>
          <div className="space-y-1">
            {navigation.tiers.map((tier) => {
              const TierIcon = tier.icon;
              const isExpanded = expandedTiers.includes(tier.id);
              const isTierActive = isActive(`/dashboard/${tier.id}`);
              const styles = getTierStyles(tier.color, isTierActive, isExpanded);
              
              return (
                <div key={tier.id} className="space-y-1">
                  <button
                    onClick={() => toggleTier(tier.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${styles.bg} ${styles.text}
                      hover:opacity-80
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <TierIcon className={`w-5 h-5 ${styles.icon}`} />
                      <span className="text-left">{tier.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                      {tier.items.map((item) => {
                        const ItemIcon = item.icon;
                        const itemActive = isActive(item.href);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                              ${itemActive 
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }
                            `}
                          >
                            <ItemIcon className={`w-4 h-4 ${itemActive ? styles.icon : ''}`} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Settings */}
          <p className="px-3 py-2 mt-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Settings
          </p>
          <div className="space-y-1">
            <button
              onClick={() => setSettingsExpanded(!settingsExpanded)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${settingsExpanded || isActive('/dashboard/settings')
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span>Control Panel</span>
              </div>
              {settingsExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
            
            {settingsExpanded && (
              <div className="ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                {navigation.settings.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                        ${active 
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.email || 'User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.user_metadata?.tier || 'Free Tier'}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
