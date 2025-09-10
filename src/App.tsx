import { Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { LandingPage } from './pages/LandingPage.js';
import { DemoMode } from './pages/DemoMode.js';
import { OnboardingFlow } from './pages/OnboardingFlow.js';
import { StudentDashboard } from './pages/StudentDashboard.js';
import { ChatPage } from './pages/ChatPage.js';
import { WritingReview } from './pages/WritingReview.js';
import { ForumPage } from './pages/ForumPage.js';
import { PricingPage } from './pages/PricingPage.js';
import { Contact } from './pages/Contact.js';
import { AuthGuard } from './components/auth/AuthGuard.js';
import { useAuth } from './hooks/useAuth.js';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoMode />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route path="/onboarding" element={
            <AuthGuard>
              <OnboardingFlow />
            </AuthGuard>
          } />
          <Route path="/forum" element={
            <AuthGuard>
              <ErrorBoundary>
                <ForumPage />
              </ErrorBoundary>
            </AuthGuard>
          } />
          <Route path="/dashboard" element={
            <AuthGuard>
              <ErrorBoundary>
                <StudentDashboard />
              </ErrorBoundary>
            </AuthGuard>
          } />
          <Route path="/chat" element={
            <AuthGuard>
              <ErrorBoundary>
                <ChatPage />
              </ErrorBoundary>
            </AuthGuard>
          } />
          <Route path="/writing-review" element={
            <AuthGuard>
              <ErrorBoundary>
                <WritingReview />
              </ErrorBoundary>
            </AuthGuard>
          } />
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A73E8',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}