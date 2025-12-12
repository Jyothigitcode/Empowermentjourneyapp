import { Badge } from '../App';
import { Lock, Share2, Download } from 'lucide-react';
import { useState } from 'react';

type BadgeCollectionProps = {
  badges: Badge[];
};

export function BadgeCollection({ badges }: BadgeCollectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  const handleShare = (badge: Badge) => {
    const text = `I just earned the "${badge.name}" badge! ${badge.description}`;
    if (navigator.share) {
      navigator.share({
        title: 'Achievement Unlocked!',
        text: text,
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Achievement copied to clipboard!');
    }
  };

  const handleDownload = (badge: Badge) => {
    // Create a simple badge certificate
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#9333ea');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, 720, 520);
      
      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Achievement Unlocked', 400, 120);
      
      // Badge icon
      ctx.font = '120px Arial';
      ctx.fillText(badge.icon, 400, 250);
      
      // Badge name
      ctx.font = 'bold 42px Arial';
      ctx.fillText(badge.name, 400, 350);
      
      // Description
      ctx.font = '24px Arial';
      ctx.fillText(badge.description, 400, 400);
      
      // Date
      if (badge.earnedDate) {
        ctx.font = '20px Arial';
        ctx.fillText(
          `Earned on ${new Date(badge.earnedDate).toLocaleDateString()}`,
          400,
          480
        );
      }
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${badge.name.replace(/\s+/g, '-').toLowerCase()}-badge.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Badge Collection</h2>
        <p className="text-gray-600">
          {earnedBadges.length}/{badges.length} badges earned
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700">Collection Progress</span>
          <span className="text-gray-900">
            {Math.round((earnedBadges.length / badges.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4">Earned Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedBadge(badge)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{badge.icon}</div>
                  <h4 className="text-gray-900 mb-2">{badge.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                  {badge.earnedDate && (
                    <p className="text-xs text-gray-500">
                      Earned {new Date(badge.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(badge);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(badge);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-gray-900 mb-4">Locked Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 opacity-60"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="text-6xl grayscale">{badge.icon}</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-900 bg-opacity-70 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-gray-900 mb-2">{badge.name}</h4>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-8xl mb-4">{selectedBadge.icon}</div>
              <h3 className="text-gray-900 mb-2">{selectedBadge.name}</h3>
              <p className="text-gray-600 mb-6">{selectedBadge.description}</p>
              {selectedBadge.earnedDate && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    🎉 Earned on {new Date(selectedBadge.earnedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare(selectedBadge)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share Achievement
                </button>
                <button
                  onClick={() => handleDownload(selectedBadge)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
