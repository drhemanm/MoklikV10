// Calculate derived values
  const isInTrial = subscriptionSummary?.isTrialUser || false;
  const daysRemaining = subscriptionSummary?.daysRemaining || 0;
  const isTrialExpired = isInTrial && daysRemaining <= 0;
  const isOnTrial = isInTrial && daysRemaining > 0; // Active trial (not expired)
  const hasAccess = subscriptionSummary?.hasAccess || false;

  return {
    subscription: subscriptionSummary,
    loading,
    error,
    refreshSubscription,
    
    // FIXED: Added missing canAccess property for AuthGuard
    canAccess: hasAccess,  // ← THIS WAS MISSING!
    hasAccess,             // ← Keep both for compatibility
    
    // Original convenience getters
    isInTrial,
    hasActiveSubscription: hasAccess && !isInTrial,
    daysRemaining,
    subscriptionPlan: subscriptionSummary?.plan || null,
    subscriptionStatus: subscriptionSummary?.status || null,
    
    // New getters for dashboard compatibility
    isOnTrial, // Active trial (has days left)
    isTrialExpired, // Trial but expired (0 days left)
    trialDaysLeft: daysRemaining // Alias for daysRemaining
  };
