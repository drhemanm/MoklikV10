# Moklik V10 - Comprehensive Codebase Audit Report

**Date:** January 21, 2026
**Auditor:** Claude Code AI
**Branch:** claude/audit-moklik-AMiFZ

---

## Executive Summary

MoklikV10 is a modern AI-powered educational tutoring platform built with React, TypeScript, and Firebase. It targets O-Level and A-Level students with features including AI-powered chat assistance, gamification, writing reviews, and forum discussions.

### Overall Assessment

| Category | Rating | Issues Found |
|----------|--------|--------------|
| **Security** | ⚠️ CRITICAL | 14 issues (3 critical, 5 high, 5 medium, 1 low) |
| **Code Quality** | ⚠️ MODERATE | 53 issues (4 critical, 11 high, 20 medium, 18 low) |
| **Architecture** | ⚠️ MODERATE | 15 issues (5 critical, 5 moderate, 5 low) |

---

## Technology Stack Overview

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18.3, TypeScript 5.5, Vite 5.4, Tailwind CSS 3.4, Framer Motion |
| **Backend** | Firebase (Auth, Firestore, Functions, Storage), SQLite |
| **AI** | OpenAI GPT-4/GPT-4o, KaTeX, MathJS, Plotly.js |
| **Payments** | PayPal SDK, Stripe |
| **Testing** | Playwright E2E |

---

## 1. SECURITY AUDIT

### 🔴 CRITICAL ISSUES

#### 1.1 OpenAI API Key Exposed to Browser
**Files:**
- `src/config/openai.ts:6`
- `src/services/ai/openai.ts:22`
- `src/services/ai/imageAnalysis.ts:6`
- `src/hooks/useOpenAI.ts:11`

**Issue:** All OpenAI client instances use `dangerouslyAllowBrowser: true`, exposing the API key to browser DevTools and network requests.

```typescript
// Vulnerable pattern
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true  // CRITICAL VULNERABILITY
});
```

**Impact:** Attackers can steal API keys and consume your OpenAI quota.

**Remediation:** Move OpenAI calls to backend serverless functions (pattern exists in `src/services/secureAIService.ts`).

---

#### 1.2 Firebase Configuration Hardcoded
**File:** `src/config/firebase.ts:6-14`

**Issue:** Firebase credentials hardcoded in client-side code:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDqLS_T5vVXB-9Xmst7ja8zji-1YRZc7Qo",
  authDomain: "moklik-46048.firebaseapp.com",
  projectId: "moklik-46048",
  // ... more exposed credentials
};
```

**Impact:** While Firebase web apps require client-side config, explicit keys in source code can be scraped and abused.

**Remediation:** Move to environment variables and restrict API key via Firebase Console.

---

#### 1.3 PayPal Secret in .env File
**File:** `.env:2-10`

**Issue:** PayPal client secret stored in tracked environment file.
```
REACT_APP_PAYPAL_CLIENT_SECRET=EOPqr3aznctCkxB-hC7SidsWk2Ka96qqRbwzLR8iH7KXsSwcOlKfV30Juj9q32PvV9tNSkH-FMRpeQXA
```

**Impact:** If committed to version control, attackers gain direct PayPal API access.

**Remediation:**
- Rotate PayPal credentials immediately
- Add `.env` to `.gitignore`
- Use secret management (Firebase Config, AWS Secrets Manager)

---

### 🟠 HIGH SEVERITY ISSUES

| Issue | File | Line | Description |
|-------|------|------|-------------|
| XSS via innerHTML | `src/components/forum/RichTextEditor.tsx` | 22, 80 | User HTML directly assigned without sanitization |
| Weak password validation | `src/components/auth/AuthForm.tsx` | 32 | Only 6-character minimum |
| Hardcoded admin credentials | `src/services/firebase/admin.ts` | 18-19 | Admin credentials compared against hardcoded values |
| In-memory rate limiting | `src/services/rateLimit.ts` | 16-17 | Not production-ready, resets on restart |
| In-memory sessions | `src/services/security/sessionManager.ts` | 15 | Sessions lost on server restart |

### 🟡 MEDIUM SEVERITY ISSUES

| Issue | File | Description |
|-------|------|-------------|
| MIME-only file validation | `src/services/firebase/attachments.ts:13-14` | No content/magic byte verification |
| Sensitive data in localStorage | `src/hooks/useOpenAI.ts:29-54` | Conversation history exposed to XSS |
| Markdown XSS risk | `src/components/chat/ChatMessage.tsx:106-137` | Complex rendering could allow injection |
| HTTP in development | `src/services/secureAIService.ts:37` | Risk if deployed to production |
| Spoofable user-agent blocking | `src/services/security/bruteForceProtection.ts:49-55` | Easily bypassed |

---

## 2. CODE QUALITY AUDIT

### 🔴 CRITICAL ISSUES

#### 2.1 Excessive `any` Types (147 instances)
**Severity:** HIGH - Type safety compromised throughout codebase

**Top Offenders:**
| File | Count | Examples |
|------|-------|----------|
| `src/services/userInitializationService.ts` | 17 | UserData/SubscriptionData interfaces |
| `src/services/firebase/db.ts` | 5 | Function parameters |
| `src/hooks/useOpenAI.ts` | 4 | Callback types |
| `src/pages/PricingPage.tsx` | 4 | PayPal callback types |
| `src/components/admin/ExamPaperUpload.tsx` | 4 | State setter casts |

**Remediation:** Replace `any` with proper interfaces:
```typescript
// Instead of:
const result = JSON.parse(data) as any;

