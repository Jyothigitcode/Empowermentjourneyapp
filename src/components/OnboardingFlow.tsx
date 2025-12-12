import { useState } from 'react';
import { UserProfile } from '../App';
import { ChevronRight, Globe, User, Mail } from 'lucide-react';

type OnboardingFlowProps = {
  onComplete: (userData: UserProfile) => void;
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'en'
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  const handleSubmit = () => {
    const userData: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      joinDate: new Date().toISOString(),
      language: formData.language
    };
    onComplete(userData);
  };

  const steps = [
    {
      title: 'Welcome to Your Empowerment Journey',
      description: 'Learn at your own pace with AI-powered tutoring, track your progress, and earn achievements.',
      image: 'https://images.unsplash.com/photo-1758270704524-596810e891b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjU0MjQ4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <div className="text-gray-900 mb-1">Learn Engaging Lessons</div>
              <p className="text-sm text-gray-600">Access a library of interactive lessons designed for your growth</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <div className="text-gray-900 mb-1">Get AI-Powered Help</div>
              <p className="text-sm text-gray-600">Ask questions anytime with text or voice and get instant answers</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <div className="text-gray-900 mb-1">Track & Share Progress</div>
              <p className="text-sm text-gray-600">Earn badges, generate your QR identity card, and share achievements</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Choose Your Language',
      description: 'Select your preferred language for learning',
      content: (
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setFormData({ ...formData, language: lang.code })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.language === lang.code
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{lang.flag}</div>
              <div className="text-gray-900">{lang.name}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'Create Your Profile',
      description: 'Tell us a bit about yourself',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>
      )
    }
  ];

  const canProceed = step === 0 || 
                      (step === 1 && formData.language) || 
                      (step === 2 && formData.name && formData.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left side - Image/Visual */}
            <div className="hidden lg:block relative bg-gradient-to-br from-indigo-600 to-purple-600 p-8">
              {step === 0 && (
                <div className="h-full flex flex-col justify-center">
                  <img 
                    src={steps[0].image}
                    alt="Learning journey"
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  <div className="text-white">
                    <h3 className="mb-3">Empower Your Future</h3>
                    <p className="text-indigo-100">
                      Join thousands of learners on their journey to growth and achievement
                    </p>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="h-full flex flex-col justify-center text-white">
                  <Globe className="w-16 h-16 mb-6" />
                  <h3 className="mb-3">Learn in Your Language</h3>
                  <p className="text-indigo-100">
                    We support multilingual learning with audio support to make education accessible to everyone
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className="h-full flex flex-col justify-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="mb-3">Your Personal Journey</h3>
                  <p className="text-indigo-100">
                    Create your profile to track progress, earn badges, and generate your unique QR identity card
                  </p>
                </div>
              )}
            </div>

            {/* Right side - Form */}
            <div className="p-8 lg:p-12">
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-8">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full mx-1 ${
                      i <= step ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <h2 className="text-gray-900 mb-2">{steps[step].title}</h2>
              <p className="text-gray-600 mb-8">{steps[step].description}</p>

              <div className="mb-8">
                {steps[step].content}
              </div>

              <div className="flex gap-3">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (step < steps.length - 1) {
                      setStep(step + 1);
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={!canProceed}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step < steps.length - 1 ? 'Continue' : 'Start Learning'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
