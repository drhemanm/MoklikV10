# Moklik V10 - Production Readiness Task List

**Created:** January 21, 2026
**Goal:** Take Moklik from current state to production-ready

---

## Priority Levels

| Level | Timeline | Description |
|-------|----------|-------------|
| 🔴 **P0 - Critical** | Before any release | Security blockers, data loss risks |
| 🟠 **P1 - High** | Before beta | Core functionality gaps |
| 🟡 **P2 - Medium** | Before production | Quality & reliability |
| 🟢 **P3 - Low** | Post-launch | Nice-to-have improvements |

---

## 🔴 P0 - Critical (Must Fix Before Any Release)

### Security Fixes

- [ ] **SEC-001: Move OpenAI calls to backend**
  - **Files:** `src/config/openai.ts`, `src/services/ai/openai.ts`, `src/hooks/useOpenAI.ts`
  - **Issue:** API key exposed via `dangerouslyAllowBrowser: true`
  - **Solution:** Create Firebase Cloud Function to proxy OpenAI requests
  - **Reference:** Pattern exists in `src/services/secureAIService.ts`
  ```javascript
  // functions/index.js - Add new function
  exports.chatWithAI = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated');
    const openai = new OpenAI({ apiKey: functions.config().openai.key });
    return await openai.chat.completions.create(data);
  });
  ```

- [ ] **SEC-002: Rotate and secure PayPal credentials**
  - **File:** `.env`
  - **Actions:**
    1. Log into PayPal Developer Dashboard
    2. Rotate client secret immediately
    3. Move to Firebase Functions config: `firebase functions:config:set paypal.secret="NEW_SECRET"`
    4. Update webhook handler in `functions/index.js`
    5. Verify `.env` is in `.gitignore`

- [ ] **SEC-003: Fix XSS vulnerability in RichTextEditor**
  - **File:** `src/components/forum/RichTextEditor.tsx:22,80`
  - **Solution:**
  ```bash
  npm install dompurify @types/dompurify
  ```
  ```typescript
  import DOMPurify from 'dompurify';

  // Before setting innerHTML
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href']
  });
  editorRef.current.innerHTML = sanitized;
  ```

- [ ] **SEC-004: Fix XSS in EnhancedChatInterface**
  - **File:** `src/components/chat/EnhancedChatInterface.tsx:555`
  - **Issue:** `dangerouslySetInnerHTML` with processed content
  - **Solution:** Use react-markdown with sanitization or DOMPurify

- [ ] **SEC-005: Move Firebase config to environment variables**
  - **File:** `src/config/firebase.ts`
  - **Solution:**
  ```typescript
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  ```

- [ ] **SEC-006: Implement password strength validation**
  - **File:** `src/components/auth/AuthForm.tsx`
  - **Current:** Only 6-character minimum
  - **Solution:** Use existing `src/services/security/passwordPolicy.ts` or add:
  ```typescript
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  ```

---

## 🟠 P1 - High (Before Beta Launch)

### Functionality Completion

- [ ] **FUNC-001: Implement real Stripe integration**
  - **File:** `src/services/subscription/stripeService.ts`
  - **Current:** Mock implementation with `Math.random()`
  - **Actions:**
    1. Create Stripe account and get API keys
    2. Implement actual Stripe Checkout flow
    3. Add webhook handler in Cloud Functions
    4. Test subscription lifecycle (create, cancel, renew)

- [ ] **FUNC-002: Delete duplicate useSubscription hook**
  - **Action:** Delete `src/hooks/useSubscription.js`
  - **Keep:** `src/hooks/useSubscription.jsx`
  ```bash
  rm src/hooks/useSubscription.js
  ```

- [ ] **FUNC-003: Replace hardcoded admin authentication**
  - **File:** `src/services/firebase/admin.ts:18-19`
  - **Solution:** Use Firebase Custom Claims (already partially implemented)
  ```typescript
  // Remove hardcoded check, use only:
  const tokenResult = await user.getIdTokenResult();
  return tokenResult.claims.admin === true;
  ```

