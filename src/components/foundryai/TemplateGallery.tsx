'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, Code, Rocket, Zap, ShoppingBag, Heart, 
  GraduationCap, Briefcase, Gamepad2, Music, Camera, 
  Utensils, Dumbbell, Plane, Home, Car, X, Sparkles
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  input: string;
  color: string;
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Freelance Finance Tracker',
    description: 'Tool for freelancers to track income, expenses, and taxes',
    icon: Briefcase,
    category: 'Finance',
    input: "I want to build a tool that helps freelancers track their income and expenses. It should categorize transactions, calculate estimated taxes, generate invoices, and show monthly/yearly financial reports. The target users are independent contractors and freelancers who struggle with financial organization.",
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: '2',
    title: 'AI Meal Planner',
    description: 'Personalized meal planning with AI-generated recipes and grocery lists',
    icon: Utensils,
    category: 'Health',
    input: "An AI-powered meal planning app that creates personalized weekly meal plans based on dietary restrictions, calorie goals, and budget. It should generate shopping lists, suggest recipes using available ingredients, and track nutrition. Target users are busy professionals and health-conscious families.",
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: '3',
    title: 'Remote Team Standup Tool',
    description: 'Async daily standups for distributed teams',
    icon: Rocket,
    category: 'Productivity',
    input: "A tool for remote teams to do asynchronous daily standups. Team members record quick video or text updates, which are compiled into a digest for the team. It should integrate with Slack, track blockers automatically, and generate weekly summaries. Target is distributed engineering teams across time zones.",
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: '4',
    title: 'Pet Health Journal',
    description: 'Track pet health, vet visits, and medications',
    icon: Heart,
    category: 'Lifestyle',
    input: "A mobile-first app for pet owners to track their pet's health records, vet appointments, medications, vaccinations, and daily activities. Include reminders for meds, photo timeline, and shareable reports for vets. Target users are pet parents with senior pets or chronic conditions.",
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '5',
    title: 'Learning Path Generator',
    description: 'AI-curated learning paths for any skill',
    icon: GraduationCap,
    category: 'Education',
    input: "An AI-powered platform that generates personalized learning paths for any skill or topic. It aggregates free resources (YouTube, articles, courses), creates a structured curriculum with milestones, and tracks progress. Include community features for study groups. Target users are self-directed learners and career switchers.",
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '6',
    title: 'Micro-SaaS Pricing Calculator',
    description: 'Pricing strategy tool for bootstrapped founders',
    icon: Zap,
    category: 'Business',
    input: "A pricing calculator tool for micro-SaaS founders to determine optimal pricing tiers. It should analyze competitor pricing, calculate unit economics, suggest value-based pricing strategies, and generate pricing page copy. Include A/B testing guidance. Target is solo founders and indie hackers launching their first product.",
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '7',
    title: 'Local Event Discovery',
    description: 'Discover local events, meetups, and workshops',
    icon: Plane,
    category: 'Social',
    input: "An event discovery platform that aggregates local events from multiple sources (Eventbrite, Meetup, Facebook, local venues). Include personalized recommendations based on interests, friend activity, and past attendance. Target users are young professionals looking to socialize and network in their city.",
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: '8',
    title: 'Habit Accountability Bot',
    description: 'AI coach that keeps you accountable to habits',
    icon: Dumbbell,
    category: 'Productivity',
    input: "An AI accountability partner that helps users build and maintain habits. It checks in daily via chat, provides encouragement, analyzes patterns in failures, and adjusts strategies. Include streak tracking and small win celebrations. Target users are people who struggle with consistency in habits like exercise, reading, or meditation.",
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '9',
    title: 'Code Snippet Manager',
    description: 'Organize and share code snippets with AI tagging',
    icon: Code,
    category: 'Developer Tools',
    input: "A code snippet manager for developers with AI-powered auto-tagging, language detection, and description generation. Include syntax highlighting, team sharing, VS Code integration, and search by functionality. Target users are software engineers who collect and reuse code patterns.",
    color: 'from-slate-500 to-gray-500'
  },
  {
    id: '10',
    title: 'Plant Care Assistant',
    description: 'Identify plants and get care instructions',
    icon: Home,
    category: 'Lifestyle',
    input: "A plant care app that uses camera AI to identify houseplants and provide specific care instructions (watering schedule, light needs, fertilizer). Include reminders, disease diagnosis, and a community for trading plants. Target users are plant parents, especially beginners killing their plants.",
    color: 'from-green-600 to-lime-500'
  },
  {
    id: '11',
    title: 'Indie Game Discovery',
    description: 'Curated platform for indie games',
    icon: Gamepad2,
    category: 'Gaming',
    input: "A discovery platform for indie games with personalized recommendations, curator reviews, and dev diaries. Include a wishlist with price tracking, playtime estimates, and community reviews. Target users are gamers tired of AAA titles looking for unique indie experiences.",
    color: 'from-purple-500 to-fuchsia-500'
  },
  {
    id: '12',
    title: 'Musician Collab Platform',
    description: 'Find collaborators for music projects',
    icon: Music,
    category: 'Creative',
    input: "A platform for musicians to find collaborators based on skills, genre preferences, and availability. Include audio portfolio hosting, project management tools, and secure file sharing. Target users are independent musicians and producers looking for bandmates or session musicians.",
    color: 'from-amber-500 to-yellow-500'
  }
];

const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

interface TemplateGalleryProps {
  onSelect: (input: string) => void;
  isLoading: boolean;
}

export function TemplateGallery({ onSelect, isLoading }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSelect = (template: Template) => {
    onSelect(template.input);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
          className="gap-2 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
        >
          <Sparkles className="w-4 h-4" />
          Browse Template Gallery
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-border/50 shadow-xl bg-white/90 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Template Gallery</CardTitle>
              <p className="text-xs text-muted-foreground">
                Choose a pre-built idea to get started
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                disabled={isLoading}
                className="group relative p-4 rounded-xl border border-border/50 bg-white text-left transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
              >
                {/* Gradient Header */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${template.color} rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${template.color} bg-white/10`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {template.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {template.description}
                    </p>
                    <Badge variant="default" className="mt-2 text-[10px]">
                      {template.category}
                    </Badge>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {filteredTemplates.length} templates available
        </p>
      </CardContent>
    </Card>
  );
}
