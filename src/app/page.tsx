'use client';

import { ThemeProvider } from '@/lib/theme/theme-context';
import { LandingPage } from './landing/LandingPage';

export default function Home() {
  return (
    <ThemeProvider>
      <LandingPage />
    </ThemeProvider>
  );
}
