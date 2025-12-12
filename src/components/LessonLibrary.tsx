import { useState } from 'react';
import { LessonProgress } from '../App';
import { BookOpen, Clock, Award, Play, CheckCircle, Lock, Volume2 } from 'lucide-react';
import { LessonViewer } from './LessonViewer';

type LessonLibraryProps = {
  progress: LessonProgress[];
  onLessonComplete: (lessonId: string, score: number) => void;
  userLanguage: string;
};

type Lesson = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  locked: boolean;
  requiredLessons?: string[];
};

const lessons: Lesson[] = [
  {
    id: 'intro-digital-literacy',
    title: 'Introduction to Digital Literacy',
    description: 'Learn the basics of navigating the digital world safely and effectively',
    category: 'Digital Skills',
    duration: 15,
    difficulty: 'beginner',
    locked: false
  },
  {
    id: 'online-safety',
    title: 'Online Safety & Privacy',
    description: 'Understand how to protect yourself and your information online',
    category: 'Digital Skills',
    duration: 20,
    difficulty: 'beginner',
    locked: false
  },
  {
    id: 'effective-communication',
    title: 'Effective Communication Skills',
    description: 'Master the art of clear and confident communication',
    category: 'Soft Skills',
    duration: 25,
    difficulty: 'beginner',
    locked: false
  },
  {
    id: 'time-management',
    title: 'Time Management Essentials',
    description: 'Learn techniques to manage your time and boost productivity',
    category: 'Productivity',
    duration: 20,
    difficulty: 'beginner',
    locked: false
  },
  {
    id: 'critical-thinking',
    title: 'Critical Thinking & Problem Solving',
    description: 'Develop skills to analyze problems and find creative solutions',
    category: 'Soft Skills',
    duration: 30,
    difficulty: 'intermediate',
    locked: true,
    requiredLessons: ['intro-digital-literacy']
  },
  {
    id: 'financial-literacy',
    title: 'Financial Literacy Basics',
    description: 'Understand budgeting, saving, and making informed financial decisions',
    category: 'Life Skills',
    duration: 25,
    difficulty: 'beginner',
    locked: false
  },
  {
    id: 'goal-setting',
    title: 'Goal Setting & Achievement',
    description: 'Learn how to set and achieve meaningful personal and professional goals',
    category: 'Personal Development',
    duration: 20,
    difficulty: 'beginner',
    locked: false
  },
  {
    id: 'digital-marketing-intro',
    title: 'Introduction to Digital Marketing',
    description: 'Explore the fundamentals of marketing in the digital age',
    category: 'Professional Skills',
    duration: 35,
    difficulty: 'intermediate',
    locked: true,
    requiredLessons: ['intro-digital-literacy']
  },
];

export function LessonLibrary({ progress, onLessonComplete, userLanguage }: LessonLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const categories = ['all', ...Array.from(new Set(lessons.map(l => l.category)))];

  const filteredLessons = selectedCategory === 'all' 
    ? lessons 
    : lessons.filter(l => l.category === selectedCategory);

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lessonId === lessonId && p.completed);
  };

  const getLessonScore = (lessonId: string) => {
    const lessonProgress = progress.find(p => p.lessonId === lessonId);
    return lessonProgress?.score;
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    if (!lesson.locked) return true;
    if (!lesson.requiredLessons) return true;
    return lesson.requiredLessons.every(reqId => isLessonCompleted(reqId));
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (isLessonUnlocked(lesson)) {
      setSelectedLesson(lesson);
    }
  };

  if (selectedLesson) {
    return (
      <LessonViewer 
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
        onComplete={onLessonComplete}
        userLanguage={userLanguage}
        audioEnabled={audioEnabled}
      />
    );
  }

  const completedCount = progress.filter(p => p.completed).length;
  const completionPercentage = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-gray-900 mb-2">Lesson Library</h2>
            <p className="text-gray-600">Explore courses designed to empower your journey</p>
          </div>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              audioEnabled 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            Audio {audioEnabled ? 'On' : 'Off'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Overall Progress</span>
            <span className="text-gray-900">{completedCount}/{lessons.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {category === 'all' ? 'All Lessons' : category}
          </button>
        ))}
      </div>

      {/* Lesson Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const completed = isLessonCompleted(lesson.id);
          const score = getLessonScore(lesson.id);
          const unlocked = isLessonUnlocked(lesson);

          return (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson)}
              className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
                unlocked
                  ? 'border-gray-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer'
                  : 'border-gray-200 opacity-60 cursor-not-allowed'
              } ${completed ? 'ring-2 ring-green-400' : ''}`}
            >
              <div className={`p-4 ${
                lesson.difficulty === 'beginner' ? 'bg-green-50' :
                lesson.difficulty === 'intermediate' ? 'bg-yellow-50' :
                'bg-red-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {lesson.difficulty}
                  </span>
                  {!unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                  {completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {lesson.duration} min
                  </div>
                  {completed && score !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Award className="w-4 h-4" />
                      {score}%
                    </div>
                  )}
                  {unlocked && !completed && (
                    <div className="flex items-center gap-1 text-sm text-indigo-600">
                      <Play className="w-4 h-4" />
                      Start
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
