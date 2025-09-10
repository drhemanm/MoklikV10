import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  School, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle,
  Brain,
  TrendingUp,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { toast as toastLib } from 'react-hot-toast';

interface OnboardingData {
  fullName: string;
  school: string;
  customSchool?: string;
  subjectFocus: string[];
  level: string;
}

const SUBJECT_OPTIONS = [
  'Algebra',
  'Geometry', 
  'Trigonometry',
  'Calculus',
  'Statistics',
  'Coordinate Geometry'
];

const SCHOOL_OPTIONS = [
  'Royal College',
  'Queen Elizabeth College',
  'Loreto College',
  'St. Joseph College',
  'Other'
];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    school: '',
    customSchool: '',
    subjectFocus: [],
    level: 'Form 4'
  });

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subject: string) => {
    setData(prev => ({
      ...prev,
      subjectFocus: prev.subjectFocus.includes(subject)
        ? prev.subjectFocus.filter(s => s !== subject)
        : [...prev.subjectFocus, subject]
    }));
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      // Use custom school name if "Other" was selected
      const finalSchoolName = data.school === 'Other' && data.customSchool 
        ? data.customSchool 
        : data.school;
      
      // Save onboarding data to user profile
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...data, 
          school: finalSchoolName,
          userId: user?.uid 
        })
      });
      
      setShowTour(true);
    } catch (error) {
      toastLib.error('Failed to save profile. Please try again.');
    }
  };

  const completeTour = () => {
    toastLib.success('Welcome to Moklik! Let\'s start learning!');
    navigate('/dashboard');
  };

  const skipTour = () => {
    navigate('/dashboard');
  };

  const tourSteps = [
    {
      title: "Welcome to Your Dashboard",
      description: "This is your personalized learning hub where you can track progress and access all features.",
      icon: <Brain className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Select Topics",
      description: "Choose from various math topics or let our AI recommend based on your current level.",
      icon: <BookOpen className="w-8 h-8 text-green-600" />
    },
    {
      title: "Get Instant Feedback",
      description: "Ask questions, upload problems, or practice with past papers for immediate step-by-step solutions.",
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />
    },
    {
      title: "Track Your Progress",
      description: "Earn XP, unlock achievements, and watch your skills grow with detailed analytics.",
      icon: <Award className="w-8 h-8 text-yellow-600" />
    }
  ];

  if (showTour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={tourStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="mb-6">
                {tourSteps[tourStep].icon}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {tourSteps[tourStep].title}
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                {tourSteps[tourStep].description}
              </p>

              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === tourStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={skipTour}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip Tour
                </button>
                
                <button
                  onClick={() => {
                    if (tourStep < tourSteps.length - 1) {
                      setTourStep(tourStep + 1);
                    } else {
                      completeTour();
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>{tourStep < tourSteps.length - 1 ? 'Next' : 'Get Started'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {step === 1 && (
              <div className="text-center">
                <User className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Moklik!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Let's personalize your learning experience. What's your full name?
                </p>
                
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => updateData('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <School className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Which school do you attend?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  This helps us tailor content to your curriculum
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {SCHOOL_OPTIONS.map((school) => (
                    <button
                      key={school}
                      onClick={() => updateData('school', school)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        data.school === school
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {school}
                    </button>
                  ))}
                </div>
                
                {data.school === 'Other' && (
                  <input
                    type="text"
                    value={data.school === 'Other' ? data.customSchool || '' : ''}
                    onChange={(e) => updateData('customSchool', e.target.value)}
                    placeholder="Enter your school name"
                    className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What topics interest you most?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Select all that apply - we'll prioritize these in your learning path
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {SUBJECT_OPTIONS.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        data.subjectFocus.includes(subject)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{subject}</span>
                        {data.subjectFocus.includes(subject) && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <GraduationCap className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What's your current level?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  This helps us adjust the difficulty of problems and explanations
                </p>
                
                <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                  {['Form 4', 'Form 5'].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateData('level', level)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        data.level === level
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 hover:border-yellow-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
              
              <button
                onClick={nextStep}
                disabled={
                  (step === 1 && !data.fullName) ||
                  (step === 2 && (!data.school || (data.school === 'Other' && !data.customSchool))) ||
                  (step === 3 && data.subjectFocus.length === 0) ||
                  (step === 4 && !data.level)
                }
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 ml-auto"
              >
                <span>{step === 4 ? 'Complete Setup' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}