// Replace the placeholder button click handler
const [showPayment, setShowPayment] = useState(false);

// Import at the top
import PayPalSubscription from './PayPalSubscription';

// Replace the CTA button onClick
<button
  onClick={() => setShowPayment(true)}
  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
>
  <span>Choose Your Plan</span>
  <ArrowRight className="w-5 h-5" />
</button>

// Add at the bottom before closing div
<PayPalSubscription
  isOpen={showPayment}
  onClose={() => setShowPayment(false)}
  onSuccess={() => window.location.reload()}
/>
