import { Card, CardContent } from '@/components/ui/Card';
import { Loader2, Sparkles, Layers, Zap, Target, TrendingUp, Gem } from 'lucide-react';

interface RefinementLoadingStateProps {
  iteration: number;
}

export function RefinementLoadingState({ iteration }: RefinementLoadingStateProps) {
  const iterationDescriptions = [
    {
      title: "Expanding Detail & Depth",
      description: "Adding specific examples, implementation notes, and edge cases...",
      icons: [Layers, Sparkles, Zap],
    },
    {
      title: "Deepening Technical Architecture",
      description: "Crafting database schemas, API endpoints, and component hierarchies...",
      icons: [Target, Layers, Zap],
    },
    {
      title: "Enhancing User Experience",
      description: "Designing user flows, wireframes, and interaction patterns...",
      icons: [Sparkles, Target, Layers],
    },
    {
      title: "Strengthening Monetization",
      description: "Analyzing pricing psychology, cohorts, and growth tactics...",
      icons: [TrendingUp, Target, Sparkles],
    },
    {
      title: "Masterclass Level Detail",
      description: "Adding competitive moats, technical debt management, and scaling strategies...",
      icons: [Gem, TrendingUp, Target],
    },
  ];

  const currentIteration = iterationDescriptions[Math.min(iteration - 1, 4)] || iterationDescriptions[4];

  return (
    <Card className="border-violet-200 shadow-lg shadow-violet-500/10">
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-xl opacity-30 rounded-full animate-pulse" />
            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-violet-600">{iteration}</span>
            </div>
          </div>

          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-700 bg-clip-text text-transparent">
              {currentIteration.title}
            </h3>
            <p className="text-gray-600 max-w-md">
              {currentIteration.description}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-full text-sm text-violet-700">
              <Sparkles className="w-4 h-4" />
              Refinement Iteration #{iteration}
            </div>
          </div>

          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-center gap-4">
              {currentIteration.icons.map((Icon, index) => (
                <div 
                  key={index}
                  className="p-3 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-xl animate-pulse"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Icon className="w-6 h-6 text-violet-600" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse"
                  style={{ width: `${Math.min(iteration * 20, 100)}%` }}
                />
              </div>
              <p className="text-xs text-center text-gray-500">
                Building a meticulously-crafted, comprehensive masterpiece...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Very Well Planned</p>
              <p className="text-gray-500">Structure & Logic</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Very Well Designed</p>
              <p className="text-gray-500">Visual & UX</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Very Well Crafted</p>
              <p className="text-gray-500">Detail & Polish</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
