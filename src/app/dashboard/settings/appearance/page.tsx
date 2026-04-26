'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Appearance</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Customize how FoundryAI looks for you
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="flex flex-col items-center gap-2 h-auto py-4 relative"
            >
              <Sun className="w-6 h-6" />
              <span>Light</span>
              {theme === 'light' && <Check className="w-4 h-4 absolute top-2 right-2" />}
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="flex flex-col items-center gap-2 h-auto py-4 relative"
            >
              <Moon className="w-6 h-6" />
              <span>Dark</span>
              {theme === 'dark' && <Check className="w-4 h-4 absolute top-2 right-2" />}
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
              className="flex flex-col items-center gap-2 h-auto py-4 relative"
            >
              <Monitor className="w-6 h-6" />
              <span>System</span>
              {theme === 'system' && <Check className="w-4 h-4 absolute top-2 right-2" />}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accent Color</CardTitle>
            <CardDescription>Choose your accent color</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {['violet', 'blue', 'emerald', 'amber', 'rose'].map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full bg-${color}-500 hover:ring-2 ring-offset-2 ring-${color}-500 transition-all`}
                  onClick={() => console.log('Color selected:', color)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
