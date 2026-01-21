import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { LandingPage } from './pages/LandingPage.js';
import { DemoMode } from './pages/DemoMode.js';
import { OnboardingFlow } from './pages/OnboardingFlow.js';
import { NewDashboard } from './pages/NewDashboard.js';
import { ChatPage } from './pages/ChatPage.js';
import { WritingReview } from './pages/WritingReview.js';
import { ForumPage } from './pages/ForumPage.js';
import { PricingPage } from './pages/PricingPage.js';
import { Contact } from './pages/Contact.js';
import { AuthGuard } from './components/auth/AuthGuard.js';
import { Toaster } from 'react-hot-toast';
import { PrivacyPolicy } from './pages/PrivacyPolicy.js';
import { TermsOfService } from './pages/TermsOfService.js';
import AccountSettings from './pages/AccountSettings';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoMode />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
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
                <NewDashboard />
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
          <Route path="/account" element={
            <AuthGuard>
              <ErrorBoundary>
                <AccountSettings />
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
