import { useState } from 'react';
import { Clock, Award, HelpCircle, Send } from 'lucide-react';
import { useExercises, Exercise } from '../hooks/useExercises.js';
import { MathEquation } from './MathEquation.js';
import { LoadingSpinner } from './ui/LoadingSpinner.js';

interface ExerciseSectionProps {
  topic: string;
}

export function ExerciseSection({ topic }: ExerciseSectionProps) {
  const {
    exercises,
    examMode,
    isLoading,
    generateExercises,
    startExamMode,
    endExamMode,
    submitAnswer,
    showNextHint
  } = useExercises();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleGenerateExercises = () => {
    generateExercises(topic, 3, selectedDifficulty);
    setAnswers({});
  };

  const handleStartExam = () => {
    startExamMode(topic, 60 * 30); // 30 minutes
    setAnswers({});
  };

  const handleSubmitAnswer = async (exercise: Exercise) => {
    const answer = answers[exercise.id];
    if (!answer) return;

    await submitAnswer(exercise.id, answer);
    // Clear answer after submission
    setAnswers(prev => ({ ...prev, [exercise.id]: '' }));
  };

  return (
    <div className="space-y-6">
      {!examMode.isActive && (
        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button
              onClick={handleGenerateExercises}
              disabled={isLoading}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Practice Exercises
            </button>
          </div>
          <button
            onClick={handleStartExam}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            <Clock className="w-4 h-4" />
            <span>Start Exam Mode</span>
          </button>
        </div>
      )}

      {examMode.isActive && (
        <div className="bg-purple-50 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Exam Mode</span>
          </div>
          <button
            onClick={endExamMode}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            End Exam
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6">
          {exercises.map((exercise: any) => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Question:</h3>
                    <div className="text-gray-700">
                      <MathEquation equation={exercise.question} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {exercise.isCorrect === true && (
                      <Award className="w-5 h-5 text-green-500" />
                    )}
                    <span className={`text-sm font-medium capitalize px-2 py-1 rounded-full ${
                      exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    value={answers[exercise.id] || ''}
                    onChange={(e) => setAnswers(prev => ({
                      ...prev,
                      [exercise.id]: e.target.value
                    }))}
                    placeholder="Enter your answer here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => showNextHint(exercise.id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm">Hint</span>
                    </button>
                    
                    <button
                      onClick={() => handleSubmitAnswer(exercise)}
                      disabled={!answers[exercise.id]}
                      className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit</span>
                    </button>
                  </div>
                </div>

                {exercise.currentHintIndex >= 0 && exercise.hints[exercise.currentHintIndex] && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Hint {exercise.currentHintIndex + 1}:</strong>{' '}
                      {exercise.hints[exercise.currentHintIndex]}
                    </p>
                  </div>
                )}

                {exercise.isCorrect !== undefined && (
                  <div className={`p-4 rounded-lg ${
                    exercise.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <p className="text-sm">{exercise.feedback}</p>
                    {!exercise.isCorrect && (
                      <button
                        onClick={() => setAnswers(prev => ({ ...prev, [exercise.id]: '' }))}
                        className="mt-2 text-sm font-medium hover:underline"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}