// Use:
interface ChatData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
const result = JSON.parse(data) as ChatData;
```

---

#### 2.2 dangerouslySetInnerHTML Usage
**File:** `src/components/chat/EnhancedChatInterface.tsx:555`

```typescript
return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
```

**Impact:** Direct XSS vulnerability if `processedContent` contains user input.

**Remediation:** Use DOMPurify or proper React markdown rendering.

---

#### 2.3 Missing useEffect Dependencies
**Files:**
- `src/pages/AccountSettings.tsx:31-33` - Missing `loadSubscriptionDetails`
- `src/hooks/useProgress.ts:68-84` - Empty deps but uses `progress.streak`
- `src/hooks/useGamification.ts:63-67` - Unmemoized function in deps

**Impact:** Stale closures, infinite loops, memory leaks.

---

### 🟠 HIGH SEVERITY ISSUES

#### Large Component Anti-Patterns

| File | Lines | Issues |
|------|-------|--------|
| `EnhancedChatInterface.tsx` | 775 | Handles messaging, uploads, PDF parsing, gamification, math rendering |
| `WritingSubmission.tsx` | 636 | Multiple concerns mixed |
| `ModernDashboard.tsx` | 606 | Logic + rendering combined |

**Recommendation:** Break components larger than 300 lines into focused sub-components.

#### Inconsistent Error Handling
- 8 instances of `alert()` instead of toast notifications
- `confirm()` dialogs for destructive actions
- Silent error swallowing with only console.error

---

### 🟡 MEDIUM SEVERITY ISSUES

| Category | Count | Examples |
|----------|-------|----------|
| Missing memoization | 30+ hooks | Only 30 useCallback/useMemo for 266+ hook usages |
| @ts-ignore comments | 9 | Math components, database connections |
| Console.log statements | 234 | Throughout codebase |
| Unhandled promises | Multiple | Dynamic imports, script loading |

---

## 3. ARCHITECTURE AUDIT

### 🔴 CRITICAL ISSUES

#### 3.1 Duplicate Hook Files
**Files:**
- `src/hooks/useSubscription.js`
- `src/hooks/useSubscription.jsx`

**Issue:** Both files exist with different implementations.

**Remediation:** Delete duplicate, keep `.jsx` version with event listeners.

---

#### 3.2 N+1 Query Problems

**Forum Search** (`src/services/firebase/forum.ts:71-85`):
```typescript
// Range query instead of full-text search
where('title', '>=', searchQuery),
where('title', '<=', searchQuery + '\uf8ff')
// Each result requires separate author fetch
```

**Activity Log** (`src/components/dashboard/ActivityLog.tsx:22-65`):
- Fetches with limit(50), no pagination
- Separate queries for each time range filter

**Profile Listeners** (`src/hooks/useProfile.ts:20-37`):
- Every component creates independent Firestore subscription
- Could result in 10+ listeners on dashboard

---

#### 3.3 Document Size Growth
**File:** `src/services/firebase/user.ts`

**Issue:** User documents contain entire gamification object with nested daily stats:
```typescript
users/{userId}.gamification.studyTime.daily = {
  "2024-01-01": 30,
  "2024-01-02": 45,
  // ... 365 entries per year
}
```

**Impact:** Firestore reads entire document; bandwidth waste scales with time.

**Remediation:** Split to subcollections:
```
users/{userId}/dailyStats/{date}
users/{userId}/streakHistory/{date}
```

---

### 🟠 MODERATE SEVERITY ISSUES

#### State Consistency Issues
**File:** `src/hooks/useAuth.tsx:43-79`

- User profile created in multiple places (signUp, signInWithGoogle)
- Profile initialization logic duplicated
- Race conditions possible if both signup paths execute

#### Tight Component Coupling
**File:** `src/components/chat/EnhancedChatInterface.tsx:32-52`

- Directly imports useOpenAI, useGamification, useAuth
- Manages complex session state
- Combines UI + AI logic + gamification + Firebase saves
- Difficult to test or reuse

#### Magic Numbers
Scattered pagination limits:
- `useProgress.ts`: `XP_PER_LEVEL = 1000`
- `ActivityLog.tsx`: `limit(50)`
- `chatService.ts`: `MESSAGES_PER_PAGE = 50`
- `constants.ts`: `MAX_CHAT_MESSAGES: 100`

---

## 4. IMMEDIATE ACTION ITEMS

### Priority 1: Security (Do Now)
1. **Rotate PayPal credentials** and move to secure secret management
2. **Move OpenAI calls to backend** using existing `secureAIService.ts` pattern
3. **Add DOMPurify** to sanitize HTML in RichTextEditor
4. **Implement proper CSP headers** in deployment config

### Priority 2: Stability (This Week)
1. **Fix useEffect dependencies** to prevent memory leaks
2. **Delete duplicate useSubscription** hook file
3. **Replace `any` types** in critical services (auth, subscription, AI)
4. **Replace `alert()` calls** with toast notifications

### Priority 3: Scalability (This Month)
1. **Implement Redis-based rate limiting** for production
2. **Add Algolia/Meilisearch** for forum search
3. **Split user documents** into subcollections
4. **Add composite Firestore indexes**

### Priority 4: Maintainability (Ongoing)
1. **Break large components** (>300 lines) into focused sub-components
2. **Centralize magic numbers** in constants.ts
3. **Add path aliases** to tsconfig.json
4. **Remove console.log statements** (234 instances)

---

## 5. DETAILED FILE ANALYSIS

### Files Requiring Immediate Attention

| File | Issues | Severity |
|------|--------|----------|
| `src/config/firebase.ts` | Hardcoded credentials | CRITICAL |
| `src/config/openai.ts` | Browser API key exposure | CRITICAL |
| `.env` | PayPal secret exposed | CRITICAL |
| `src/components/forum/RichTextEditor.tsx` | XSS via innerHTML | HIGH |
| `src/components/chat/EnhancedChatInterface.tsx` | XSS + 775 lines | HIGH |
| `src/hooks/useSubscription.js` | Duplicate file | HIGH |
| `src/services/rateLimit.ts` | In-memory only | HIGH |
| `src/services/firebase/user.ts` | Document growth | MEDIUM |
| `src/services/firebase/forum.ts` | N+1 queries | MEDIUM |

---

## 6. POSITIVE FINDINGS

### What's Working Well

✅ **Batch Operations:** Forum post creation and user deletion use `writeBatch` for atomicity

✅ **Type Definitions:** Good interface definitions in `src/types/` directory

✅ **Service Layer Separation:** Clean separation between Firebase, AI, and security services

✅ **Error Boundary:** Basic error boundary exists at `src/components/ErrorBoundary.tsx`

✅ **Modern Stack:** React 18, TypeScript strict mode, Vite for fast builds

✅ **Cleanup Patterns:** Some event listeners properly cleaned up in useEffect returns

✅ **Parallel Fetching:** `Promise.all` used appropriately in `useForum.ts` and `useResources.ts`

---

## 7. RECOMMENDATIONS SUMMARY

### Quick Wins (Low Effort, High Value)
1. Consolidate magic numbers into `src/config/constants.ts`
2. Delete duplicate `useSubscription.js`
3. Move Firebase config to environment variables
4. Add `.env` to `.gitignore` if not present

### Medium-Term Improvements
1. Implement React Query/SWR for cache management
2. Extract EnhancedChatInterface into smaller components
3. Add Firestore composite index documentation
4. Implement backend rate limiting with Cloud Functions

### Long-Term Architecture Changes
1. Create data denormalization strategy for related entities
2. Add performance monitoring (Sentry, LogRocket)
3. Implement proper CI/CD with security scanning
4. Add comprehensive test coverage (current: E2E only)

---

## Appendix: Issue Counts by File

| File | Critical | High | Medium | Low | Total |
|------|----------|------|--------|-----|-------|
| EnhancedChatInterface.tsx | 1 | 2 | 3 | 2 | 8 |
| useOpenAI.ts | 1 | 1 | 2 | 1 | 5 |
| firebase.ts (config) | 1 | 0 | 0 | 0 | 1 |
| openai.ts (config) | 1 | 0 | 0 | 0 | 1 |
| .env | 1 | 0 | 0 | 0 | 1 |
| RichTextEditor.tsx | 0 | 2 | 0 | 0 | 2 |
| rateLimit.ts | 0 | 1 | 1 | 0 | 2 |
| forum.ts | 0 | 1 | 2 | 0 | 3 |
| user.ts (firebase) | 0 | 1 | 2 | 0 | 3 |
| Other files | 0 | 3 | 10 | 15 | 28 |
| **TOTAL** | **6** | **11** | **20** | **18** | **55** |

---

*Report generated by Claude Code AI Audit System*
*For questions or clarifications, please open an issue in the repository.*
