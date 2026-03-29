import { Card, CardContent } from '@/components/ui/Card';
import { Loader2, Sparkles, Lightbulb, Code, Rocket, Brain, TrendingUp, Wrench, DollarSign } from 'lucide-react';

export function LoadingState() {
  const steps = [
    { icon: Lightbulb, text: 'Extracting your idea...', color: 'text-amber-500', bgColor: 'bg-amber-100' },
    { icon: Brain, text: 'Generating tool concept...', color: 'text-violet-500', bgColor: 'bg-violet-100' },
    { icon: TrendingUp, text: 'Analyzing market research...', color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { icon: Wrench, text: 'Planning the tech stack...', color: 'text-cyan-500', bgColor: 'bg-cyan-100' },
    { icon: Code, text: 'Creating build steps...', color: 'text-emerald-500', bgColor: 'bg-emerald-100' },
    { icon: DollarSign, text: 'Crafting monetization...', color: 'text-green-500', bgColor: 'bg-green-100' },
  ];

  return (
    <Card className="border-border/50 shadow-xl bg-white/90 backdrop-blur-xl overflow-hidden">
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Animated Spinner */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-primary/20 blur-xl rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="relative p-5 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/30">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold gradient-text">
              Building Your Plan
            </h3>
            <p className="text-muted-foreground">
              FoundryAI is transforming your idea into an actionable blueprint...
            </p>
          </div>

          {/* Animated Steps */}
          <div className="w-full max-w-md space-y-3">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 transition-all duration-500"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 1,
                  transform: 'translateX(0)'
                }}
              >
                <div className={`p-2 ${step.bgColor} rounded-lg transition-all duration-300`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{step.text}</span>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-bounce"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary animate-[shimmer_2s_infinite]" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
