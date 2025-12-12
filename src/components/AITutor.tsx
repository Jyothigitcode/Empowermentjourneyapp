import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, Volume2 } from 'lucide-react';

type AITutorProps = {
  userLanguage: string;
  onBadgeEarn: (badgeId: string) => void;
  currentQuestionCount: number;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const AI_RESPONSES: Record<string, string> = {
  'hello': 'Hello! I\'m your AI tutor. I\'m here to help you learn and answer any questions you have. What would you like to know today?',
  'help': 'I can help you with:\n• Explaining lesson concepts\n• Answering your questions\n• Providing study tips\n• Clarifying difficult topics\n\nJust ask me anything!',
  'digital literacy': 'Digital literacy refers to the skills needed to live, learn, and work in a digital society. This includes being able to find, evaluate, and use information online safely and effectively.',
  'privacy': 'Online privacy is about protecting your personal information. Key tips:\n• Use strong, unique passwords\n• Be careful what you share on social media\n• Check privacy settings regularly\n• Think before you click on links',
  'goal': 'Setting effective goals involves:\n1. Make them Specific\n2. Make them Measurable\n3. Make them Achievable\n4. Make them Relevant\n5. Set a Time-frame (SMART goals)',
  'time management': 'Effective time management techniques:\n• Prioritize tasks by importance\n• Break large tasks into smaller steps\n• Use a calendar or planner\n• Minimize distractions\n• Take regular breaks',
  'default': 'That\'s a great question! Let me help you understand that better. In general, it\'s important to break down complex topics into smaller, manageable parts and practice regularly. Would you like me to explain something specific in more detail?'
};

export function AITutor({ userLanguage, onBadgeEarn, currentQuestionCount }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! 👋 I\'m your AI tutor. I\'m here to help you learn and answer any questions. You can type your question or use voice input. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [questionCount, setQuestionCount] = useState(currentQuestionCount);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Check for AI Explorer badge
    if (questionCount >= 10) {
      onBadgeEarn('ai-explorer');
    }
  }, [questionCount, onBadgeEarn]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(AI_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return AI_RESPONSES.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setQuestionCount(prev => prev + 1);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = userLanguage === 'es' ? 'es-ES' : 
                       userLanguage === 'fr' ? 'fr-FR' : 
                       userLanguage === 'de' ? 'de-DE' :
                       userLanguage === 'zh' ? 'zh-CN' :
                       userLanguage === 'ar' ? 'ar-SA' :
                       userLanguage === 'hi' ? 'hi-IN' :
                       userLanguage === 'pt' ? 'pt-PT' :
                       'en-US';
    
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userLanguage === 'es' ? 'es-ES' : 
                       userLanguage === 'fr' ? 'fr-FR' : 
                       userLanguage === 'de' ? 'de-DE' :
                       userLanguage === 'zh' ? 'zh-CN' :
                       userLanguage === 'ar' ? 'ar-SA' :
                       userLanguage === 'hi' ? 'hi-IN' :
                       userLanguage === 'pt' ? 'pt-PT' :
                       'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const quickQuestions = [
    'How do I stay safe online?',
    'What is digital literacy?',
    'How can I manage my time better?',
    'How do I set goals?',
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2>AI Tutor</h2>
            <p className="text-sm text-indigo-100">Always here to help you learn</p>
          </div>
        </div>
        {questionCount > 0 && questionCount < 10 && (
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm">
              📊 {questionCount}/10 questions asked - Keep going to earn the AI Explorer badge!
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-gray-100 text-gray-900 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'assistant' && (
                <button
                  onClick={() => speakMessage(message.content)}
                  className="mt-2 text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  Read aloud
                </button>
              )}
              <span className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-gray-600">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
                className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 rounded-b-2xl p-4">
        <div className="flex gap-2">
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-lg transition-colors ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Use the microphone button to ask questions with your voice
        </p>
      </div>
    </div>
  );
}
