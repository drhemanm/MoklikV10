export const securityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // User profiles
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
      
      // Allow admins to read all profiles
      allow read: if get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }

    // User activities
    match /user_activities/{activityId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isOwner(request.resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // User resources
    match /user_resources/{resourceId} {
      allow read: if isOwner(resource.data.userId);
      allow write: if isOwner(request.resource.data.userId);
    }

    // Admin access
    match /admins/{adminId} {
      allow read: if isAuthenticated() && adminId == request.auth.uid;
      allow write: if false; // Admin writes only through backend
    }
  }
}
`;