import { useState, useEffect } from "react";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { LessonLibrary } from "./components/LessonLibrary";
import { AITutor } from "./components/AITutor";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { BadgeCollection } from "./components/BadgeCollection";
import { QRIdentityCard } from "./components/QRIdentityCard";
import {
  Menu,
  Home,
  BookOpen,
  Bot,
  Award,
  QrCode,
  BarChart3,
} from "lucide-react";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  language: string;
};

export type LessonProgress = {
  lessonId: string;
  completed: boolean;
  score?: number;
  completedDate?: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
  earned: boolean;
};

export type AppData = {
  user: UserProfile | null;
  progress: LessonProgress[];
  badges: Badge[];
};

export default function App() {
  const [currentView, setCurrentView] = useState<
    | "onboarding"
    | "home"
    | "lessons"
    | "tutor"
    | "progress"
    | "badges"
    | "qr"
  >("onboarding");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appData, setAppData] = useState<AppData>({
    user: null,
    progress: [],
    badges: [],
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(
      "empowermentJourneyData",
    );
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAppData(parsed);
      if (parsed.user) {
        setCurrentView("home");
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (appData.user) {
      localStorage.setItem(
        "empowermentJourneyData",
        JSON.stringify(appData),
      );
    }
  }, [appData]);

  const handleOnboardingComplete = (userData: UserProfile) => {
    const initialBadges: Badge[] = [
      {
        id: "welcome",
        name: "Welcome Badge",
        description: "Completed onboarding",
        icon: "🎉",
        earned: true,
        earnedDate: new Date().toISOString(),
      },
      {
        id: "first-lesson",
        name: "First Lesson",
        description: "Complete your first lesson",
        icon: "📚",
        earned: false,
      },
      {
        id: "five-lessons",
        name: "Learning Streak",
        description: "Complete 5 lessons",
        icon: "🔥",
        earned: false,
      },
      {
        id: "ai-explorer",
        name: "AI Explorer",
        description: "Ask 10 questions to AI Tutor",
        icon: "🤖",
        earned: false,
      },
      {
        id: "perfect-score",
        name: "Perfect Score",
        description: "Score 100% on a lesson",
        icon: "⭐",
        earned: false,
      },
      {
        id: "week-streak",
        name: "7-Day Streak",
        description: "Learn for 7 consecutive days",
        icon: "💪",
        earned: false,
      },
    ];

    setAppData({
      user: userData,
      progress: [],
      badges: initialBadges,
    });
    setCurrentView("home");
  };

  const updateProgress = (lessonId: string, score: number) => {
    setAppData((prev) => {
      const existingProgress = prev.progress.find(
        (p) => p.lessonId === lessonId,
      );
      const newProgress = existingProgress
        ? prev.progress.map((p) =>
            p.lessonId === lessonId
              ? {
                  ...p,
                  completed: true,
                  score,
                  completedDate: new Date().toISOString(),
                }
              : p,
          )
        : [
            ...prev.progress,
            {
              lessonId,
              completed: true,
              score,
              completedDate: new Date().toISOString(),
            },
          ];

      // Check and award badges
      let updatedBadges = [...prev.badges];
      const completedCount = newProgress.filter(
        (p) => p.completed,
      ).length;

      // First lesson badge
      if (
        completedCount >= 1 &&
        !updatedBadges.find((b) => b.id === "first-lesson")
          ?.earned
      ) {
        updatedBadges = updatedBadges.map((b) =>
          b.id === "first-lesson"
            ? {
                ...b,
                earned: true,
                earnedDate: new Date().toISOString(),
              }
            : b,
        );
      }

      // Five lessons badge
      if (
        completedCount >= 5 &&
        !updatedBadges.find((b) => b.id === "five-lessons")
          ?.earned
      ) {
        updatedBadges = updatedBadges.map((b) =>
          b.id === "five-lessons"
            ? {
                ...b,
                earned: true,
                earnedDate: new Date().toISOString(),
              }
            : b,
        );
      }

      // Perfect score badge
      if (
        score === 100 &&
        !updatedBadges.find((b) => b.id === "perfect-score")
          ?.earned
      ) {
        updatedBadges = updatedBadges.map((b) =>
          b.id === "perfect-score"
            ? {
                ...b,
                earned: true,
                earnedDate: new Date().toISOString(),
              }
            : b,
        );
      }

      return {
        ...prev,
        progress: newProgress,
        badges: updatedBadges,
      };
    });
  };

  const awardBadge = (badgeId: string) => {
    setAppData((prev) => ({
      ...prev,
      badges: prev.badges.map((b) =>
        b.id === badgeId
          ? {
              ...b,
              earned: true,
              earnedDate: new Date().toISOString(),
            }
          : b,
      ),
    }));
  };

  if (currentView === "onboarding") {
    return (
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    );
  }

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "tutor", label: "AI Tutor", icon: Bot },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "badges", label: "Badges", icon: Award },
    { id: "qr", label: "QR Card", icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-indigo-600">Empower Journey</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {appData.user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-gray-900">
                    {appData.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appData.user?.email}
                  </div>
                </div>
              </div>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        currentView === item.id
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0">
          <div className="p-6">
            <h1 className="text-indigo-600 mb-8">
              Empower Journey
            </h1>

            <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                {appData.user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-gray-900">
                  {appData.user?.name}
                </div>
                <div className="text-sm text-gray-500">
                  {appData.user?.email}
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setCurrentView(item.id as any)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentView === item.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 mt-16 lg:mt-0 p-4 lg:p-8">
          {currentView === "home" && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-gray-900 mb-2">
                  Welcome back, {appData.user?.name}! 👋
                </h2>
                <p className="text-gray-600">
                  Continue your empowerment journey
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-600">
                      Lessons Completed
                    </div>
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="text-gray-900">
                    {
                      appData.progress.filter(
                        (p) => p.completed,
                      ).length
                    }
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-600">
                      Badges Earned
                    </div>
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-gray-900">
                    {
                      appData.badges.filter((b) => b.earned)
                        .length
                    }
                    /{appData.badges.length}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-600">
                      Average Score
                    </div>
                    <BarChart3 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-gray-900">
                    {appData.progress.length > 0
                      ? Math.round(
                          appData.progress.reduce(
                            (acc, p) => acc + (p.score || 0),
                            0,
                          ) / appData.progress.length,
                        )
                      : 0}
                    %
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-600">
                      Current Streak
                    </div>
                    <span className="text-xl">🔥</span>
                  </div>
                  <div className="text-gray-900">3 days</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
                  <h3 className="mb-2">Continue Learning</h3>
                  <p className="mb-6 text-indigo-100">
                    Pick up where you left off
                  </p>
                  <button
                    onClick={() => setCurrentView("lessons")}
                    className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Go to Lessons
                  </button>
                </div>

                <div className="bg-white rounded-xl p-8 border border-gray-200">
                  <h3 className="mb-2 text-gray-900">
                    Need Help?
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Get instant support from our AI Tutor
                  </p>
                  <button
                    onClick={() => setCurrentView("tutor")}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Ask AI Tutor
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentView === "lessons" && (
            <LessonLibrary
              progress={appData.progress}
              onLessonComplete={updateProgress}
              userLanguage={appData.user?.language || "en"}
            />
          )}

          {currentView === "tutor" && (
            <AITutor
              userLanguage={appData.user?.language || "en"}
              onBadgeEarn={awardBadge}
              currentQuestionCount={0}
            />
          )}

          {currentView === "progress" && (
            <ProgressDashboard
              progress={appData.progress}
              badges={appData.badges}
            />
          )}

          {currentView === "badges" && (
            <BadgeCollection badges={appData.badges} />
          )}

          {currentView === "qr" && appData.user && (
            <QRIdentityCard
              user={appData.user}
              badges={appData.badges}
              progress={appData.progress}
            />
          )}
        </div>
      </div>
    </div>
  );
}