- [ ] **FUNC-004: Implement password reset flow**
  - **Files to create/modify:**
    - `src/pages/ForgotPassword.tsx`
    - `src/components/auth/AuthForm.tsx` (add link)
  - **Use:** `sendPasswordResetEmail` from Firebase Auth

- [ ] **FUNC-005: Add email verification**
  - **File:** `src/hooks/useAuth.tsx`
  - **Solution:**
  ```typescript
  import { sendEmailVerification } from 'firebase/auth';

  // After signup
  await sendEmailVerification(user);
  ```

### Infrastructure

- [ ] **INFRA-001: Implement Redis-based rate limiting**
  - **File:** `src/services/rateLimit.ts`
  - **Current:** In-memory Map (resets on restart)
  - **Solution:** Use Upstash Redis or Firebase Realtime Database
  ```typescript
  // Cloud Function with rate limiting
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '60 s'),
  });
  ```

- [ ] **INFRA-002: Implement persistent session management**
  - **File:** `src/services/security/sessionManager.ts`
  - **Current:** In-memory storage
  - **Solution:** Store sessions in Firestore with TTL

- [ ] **INFRA-003: Add Firestore composite indexes**
  - **File:** Create `firestore.indexes.json`
  ```json
  {
    "indexes": [
      {
        "collectionGroup": "forum_posts",
        "queryScope": "COLLECTION",
        "fields": [
          { "fieldPath": "createdAt", "order": "DESCENDING" },
          { "fieldPath": "category", "order": "ASCENDING" }
        ]
      }
    ]
  }
  ```

---

## 🟡 P2 - Medium (Before Production)

### Code Quality

- [ ] **QUAL-001: Fix useEffect dependency arrays**
  - **Files:**
    - `src/pages/AccountSettings.tsx:31-33`
    - `src/hooks/useProgress.ts:68-84`
    - `src/hooks/useGamification.ts:63-67`
  - **Action:** Add missing dependencies or wrap functions in useCallback

- [ ] **QUAL-002: Replace `any` types in critical services**
  - **Priority files:**
    - `src/services/userInitializationService.ts` (17 instances)
    - `src/services/firebase/db.ts` (5 instances)
    - `src/hooks/useOpenAI.ts` (4 instances)
  - **Action:** Define proper interfaces in `src/types/`

- [ ] **QUAL-003: Replace alert() with toast notifications**
  - **Files:**
    - `src/pages/AccountSettings.tsx:67,71,76`
    - `src/components/chat/ChatHistory.tsx:144`
  - **Solution:** Use existing `react-hot-toast`
  ```typescript
  import toast from 'react-hot-toast';
  toast.success('Settings saved!');
  toast.error('Failed to save settings');
  ```

- [ ] **QUAL-004: Break down large components**
  - **Target files (>300 lines):**
    - `src/components/chat/EnhancedChatInterface.tsx` (775 lines)
    - `src/components/writing/WritingSubmission.tsx` (636 lines)
    - `src/pages/ModernDashboard.tsx` (606 lines)
  - **Action:** Extract into smaller focused components

- [ ] **QUAL-005: Remove console.log statements**
  - **Count:** 234 instances
  - **Action:**
  ```bash
  # Find all console.log statements
  grep -rn "console.log" src/ --include="*.ts" --include="*.tsx"
  ```
  - Replace with proper logging service or remove

### Performance

- [ ] **PERF-001: Add memoization to expensive components**
  - **Files:**
    - `src/components/chat/EnhancedChatInterface.tsx`
    - `src/pages/StudentDashboard.tsx`
  - **Action:** Wrap callbacks in `useCallback`, computed values in `useMemo`

- [ ] **PERF-002: Implement pagination for forum posts**
  - **File:** `src/services/firebase/forum.ts`
  - **Current:** `limit(50)` with no cursor
  - **Solution:** Implement cursor-based pagination

- [ ] **PERF-003: Split user document into subcollections**
  - **File:** `src/services/firebase/user.ts`
  - **Issue:** Gamification data grows unbounded
  - **Solution:**
  ```
  users/{userId}/dailyStats/{date}
  users/{userId}/achievements/{achievementId}
  ```

