import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { toast as toastLib } from 'react-hot-toast';

interface WritingSubmissionProps {
  onSubmissionComplete?: (feedback: WritingFeedback) => void;
}

interface WritingFeedback {
  id: string;
  originalText: string;
  overallScore: number;
  corrections: Correction[];
  suggestions: Suggestion[];
  improvementGuidelines: string[];
  resources: Resource[];
  positiveElements: string[];
}

interface Correction {
  id: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'structure';
  original: string;
  corrected: string;
  explanation: string;
  position: { start: number; end: number };
}

interface Suggestion {
  id: string;
  category: 'clarity' | 'flow' | 'style' | 'organization';
  text: string;
  improvement: string;
  example?: string;
}

interface Resource {
  title: string;
  description: string;
  url?: string;
  type: 'exercise' | 'guide' | 'practice';
}

export function WritingSubmission({ onSubmissionComplete }: WritingSubmissionProps) {
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const focusAreaOptions = [
    'Grammar and Spelling',
    'Sentence Structure',
    'Clarity of Ideas',
    'Organization and Flow',
    'Style and Tone',
    'Vocabulary Usage',
    'Paragraph Development',
    'Conclusion Strength'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }

      const allowedTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a text file, PDF, or Word document');
        return;
      }

      setUploadedFile(file);
      
      // For demo purposes, simulate file reading
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSubmissionText(e.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        toastLib.success('File uploaded successfully! Content will be extracted for analysis.');
      }
    }
  };

  const toggleFocusArea = (area: string) => {
    setFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const analyzeWriting = async () => {
    if (!submissionText.trim() && !uploadedFile) {
      toastLib.error('Please upload a text file, PDF, or Word document');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockFeedback: WritingFeedback = {
        id: Date.now().toString(),
        originalText: submissionText,
        overallScore: 78,
        corrections: [
          {
            id: '1',
            type: 'grammar',
            original: 'The students was working',
            corrected: 'The students were working',
            explanation: 'Subject-verb agreement: "students" is plural, so use "were" instead of "was"',
            position: { start: 0, end: 20 }
          },
          {
            id: '2',
            type: 'spelling',
            original: 'recieve',
            corrected: 'receive',
            explanation: 'Common spelling error: "i" before "e" except after "c"',
            position: { start: 45, end: 52 }
          },
          {
            id: '3',
            type: 'structure',
            original: 'Because it was raining. We stayed inside.',
            corrected: 'Because it was raining, we stayed inside.',
            explanation: 'Avoid sentence fragments. Combine related clauses with appropriate punctuation.',
            position: { start: 80, end: 120 }
          }
        ],
        suggestions: [
          {
            id: '1',
            category: 'clarity',
            text: 'Consider breaking down complex sentences into simpler ones for better readability.',
            improvement: 'Your third paragraph contains several long sentences that could be simplified.',
            example: 'Instead of: "The research, which was conducted over several months and involved multiple participants, showed significant results." Try: "The research was conducted over several months with multiple participants. It showed significant results."'
          },
          {
            id: '2',
            category: 'flow',
            text: 'Add transition words between paragraphs to improve flow.',
            improvement: 'Your ideas are good, but the connection between paragraphs could be smoother.',
            example: 'Use words like "Furthermore," "However," "In addition," or "Consequently" to link your ideas.'
          },
          {
            id: '3',
            category: 'organization',
            text: 'Consider reorganizing your main points in order of importance.',
            improvement: 'Your strongest argument appears in the middle. Consider moving it to the beginning or end for greater impact.'
          }
        ],
        improvementGuidelines: [
          'Practice subject-verb agreement with plural subjects',
          'Review common spelling patterns and exceptions',
          'Work on combining related sentences to avoid fragments',
          'Use transition words to improve paragraph flow',
          'Organize arguments from strongest to weakest or vice versa'
        ],
        resources: [
          {
            title: 'Grammar Fundamentals',
            description: 'Interactive exercises on subject-verb agreement and common grammar rules',
            type: 'exercise'
          },
          {
            title: 'Spelling Patterns Guide',
            description: 'Comprehensive guide to English spelling rules and exceptions',
            type: 'guide'
          },
          {
            title: 'Transition Words Practice',
            description: 'Practice using transition words to improve writing flow',
            type: 'practice'
          },
          {
            title: 'Essay Organization Techniques',
            description: 'Learn different methods for organizing your ideas effectively',
            type: 'guide'
          }
        ],
        positiveElements: [
          'Strong vocabulary usage throughout the piece',
          'Clear thesis statement in the introduction',
          'Good use of specific examples to support arguments',
          'Consistent tone and voice maintained',
          'Effective conclusion that summarizes main points'
        ]
      };

      setFeedback(mockFeedback);
      onSubmissionComplete?.(mockFeedback);
      toastLib.success('Analysis complete! Review your detailed feedback below.');
    } catch (error) {
      toastLib.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearSubmission = () => {
    setSubmissionText('');
    setUploadedFile(null);
    setFocusAreas([]);
    setFeedback(null);
  };

  if (feedback) {
    return <WritingFeedbackDisplay feedback={feedback} onStartNew={clearSubmission} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Writing Review & Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Submit your written work for comprehensive analysis and personalized feedback 
            on grammar, structure, clarity, and style.
          </p>
        </div>

        {/* Submission Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Text Input */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Paste Your Text
            </h3>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Paste your writing here for analysis..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              {submissionText.length} characters
            </p>
          </div>

          {/* File Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-green-600" />
              Upload Document
            </h3>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              {uploadedFile ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 text-green-600 mx-auto" />
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      setSubmissionText('');
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">Click to upload a document</p>
                  <p className="text-sm text-gray-500">
                    PDF, Word, or Text files (max 5MB)
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Focus Areas */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Focus Areas (Optional)
          </h3>
          <p className="text-gray-600 mb-4">
            Select specific areas you'd like Moklik to focus on during the review:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {focusAreaOptions.map((area) => (
              <button
                key={area}
                onClick={() => toggleFocusArea(area)}
                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                  focusAreas.includes(area)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={analyzeWriting}
            disabled={(!submissionText.trim() && !uploadedFile) || isAnalyzing}
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 mx-auto"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing your writing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Get Detailed Feedback</span>
              </>
            )}
          </button>
          
          {focusAreas.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Focusing on: {focusAreas.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function WritingFeedbackDisplay({ feedback, onStartNew }: { 
  feedback: WritingFeedback; 
  onStartNew: () => void; 
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'corrections' | 'suggestions' | 'resources'>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Writing Analysis Complete</h1>
              <p className="text-blue-100">
                Here's your comprehensive feedback and improvement recommendations
              </p>
            </div>
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full ${getScoreBackground(feedback.overallScore)} flex items-center justify-center mb-2`}>
                <span className={`text-2xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                  {feedback.overallScore}
                </span>
              </div>
              <p className="text-sm text-blue-100">Overall Score</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'corrections', label: 'Corrections', icon: CheckCircle },
              { id: 'suggestions', label: 'Suggestions', icon: AlertCircle },
              { id: 'resources', label: 'Resources', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Positive Elements */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                      Strengths in Your Writing
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {feedback.positiveElements.map((element, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800">{element}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvement Guidelines */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-6 h-6 text-blue-600 mr-2" />
                      Key Areas for Improvement
                    </h3>
                    <div className="space-y-3">
                      {feedback.improvementGuidelines.map((guideline, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <p className="text-blue-800">{guideline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'corrections' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Specific Corrections ({feedback.corrections.length})
                  </h3>
                  <div className="space-y-6">
                    {feedback.corrections.map((correction) => (
                      <div key={correction.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            correction.type === 'grammar' ? 'bg-red-100 text-red-800' :
                            correction.type === 'spelling' ? 'bg-yellow-100 text-yellow-800' :
                            correction.type === 'punctuation' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {correction.type.charAt(0).toUpperCase() + correction.type.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Original:</p>
                            <p className="bg-red-50 border border-red-200 rounded p-3 text-red-800">
                              {correction.original}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Corrected:</p>
                            <p className="bg-green-50 border border-green-200 rounded p-3 text-green-800">
                              {correction.corrected}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded p-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                          <p className="text-gray-600">{correction.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Improvement Suggestions ({feedback.suggestions.length})
                  </h3>
                  <div className="space-y-6">
                    {feedback.suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            suggestion.category === 'clarity' ? 'bg-blue-100 text-blue-800' :
                            suggestion.category === 'flow' ? 'bg-green-100 text-green-800' :
                            suggestion.category === 'style' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">{suggestion.text}</h4>
                        <p className="text-gray-600 mb-4">{suggestion.improvement}</p>
                        
                        {suggestion.example && (
                          <div className="bg-gray-50 rounded p-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Example:</p>
                            <p className="text-gray-600 text-sm">{suggestion.example}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Recommended Learning Resources
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {feedback.resources.map((resource, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            resource.type === 'exercise' ? 'bg-blue-100 text-blue-800' :
                            resource.type === 'guide' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {resource.type}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{resource.description}</p>
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Access Resource →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center">
          <button
            onClick={onStartNew}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Submit New Writing</span>
          </button>
          
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save to Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}