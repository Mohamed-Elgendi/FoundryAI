'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Zap,
  Building2,
  GraduationCap,
  Crown,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Brain,
  Shield,
  Heart,
  TrendingUp,
  Lightbulb,
  Award,
  BookOpen,
  Radar,
  Briefcase,
  Rocket,
  Wrench,
  Cpu,
  Compass,
  FileText,
  Coins,
  Wallet,
  Gift,
  Users,
  User,
} from 'lucide-react';

interface DashboardShellProps {
  user?: { name: string; email: string; role: string };
  onSignOut: () => void;
  children: ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tier 1 - Foundation', href: '/dashboard/tier1', icon: Brain },
  { name: 'Tier 2 - Intelligence', href: '/dashboard/tier2', icon: Lightbulb },
  { name: 'Tier 3 - Execution', href: '/dashboard/tier3', icon: Wrench },
  { name: 'Complete System', href: '/dashboard/complete', icon: Building2 },
];

const tierNavigation = [
  {
    id: 'tier1',
    name: 'Tier 1: Foundation',
    href: '/dashboard/tier1',
    icon: Shield,
    color: 'emerald',
    features: [
      { name: 'Brain Dump', href: '/dashboard/tier1/brain-dump', icon: Brain },
      { name: 'Distractions Killer', href: '/dashboard/tier1/focus', icon: Shield },
      { name: 'Emotion Controller', href: '/dashboard/tier1/emotion', icon: Heart },
      { name: 'Momentum Builder', href: '/dashboard/tier1/momentum', icon: TrendingUp },
      { name: 'Belief Architecture', href: '/dashboard/tier1/belief', icon: Lightbulb },
      { name: 'Confidence Core', href: '/dashboard/tier1/confidence', icon: Award },
    ]
  },
  {
    id: 'tier2',
    name: 'Tier 2: Intelligence',
    href: '/dashboard/tier2',
    icon: Radar,
    color: 'violet',
    features: [
      { name: 'Opportunity Radar', href: '/dashboard/tier2/radar', icon: Radar },
      { name: 'Idea Extraction', href: '/dashboard/tier2/ideas', icon: Lightbulb },
      { name: 'Template Gallery', href: '/dashboard/tier2/templates', icon: FileText },
    ]
  },
  {
    id: 'tier3',
    name: 'Tier 3: Build',
    href: '/dashboard/tier3',
    icon: Rocket,
    color: 'orange',
    features: [
      { name: 'AI Build Assistant', href: '/dashboard/tier3/assistant', icon: Cpu },
      { name: 'Workflow Engine', href: '/dashboard/tier3/workflows', icon: Wrench },
      { name: 'Tool Recommender', href: '/dashboard/tier3/tools', icon: Briefcase },
    ]
  },
  {
    id: 'tier4',
    name: 'Tier 4: Personal',
    href: '/dashboard/tier4',
    icon: Users,
    color: 'blue',
    features: [
      { name: 'Self Discovery', href: '/dashboard/tier4/discovery', icon: Compass },
      { name: 'Mindset Forge', href: '/dashboard/tier4/mindset', icon: Brain },
      { name: 'Productivity', href: '/dashboard/tier4/productivity', icon: Zap },
    ]
  },
  {
    id: 'tier5',
    name: 'Tier 5: Education',
    href: '/dashboard/tier5',
    icon: GraduationCap,
    color: 'cyan',
    features: [
      { name: 'Learning Paths', href: '/dashboard/tier5/paths', icon: BookOpen },
      { name: 'Skill Matrix', href: '/dashboard/tier5/skills', icon: Target },
      { name: 'Certifications', href: '/dashboard/tier5/certs', icon: Award },
    ]
  },
  {
    id: 'tier6',
    name: 'Tier 6: Monetize',
    href: '/dashboard/tier6',
    icon: Crown,
    color: 'amber',
    features: [
      { name: 'Memberships', href: '/dashboard/tier6/memberships', icon: Users },
      { name: 'Revenue Streams', href: '/dashboard/tier6/revenue', icon: Coins },
      { name: 'Affiliate Hub', href: '/dashboard/tier6/affiliate', icon: Gift },
    ]
  },
];