### Search & Discovery

- [ ] **SEARCH-001: Implement full-text search for forum**
  - **Current:** Prefix matching only (`where('title', '>=', query)`)
  - **Options:**
    1. Algolia (recommended for scale)
    2. Meilisearch (self-hosted)
    3. Firebase Extensions - Search with Algolia

---

## 🟢 P3 - Low (Post-Launch Improvements)

### Monitoring & Analytics

- [ ] **MON-001: Add error tracking (Sentry)**
  ```bash
  npm install @sentry/react
  ```
  ```typescript
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.1,
  });
  ```

- [ ] **MON-002: Add performance monitoring**
  - Options: Firebase Performance, LogRocket, Datadog RUM

- [ ] **MON-003: Add analytics dashboard for admins**
  - User signups over time
  - Active users (DAU/MAU)
  - Subscription conversion rates
  - Popular topics/subjects

### Testing

- [ ] **TEST-001: Add unit tests**
  - **Current:** Only E2E tests exist
  - **Setup:**
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom
  ```

- [ ] **TEST-002: Add integration tests for payment flows**
  - Test PayPal webhook handling
  - Test subscription state transitions
  - Test trial expiration

### Developer Experience

- [ ] **DX-001: Add path aliases to tsconfig**
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"],
        "@components/*": ["./src/components/*"],
        "@hooks/*": ["./src/hooks/*"],
        "@services/*": ["./src/services/*"]
      }
    }
  }
  ```

- [ ] **DX-002: Add pre-commit hooks**
  ```bash
  npm install -D husky lint-staged
  npx husky init
  ```

- [ ] **DX-003: Add API documentation**
  - Document Cloud Functions endpoints
  - Document Firestore data models
  - Add JSDoc to complex functions

### Features

- [ ] **FEAT-001: Add notification emails**
  - Welcome email on signup
  - Trial expiration reminder (3 days before)
  - Weekly progress summary

- [ ] **FEAT-002: Add offline support**
  - Cache recent conversations
  - Queue messages when offline
  - Sync when back online

- [ ] **FEAT-003: Add dark mode**
  - Already have Tailwind configured
  - Add theme toggle in settings

---

## Implementation Order

### Phase 1: Security (Week 1)
```
SEC-001 → SEC-002 → SEC-003 → SEC-004 → SEC-005 → SEC-006
```

### Phase 2: Core Functionality (Week 2)
```
FUNC-002 → FUNC-003 → FUNC-001 → FUNC-004 → FUNC-005
```

### Phase 3: Infrastructure (Week 3)
```
INFRA-001 → INFRA-002 → INFRA-003
```

### Phase 4: Quality & Polish (Week 4)
```
QUAL-001 → QUAL-002 → QUAL-003 → QUAL-004 → QUAL-005
PERF-001 → PERF-002 → PERF-003
```

### Phase 5: Post-Launch
```
MON-* → TEST-* → DX-* → FEAT-*
```

---

## Quick Reference Commands

```bash
# Check for any types
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | wc -l

# Check for console.log
grep -rn "console.log" src/ --include="*.ts" --include="*.tsx" | wc -l

# Check for dangerouslySetInnerHTML
grep -rn "dangerouslySetInnerHTML" src/ --include="*.tsx"

# Check for @ts-ignore
grep -rn "@ts-ignore" src/ --include="*.ts" --include="*.tsx"

# Find large files (>300 lines)
find src -name "*.tsx" -exec wc -l {} + | sort -rn | head -20

# Run type check
npm run type-check

# Run linter
npm run lint
```

---

## Definition of Done

A task is complete when:
- [ ] Code is written and tested locally
- [ ] No TypeScript errors (`npm run type-check` passes)
- [ ] No ESLint errors (`npm run lint` passes)
- [ ] Feature works in development
- [ ] Feature works in production build (`npm run build && npm run preview`)
- [ ] Changes are committed with descriptive message
- [ ] PR is created (if working in team)

---

*Task list generated by Claude Code AI*
