import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, CheckCircle, X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEMO_PROBLEMS = [
  {
    id: 1,
    question: "Solve the quadratic equation: x² + 5x + 6 = 0",
    correctAnswers: ["x = -2 or x = -3", "x = -3 or x = -2", "-2, -3", "-3, -2", "x=-2, x=-3", "x=-3, x=-2"],
    normalizedAnswers: ["x=-2orx=-3", "x=-3orx=-2", "-2,-3", "-3,-2"],
    steps: [
      "This is a quadratic equation in the form ax² + bx + c = 0",
      "We can solve this by factorization. We need two numbers that multiply to 6 and add to 5",
      "Those numbers are 2 and 3, since 2 × 3 = 6 and 2 + 3 = 5",
      "So we can write: x² + 5x + 6 = (x + 2)(x + 3) = 0",
      "For this to equal zero, either (x + 2) = 0 or (x + 3) = 0",
      "Therefore: x = -2 or x = -3"
    ],
    answer: "x = -2 or x = -3",
    hint: "Try to find two numbers that multiply to give the constant term (6) and add to give the coefficient of x (5)."
  },
  {
    id: 2,
    question: "Find the derivative of f(x) = 3x² + 2x - 1",
    correctAnswers: ["f'(x) = 6x + 2", "6x + 2", "f'(x)=6x+2", "6x+2"],
    normalizedAnswers: ["f'(x)=6x+2", "6x+2"],
    steps: [
      "To find the derivative, we use the power rule: d/dx(xⁿ) = nxⁿ⁻¹",
      "For the first term: d/dx(3x²) = 3 × 2x²⁻¹ = 6x",
      "For the second term: d/dx(2x) = 2 × 1x¹⁻¹ = 2",
      "For the constant term: d/dx(-1) = 0",
      "Combining all terms: f'(x) = 6x + 2"
    ],
    answer: "f'(x) = 6x + 2",
    hint: "Remember the power rule: bring down the exponent and reduce the power by 1."
  }
];

export function DemoMode() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCTA, setShowCTA] = useState(false);
 const [attemptCount, setAttemptCount] = useState(0);
 const [showSolution, setShowSolution] = useState(false);

  const problem = DEMO_PROBLEMS[currentProblem];

 const normalizeAnswer = (answer: string): string => {
   return answer
     .toLowerCase()
     .replace(/\s+/g, '') // Remove all spaces
     .replace(/[()]/g, '') // Remove parentheses
     .replace(/=/g, '') // Remove equals signs for comparison
     .replace(/f'/g, "f'") // Normalize derivative notation
     .replace(/\*/g, '') // Remove multiplication symbols
     .trim();
 };
  const checkAnswer = () => {
   const normalizedUserAnswer = normalizeAnswer(userAnswer);
   const isAnswerCorrect = problem.normalizedAnswers.some(correctAnswer => 
     normalizeAnswer(correctAnswer) === normalizedUserAnswer
   );
   
   setAttemptCount(prev => prev + 1);
   setIsCorrect(isAnswerCorrect);
   
   if (isAnswerCorrect) {
     setShowSteps(true);
     setTimeout(() => setShowCTA(true), 3000);
   } else if (attemptCount >= 1) {
     // After 2 wrong attempts, show step-by-step solution
     setShowSolution(true);
     setShowSteps(true);
   }
  };

  const nextStep = () => {
    if (currentStep < problem.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetDemo = () => {
    setUserAnswer('');
    setShowSteps(false);
    setCurrentStep(0);
    setShowHint(false);
    setIsCorrect(null);
    setShowCTA(false);
   setAttemptCount(0);
   setShowSolution(false);
  };

  const nextProblem = () => {
    if (currentProblem < DEMO_PROBLEMS.length - 1) {
      setCurrentProblem(currentProblem + 1);
      resetDemo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Moklik Demo</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Problem {currentProblem + 1} of {DEMO_PROBLEMS.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Experience AI-Powered Math Tutoring
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Try solving this O-Level Additional Mathematics problem with step-by-step AI guidance
          </p>
        </div>

        {/* Problem Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem:</h2>
              <p className="text-lg text-gray-700 bg-gray-50 p-4 rounded-lg font-mono">
                {problem.question}
              </p>
            </div>
          </div>

          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isCorrect === true}
              />
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim() || isCorrect === true}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Check Answer
              </button>
            </div>
          </div>

          {/* Hint Button */}
          {!showSteps && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
          )}

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
              >
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <p className="text-yellow-800">{problem.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer Feedback */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 ${
                  isCorrect 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                   {isCorrect 
                     ? 'Correct! Well done!' 
                     : attemptCount >= 2 
                       ? 'Not quite right. Here\'s the step-by-step solution to help you understand:'
                       : `Not quite right. Try again! (Attempt ${attemptCount}/2)`
                   }
                  </p>
                </div>
               {!isCorrect && attemptCount < 2 && (
                 <div className="mt-3">
                   <p className="text-sm text-red-700">
                     💡 Tip: Make sure to include both solutions if there are two, and use the format shown in the example.
                   </p>
                 </div>
               )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step-by-Step Solution */}
          <AnimatePresence>
           {(showSteps && isCorrect) || showSolution ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
               className={`rounded-lg p-6 ${
                 isCorrect ? 'bg-blue-50' : 'bg-yellow-50 border border-yellow-200'
               }`}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                 {isCorrect ? 'Step-by-Step Solution:' : 'Here\'s how to solve this problem:'}
                </h3>
                
                <div className="space-y-4">
                  {problem.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                       opacity: showSolution || index <= currentStep ? 1 : 0.3,
                        x: 0 
                      }}
                      transition={{ delay: index * 0.5 }}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                       showSolution || index <= currentStep ? 'bg-white' : 'bg-gray-100'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                       showSolution || index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1">{step}</p>
                    </motion.div>
                  ))}
                </div>

               {!showSolution && currentStep < problem.steps.length - 1 && (
                  <button
                    onClick={nextStep}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next Step
                  </button>
                )}
               
               {showSolution && (
                 <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                   <h4 className="font-semibold text-green-800 mb-2">Final Answer:</h4>
                   <p className="text-green-700 font-mono text-lg">{problem.answer}</p>
                   <p className="text-sm text-green-600 mt-2">
                     Now try the problem again with this understanding!
                   </p>
                 </div>
               )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {currentProblem < DEMO_PROBLEMS.length - 1 ? (
            <button
              onClick={nextProblem}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Another Problem
            </button>
          ) : (
            <button
              onClick={resetDemo}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset Demo
            </button>
          )}
        </div>

        {/* CTA Section */}
        <AnimatePresence>
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white"
            >
              <h2 className="text-3xl font-bold mb-4">
                Ready for More Advanced Problems?
              </h2>
              <p className="text-xl mb-6 text-blue-100">
                Join thousands of students mastering O-Level Additional Mathematics with personalized AI tutoring
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Learning Free
                </Link>
                <Link
                  to="/"
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}