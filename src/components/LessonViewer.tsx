import { useState } from 'react';
import { X, ChevronRight, Volume2, VolumeX, CheckCircle } from 'lucide-react';

type Lesson = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

type LessonViewerProps = {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (lessonId: string, score: number) => void;
  userLanguage: string;
  audioEnabled: boolean;
};

type LessonContent = {
  sections: {
    title: string;
    content: string;
    audioText: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
};

const getLessonContent = (lessonId: string): LessonContent => {
  // Mock lesson content - in a real app, this would come from a backend
  const contents: Record<string, LessonContent> = {
    'intro-digital-literacy': {
      sections: [
        {
          title: 'What is Digital Literacy?',
          content: 'Digital literacy is the ability to use information and communication technologies to find, evaluate, create, and communicate information. It requires both cognitive and technical skills.',
          audioText: 'Digital literacy is the ability to use information and communication technologies to find, evaluate, create, and communicate information.'
        },
        {
          title: 'Why It Matters',
          content: 'In today\'s digital age, being digitally literate is essential for education, work, and everyday life. It empowers you to participate fully in the digital society and opens up new opportunities.',
          audioText: 'In today\'s digital age, being digitally literate is essential for education, work, and everyday life.'
        },
        {
          title: 'Key Skills',
          content: 'Digital literacy includes: understanding how to use devices and software, evaluating online information for credibility, protecting your privacy and security, and communicating effectively in digital spaces.',
          audioText: 'Digital literacy includes understanding how to use devices and software, evaluating online information, protecting privacy, and communicating effectively.'
        }
      ],
      quiz: [
        {
          question: 'What is digital literacy?',
          options: [
            'Only knowing how to type',
            'The ability to use technology to find, evaluate, and communicate information',
            'Playing video games',
            'Using social media'
          ],
          correctAnswer: 1
        },
        {
          question: 'Why is digital literacy important today?',
          options: [
            'It\'s not important',
            'Only for young people',
            'Essential for education, work, and everyday life',
            'Only for tech professionals'
          ],
          correctAnswer: 2
        }
      ]
    }
  };

  return contents[lessonId] || {
    sections: [
      {
        title: 'Welcome to this lesson',
        content: 'This lesson will help you develop new skills and knowledge to empower your journey.',
        audioText: 'Welcome to this lesson. This lesson will help you develop new skills and knowledge.'
      },
      {
        title: 'Key Concepts',
        content: 'Throughout this lesson, you\'ll learn important concepts that you can apply in real-world situations.',
        audioText: 'Throughout this lesson, you will learn important concepts that you can apply in real situations.'
      },
      {
        title: 'Practical Application',
        content: 'Remember to practice what you learn. The more you apply these skills, the more confident you\'ll become.',
        audioText: 'Remember to practice what you learn. The more you apply these skills, the more confident you will become.'
      }
    ],
    quiz: [
      {
        question: 'What is the main purpose of this lesson?',
        options: [
          'Entertainment',
          'To develop new skills and knowledge',
          'To waste time',
          'To confuse learners'
        ],
        correctAnswer: 1
      },
      {
        question: 'How can you get the most out of this lesson?',
        options: [
          'Skip to the end',
          'Just read without thinking',
          'Practice and apply what you learn',
          'Memorize without understanding'
        ],
        correctAnswer: 2
      }
    ]
  };
};

export function LessonViewer({ lesson, onClose, onComplete, userLanguage, audioEnabled }: LessonViewerProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const content = getLessonContent(lesson.id);
  const totalSections = content.sections.length;

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window && audioEnabled) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userLanguage === 'es' ? 'es-ES' : 
                       userLanguage === 'fr' ? 'fr-FR' : 
                       userLanguage === 'de' ? 'de-DE' :
                       userLanguage === 'zh' ? 'zh-CN' :
                       userLanguage === 'ar' ? 'ar-SA' :
                       userLanguage === 'hi' ? 'hi-IN' :
                       userLanguage === 'pt' ? 'pt-PT' :
                       'en-US';
      utterance.onend = () => setIsPlayingAudio(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      stopAudio();
    } else {
      setShowQuiz(true);
      stopAudio();
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    const correctCount = content.quiz.reduce((acc, question, index) => {
      return acc + (quizAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / content.quiz.length) * 100);
    setShowResults(true);
    onComplete(lesson.id, score);
  };

  const getScore = () => {
    const correctCount = content.quiz.reduce((acc, question, index) => {
      return acc + (quizAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    return Math.round((correctCount / content.quiz.length) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-1">{lesson.title}</h2>
            <p className="text-sm text-gray-600">{lesson.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        {!showQuiz && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-900">{currentSection + 1}/{totalSections}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showQuiz ? (
            <div>
              <h3 className="text-gray-900 mb-4">{content.sections[currentSection].title}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {content.sections[currentSection].content}
              </p>

              {audioEnabled && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-900">Audio narration available</span>
                    <button
                      onClick={() => isPlayingAudio 
                        ? stopAudio() 
                        : playAudio(content.sections[currentSection].audioText)
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          Play
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !showResults ? (
            <div>
              <h3 className="text-gray-900 mb-4">Knowledge Check</h3>
              <p className="text-gray-600 mb-6">Test your understanding of the lesson</p>

              <div className="space-y-6">
                {content.quiz.map((question, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-gray-900 mb-4">{qIndex + 1}. {question.question}</div>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                            quizAnswers[qIndex] === oIndex
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Lesson Complete!</h3>
              <p className="text-gray-600 mb-4">Your score: {getScore()}%</p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700">
                  {getScore() >= 80 
                    ? '🎉 Excellent work! You\'ve mastered this lesson.'
                    : getScore() >= 60
                    ? '👍 Good job! Consider reviewing the material to improve.'
                    : '💪 Keep learning! Review the lesson and try again.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to Library
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showResults && (
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Exit Lesson
            </button>
            {!showQuiz ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {currentSection < totalSections - 1 ? 'Next' : 'Take Quiz'}
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleQuizSubmit}
                disabled={quizAnswers.length < content.quiz.length}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
