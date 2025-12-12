import { LessonProgress, Badge } from '../App';
import { TrendingUp, Calendar, Target, Award, BarChart3 } from 'lucide-react';

type ProgressDashboardProps = {
  progress: LessonProgress[];
  badges: Badge[];
};

export function ProgressDashboard({ progress, badges }: ProgressDashboardProps) {
  const completedLessons = progress.filter(p => p.completed);
  const averageScore = completedLessons.length > 0
    ? Math.round(completedLessons.reduce((acc, p) => acc + (p.score || 0), 0) / completedLessons.length)
    : 0;
  const earnedBadges = badges.filter(b => b.earned).length;

  // Calculate weekly activity
  const getWeeklyActivity = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return completedLessons.filter(p => {
      if (!p.completedDate) return false;
      const completedDate = new Date(p.completedDate);
      return completedDate >= weekAgo;
    }).length;
  };

  // Recent achievements
  const recentAchievements = badges
    .filter(b => b.earned)
    .sort((a, b) => {
      if (!a.earnedDate || !b.earnedDate) return 0;
      return new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime();
    })
    .slice(0, 5);

  // Score distribution
  const scoreRanges = {
    excellent: completedLessons.filter(p => (p.score || 0) >= 90).length,
    good: completedLessons.filter(p => (p.score || 0) >= 70 && (p.score || 0) < 90).length,
    fair: completedLessons.filter(p => (p.score || 0) >= 50 && (p.score || 0) < 70).length,
    needsWork: completedLessons.filter(p => (p.score || 0) < 50).length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Your Progress Dashboard</h2>
        <p className="text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl mb-1">{completedLessons.length}</div>
          <div className="text-indigo-100">Lessons Completed</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl mb-1">{averageScore}%</div>
          <div className="text-green-100">Average Score</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl mb-1">{earnedBadges}</div>
          <div className="text-yellow-100">Badges Earned</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl mb-1">{getWeeklyActivity()}</div>
          <div className="text-purple-100">This Week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Performance Overview
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Excellent (90-100%)</span>
                <span className="text-sm text-gray-900">{scoreRanges.excellent} lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${completedLessons.length > 0 ? (scoreRanges.excellent / completedLessons.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Good (70-89%)</span>
                <span className="text-sm text-gray-900">{scoreRanges.good} lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${completedLessons.length > 0 ? (scoreRanges.good / completedLessons.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Fair (50-69%)</span>
                <span className="text-sm text-gray-900">{scoreRanges.fair} lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-yellow-500 h-3 rounded-full transition-all"
                  style={{ width: `${completedLessons.length > 0 ? (scoreRanges.fair / completedLessons.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {scoreRanges.needsWork > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Needs Work (&lt;50%)</span>
                  <span className="text-sm text-gray-900">{scoreRanges.needsWork} lessons</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${completedLessons.length > 0 ? (scoreRanges.needsWork / completedLessons.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {completedLessons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Complete lessons to see your performance data</p>
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Recent Achievements
          </h3>
          
          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((badge) => (
                <div key={badge.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <div className="text-3xl">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="text-gray-900">{badge.name}</div>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                    {badge.earnedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Complete lessons to earn badges</p>
            </div>
          )}
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Learning Activity
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="text-gray-900 mb-1">Current Streak</div>
                <p className="text-sm text-gray-600">Keep it going!</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-600 mb-1">{day}</div>
                  <div className={`w-full aspect-square rounded ${
                    index < 3 ? 'bg-purple-500' : 'bg-gray-200'
                  }`} />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Weekly Goal</span>
                <span className="text-sm text-gray-900">{getWeeklyActivity()}/5 lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((getWeeklyActivity() / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="mb-4">Keep Going! 💪</h3>
          
          <div className="space-y-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm text-indigo-100 mb-2">Next Milestone</p>
              <div className="text-xl">
                {completedLessons.length < 5 
                  ? `Complete ${5 - completedLessons.length} more lessons to earn Learning Streak badge`
                  : averageScore < 90
                  ? 'Score 90%+ on your next lesson for a Perfect Score badge'
                  : 'You\'re doing amazing! Keep up the excellent work!'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span>✨</span>
                <span>You\'re in the top performers - great work!</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span>📈</span>
                <span>Your learning consistency is improving</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span>🎯</span>
                <span>Stay focused on your goals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
