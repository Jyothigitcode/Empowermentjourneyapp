import { useState, useRef } from 'react';
import { UserProfile, Badge, LessonProgress } from '../App';
import { Download, Share2, QrCode, Award, BookOpen, TrendingUp } from 'lucide-react';

type QRIdentityCardProps = {
  user: UserProfile;
  badges: Badge[];
  progress: LessonProgress[];
};

export function QRIdentityCard({ user, badges, progress }: QRIdentityCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  const earnedBadges = badges.filter(b => b.earned);
  const completedLessons = progress.filter(p => p.completed);
  const averageScore = completedLessons.length > 0
    ? Math.round(completedLessons.reduce((acc, p) => acc + (p.score || 0), 0) / completedLessons.length)
    : 0;

  // Generate QR code (using a simple canvas-based approach)
  const generateQRCode = () => {
    const canvas = document.createElement('canvas');
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Generate a simple pattern representing user data
      // In a real app, you'd use a QR code library like qrcode.react
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      // Create a simple grid pattern
      ctx.fillStyle = '#000000';
      const cellSize = 10;
      const userData = JSON.stringify({
        id: user.id,
        name: user.name,
        badges: earnedBadges.length,
        lessons: completedLessons.length,
        score: averageScore
      });
      
      // Create pseudo-random pattern based on user data
      for (let i = 0; i < size; i += cellSize) {
        for (let j = 0; j < size; j += cellSize) {
          const hash = (i * j + userData.charCodeAt((i + j) % userData.length)) % 2;
          if (hash === 1) {
            ctx.fillRect(i, j, cellSize, cellSize);
          }
        }
      }
      
      setQrCodeUrl(canvas.toDataURL());
    }
  };

  const handleDownloadCard = () => {
    if (!cardRef.current) return;

    // Create a canvas with the card content
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 800, 500);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#9333ea');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 500);

      // White card background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, 40, 720, 420);

      // Header
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(40, 40, 720, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Learner Identity Card', 80, 90);

      // User info
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(user.name, 80, 180);
      
      ctx.font = '20px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(user.email, 80, 220);
      ctx.fillText(`Member since ${new Date(user.joinDate).toLocaleDateString()}`, 80, 250);

      // Stats
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.fillText(`✓ ${completedLessons.length} Lessons Completed`, 80, 310);
      ctx.fillText(`★ ${earnedBadges.length} Badges Earned`, 80, 345);
      ctx.fillText(`📊 ${averageScore}% Average Score`, 80, 380);

      // QR Code placeholder
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(580, 160, 160, 160);
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', 660, 245);
      ctx.fillText('Scan to verify', 660, 265);

      // Footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Empowerment Journey Platform', 80, 440);
      ctx.textAlign = 'right';
      ctx.fillText(`ID: ${user.id}`, 720, 440);

      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'learner-identity-card.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const handleShare = () => {
    const text = `Check out my learning progress!\n📚 ${completedLessons.length} lessons completed\n🏆 ${earnedBadges.length} badges earned\n⭐ ${averageScore}% average score`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Journey',
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Stats copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">QR Identity Card</h2>
        <p className="text-gray-600">Your digital learning credential</p>
      </div>

      {/* Identity Card */}
      <div ref={cardRef} className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-1 mb-6">
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3>Learner Identity Card</h3>
                  <p className="text-sm text-indigo-100">Empowerment Journey Platform</p>
                </div>
              </div>
              <QrCode className="w-8 h-8" />
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - User Info */}
              <div>
                <div className="mb-6">
                  <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
                  <div className="text-xl text-gray-900">{user.name}</div>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-gray-500 mb-1 block">Email</label>
                  <div className="text-gray-700">{user.email}</div>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-gray-500 mb-1 block">Member Since</label>
                  <div className="text-gray-700">
                    {new Date(user.joinDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-gray-500 mb-1 block">Learner ID</label>
                  <div className="text-gray-700 font-mono text-sm">{user.id}</div>
                </div>
              </div>

              {/* Right Side - QR Code & Stats */}
              <div>
                {!qrCodeUrl ? (
                  <div className="bg-gray-100 rounded-xl p-8 mb-6">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <button
                        onClick={generateQRCode}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Generate QR Code
                      </button>
                      <p className="text-sm text-gray-600 mt-3">
                        Create a scannable QR code with your achievements
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                      <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                    </div>
                    <p className="text-xs text-gray-600 text-center mt-3">
                      Scan to view learner profile
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Lessons Completed</div>
                      <div className="text-gray-900">{completedLessons.length}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Badges Earned</div>
                      <div className="text-gray-900">{earnedBadges.length}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Average Score</div>
                      <div className="text-gray-900">{averageScore}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadCard}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Card
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share Achievements
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Achievements */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Featured Achievements
        </h3>
        
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.slice(0, 4).map((badge) => (
              <div key={badge.id} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm text-gray-900">{badge.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Complete lessons to earn badges and display them here
          </p>
        )}
      </div>
    </div>
  );
}
