"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui"
import { Badge } from "@/components/ui"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui"
import { Search, Download, Filter, Grid, List, Star, Clock, CheckCircle } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  author: string
  updatedAt: string
  downloads: number
  rating: number
  features: string[]
}

export const TemplateGallery = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const templates: Template[] = [
    {
      id: "1",
      name: "Business Plan Pro",
      description: "Comprehensive business plan template with financial projections",
      category: "startup",
      difficulty: "Advanced",
      tags: ["finance", "strategy", "comprehensive"],
      author: "FoundryAI Team",
      updatedAt: new Date().toISOString(),
      downloads: 1250,
      rating: 4.8,
      features: ["Financial Projections", "Market Analysis", "Executive Summary", "Risk Assessment"]
    },
    {
      id: "2",
      name: "Lean Startup Canvas",
      description: "Minimal viable product template for early-stage startups",
      category: "startup",
      difficulty: "Beginner",
      tags: ["lean", "mvp", "validation"],
      author: "FoundryAI Team",
      updatedAt: new Date().toISOString(),
      downloads: 890,
      rating: 4.6,
      features: ["Value Proposition", "Customer Segments", "Key Metrics", "Unique Channels"]
    }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleTemplateDownload = (templateId: string) => {
    console.log("Downloading template:", templateId)
  }

  const handleTemplateUse = (templateId: string) => {
    console.log("Using template:", templateId)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Template Gallery</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Discover and use AI-powered templates to accelerate your business development
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Search & Filter</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  Category
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[180px]">
                  Level
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {filteredTemplates.length} templates found
        </p>
      </div>

      {/* Template Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{template.description}</p>
                </div>
                <Badge variant="secondary">{template.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Features</h4>
                <div className="space-y-1">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">by {template.author}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateDownload(template.id);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateUse(template.id);
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TemplateGallery
