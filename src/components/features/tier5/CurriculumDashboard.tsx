'use client';

import { useState } from 'react';
import { useCurriculum } from '@/hooks/useCurriculum';
import { BookOpen, Play, CheckCircle, Clock, Award, ChevronRight, Plus, Sparkles } from 'lucide-react';

interface CurriculumDashboardProps {
  userId: string;
}

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-purple-100 text-purple-800' }
];

const POPULAR_TOPICS = [
  'AI for Business',
  'Digital Marketing',
  'Product Development',
  'Revenue Growth',
  'Personal Branding',
  'E-commerce Mastery'
];

export function CurriculumDashboard({ userId }: CurriculumDashboardProps) {
  const { curricula, currentCurriculum, loading, error, generateCurriculum, selectCurriculum } = useCurriculum(userId);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  if (loading) {
    return (
      <div className="curriculum-loading p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="curriculum-error p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    await generateCurriculum(selectedTopic, selectedLevel);
    setShowGenerateModal(false);
    setSelectedTopic('');
  };

  return (
    <div className="curriculum-dashboard space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          AI Curriculum Engine
        </h2>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Generate Curriculum
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-blue-900">Total Courses</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{curricula.length}</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-green-900">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {curricula.filter(c => c.status === 'completed').length}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-purple-900">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {curricula.filter(c => c.status === 'active').length}
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-amber-900">Certificates</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">0</p>
        </div>
      </div>

      {/* My Curricula */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">My Learning Paths</h3>
        
        {curricula.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No curricula yet. Generate your first AI-powered curriculum!</p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {curricula.map((curriculum) => (
              <div
                key={curriculum.id}
                onClick={() => selectCurriculum(curriculum.id)}
                className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{curriculum.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        curriculum.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        curriculum.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {curriculum.difficulty}
                      </span>
                      {curriculum.aiGenerated && (
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{curriculum.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${curriculum.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{curriculum.progress}%</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{curriculum.modules?.length || 0} modules</span>
                      <span>{curriculum.estimatedDuration} hours</span>
                      <span className={`capitalize ${
                        curriculum.status === 'completed' ? 'text-green-600' :
                        curriculum.status === 'active' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {curriculum.status}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Curriculum Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Generate AI Curriculum
              </h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Skill Level Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level
              </label>
              <div className="flex gap-2">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedLevel === level.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you want to learn?
              </label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="e.g., Digital Marketing, AI for Business..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Popular Topics */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popular Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTopic === topic
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedTopic}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Curriculum
            </button>
          </div>
        </div>
      )}

      {/* Selected Curriculum Detail View */}
      {currentCurriculum && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{currentCurriculum.title}</h3>
            <button
              onClick={() => selectCurriculum('')}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {currentCurriculum.modules?.map((module, index) => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold">{module.title}</h4>
                  {module.completed && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                
                <div className="space-y-2">
                  {module.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`flex-1 ${lesson.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                        {lesson.title}
                      </span>
                      <span className="text-xs text-gray-400">{lesson.duration} min</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
