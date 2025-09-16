// src/components/subscription/SubscriptionGate.tsx
import React from 'react';
import { Lock, CreditCard, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature?: string;
  fallbackMessage?: string;
}

export function SubscriptionGate({ 
  children, 
  feature = "this feature",
  fallbackMessage 
}: SubscriptionGateProps) {
  const { 
    canAccess,        // ✅ FIXED: Changed from hasAccess to canAccess
    isTrialExpired, 
    loading, 
    daysRemaining, 
    subscriptionStatus 
  } = useSubscription();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If user has access, render children normally
  if (canAccess) {  // ✅ FIXED: Changed from hasAccess to canAccess
    return <>{children}</>;
  }

  // User doesn't have access - show appropriate blocking message
  const getBlockingContent = () => {
    if (isTrialExpired) {
      return {
        icon: <Lock className="w-16 h-16 text-red-500" />,
        title: "Trial Expired",
        message: "Your free trial has ended. Subscribe now to continue using Moklik AI tutoring.",
        buttonText: "Subscribe Now",
        buttonColor: "bg-red-600 hover:bg-red-700",
        urgency: true
      };
    }

    if (subscriptionStatus === 'payment_required') {
      return {
        icon: <CreditCard className="w-16 h-16 text-orange-500" />,
        title: "Payment Required",
        message: "Your payment is past due. Please update your payment method to continue using Moklik.",
        buttonText: "Update Payment",
        buttonColor: "bg-orange-600 hover:bg-orange-700",
        urgency: true
      };
    }

    if (subscriptionStatus === 'canceled') {
      return {
        icon: <AlertTriangle className="w-16 h-16 text-gray-500" />,
        title: "Subscription Canceled",
        message: "Your subscription has been canceled. Reactivate to continue learning with Moklik AI.",
        buttonText: "Reactivate Subscription",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        urgency: false
      };
    }

    // Default case
    return {
      icon: <Lock className="w-16 h-16 text-blue-500" />,
      title: "Subscription Required",
      message: fallbackMessage || `You need an active subscription to access ${feature}.`,
      buttonText: "View Plans",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      urgency: false
    };
  };

  const blockingContent = getBlockingContent();

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          {blockingContent.icon}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {blockingContent.title}
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {blockingContent.message}
        </p>

        {blockingContent.urgency && daysRemaining >= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">
                Trial ended {Math.abs(daysRemaining)} days ago
              </span>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Link
            to="/pricing"
            className={`inline-block w-full px-6 py-3 ${blockingContent.buttonColor} text-white rounded-lg transition-colors font-medium`}
          >
            {blockingContent.buttonText}
          </Link>
          
          <Link
            to="/dashboard"
            className="inline-block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Feature Benefits Reminder */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">
            What you're missing:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Unlimited AI tutoring sessions</li>
            <li>• Step-by-step problem solving</li>
            <li>• Homework help and feedback</li>
            <li>• Progress tracking and achievements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