export function DashboardShell({ user, onSignOut, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<string[]>(['tier1']);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  const toggleTier = (tierId: string) => {
    setExpandedTiers(prev => 
      prev.includes(tierId) 
        ? prev.filter(id => id !== tierId)
        : [...prev, tierId]
    );
  };

  const getTierColor = (color: string, isActive: boolean, isExpanded: boolean) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      emerald: { 
        bg: isActive ? 'bg-emerald-50 dark:bg-emerald-900/20' : isExpanded ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : '',
        text: isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300',
        icon: isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500 dark:text-emerald-500/70'
      },
      violet: { 
        bg: isActive ? 'bg-violet-50 dark:bg-violet-900/20' : isExpanded ? 'bg-violet-50/50 dark:bg-violet-900/10' : '',
        text: isActive ? 'text-violet-700 dark:text-violet-300' : 'text-slate-600 dark:text-slate-300',
        icon: isActive ? 'text-violet-600 dark:text-violet-400' : 'text-violet-500 dark:text-violet-500/70'
      },
      orange: { 
        bg: isActive ? 'bg-orange-50 dark:bg-orange-900/20' : isExpanded ? 'bg-orange-50/50 dark:bg-orange-900/10' : '',
        text: isActive ? 'text-orange-700 dark:text-orange-300' : 'text-slate-600 dark:text-slate-300',
        icon: isActive ? 'text-orange-600 dark:text-orange-400' : 'text-orange-500 dark:text-orange-500/70'
      },
      blue: { 
        bg: isActive ? 'bg-blue-50 dark:bg-blue-900/20' : isExpanded ? 'bg-blue-50/50 dark:bg-blue-900/10' : '',
        text: isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-300',
        icon: isActive ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500 dark:text-blue-500/70'
      },
      cyan: { 
        bg: isActive ? 'bg-cyan-50 dark:bg-cyan-900/20' : isExpanded ? 'bg-cyan-50/50 dark:bg-cyan-900/10' : '',
        text: isActive ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-300',
        icon: isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-500 dark:text-cyan-500/70'
      },
      amber: { 
        bg: isActive ? 'bg-amber-50 dark:bg-amber-900/20' : isExpanded ? 'bg-amber-50/50 dark:bg-amber-900/10' : '',
        text: isActive ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300',
        icon: isActive ? 'text-amber-600 dark:text-amber-400' : 'text-amber-500 dark:text-amber-500/70'
      },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-800 
        border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
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

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Main Navigation
          </p>
          {navigation.map((item) => {
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

          {/* Tier Navigation with Dropdowns */}
          <p className="px-3 py-2 mt-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Tiers & Features
          </p>
          <div className="space-y-1">
            {tierNavigation.map((tier) => {
              const TierIcon = tier.icon;
              const isExpanded = expandedTiers.includes(tier.id);
              const isTierActive = isActive(tier.href);
              const colors = getTierColor(tier.color, isTierActive, isExpanded);
              
              return (
                <div key={tier.id} className="space-y-1">
                  {/* Tier Header - Clickable to expand/collapse */}
                  <button
                    onClick={() => toggleTier(tier.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${colors.bg} ${colors.text}
                      hover:opacity-80
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <TierIcon className={`w-5 h-5 ${colors.icon}`} />
                      <span className="text-left">{tier.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  
                  {/* Tier Features - Dropdown Menu */}
                  {isExpanded && (
                    <div className="ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                      {tier.features.map((feature) => {
                        const FeatureIcon = feature.icon;
                        const featureActive = isActive(feature.href);
                        return (
                          <Link
                            key={feature.name}
                            href={feature.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                              ${featureActive 
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }
                            `}
                          >
                            <FeatureIcon className={`w-4 h-4 ${featureActive ? colors.icon : ''}`} />
                            <span>{feature.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* User Section */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            {user && (
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            )}
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
