// Load PayPal SDK for logged-in users
  useEffect(() => {
    if (user && !window.paypal) {
      const script = document.createElement('script');
      // FIXED: Use React environment variables instead of Vite
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.addEventListener('load', () => setPaypalLoaded(true));
      document.body.appendChild(script);
    } else if (user && window.paypal) {
      setPaypalLoaded(true);
    }
  }, [user]);

  // ... rest of code ...

  const renderPayPalButtons = () => {
    // Monthly Plan Button
    if (window.paypal && document.getElementById('paypal-monthly')) {
      window.paypal.Buttons({
        createSubscription: (data: any, actions: any) => {
          return actions.subscription.create({
            // FIXED: Use React environment variables
            plan_id: process.env.REACT_APP_PAYPAL_MONTHLY_PLAN_ID
          });
        },
        // ... rest stays the same
      }).render('#paypal-monthly');
    }

    // Yearly Plan Button
    if (window.paypal && document.getElementById('paypal-yearly')) {
      window.paypal.Buttons({
        createSubscription: (data: any, actions: any) => {
          return actions.subscription.create({
            // FIXED: Use React environment variables
            plan_id: process.env.REACT_APP_PAYPAL_YEARLY_PLAN_ID
          });
        },
        // ... rest stays the same
      }).render('#paypal-yearly');
    }
  };
