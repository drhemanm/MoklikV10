import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import type { ForumTopic, ForumPost, SortOption } from '../../types/forum.js';

const TOPICS_PER_PAGE = 20;
const POSTS_PER_PAGE = 50;

// Helper function to get sort field
function getSortField(sortBy: SortOption): string {
  switch (sortBy) {
    case 'popular':
      return 'likes';
    case 'unanswered':
      return 'replyCount';
    default:
      return 'createdAt';
  }
}

export const forumService = {
  // Topics
  async createTopic(topic: Omit<ForumTopic, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'replyCount'>): Promise<string> {
    const topicRef = await addDoc(collection(db, 'forum_topics'), {
      ...topic,
      title: topic.title,
      content: topic.content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      likes: 0,
      replyCount: 0
    });
    return topicRef.id;
  },

  async getTopics(sortBy: SortOption = 'newest', lastTopic?: ForumTopic) {
    let q = query(
      collection(db, 'forum_topics'),
      orderBy(getSortField(sortBy), 'desc'),
      limit(TOPICS_PER_PAGE)
    );

    if (lastTopic) {
      q = query(q, startAfter(lastTopic[getSortField(sortBy)]));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ForumTopic[];
  },

  async searchTopics(searchQuery: string) {
    // Note: For production, implement full-text search using a service like Algolia
    const q = query(
      collection(db, 'forum_topics'),
      where('title', '>=', searchQuery),
      where('title', '<=', searchQuery + '\uf8ff'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ForumTopic[];
  },

  async getTopic(topicId: string) {
    const topicRef = doc(db, 'forum_topics', topicId);
    const topicDoc = await getDoc(topicRef);
    
    if (!topicDoc.exists()) {
      throw new Error('Topic not found');
    }

    // Increment view count
    await updateDoc(topicRef, {
      views: increment(1)
    });

    return {
      id: topicDoc.id,
      ...topicDoc.data()
    } as ForumTopic;
  },

  // Posts
  async createPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likes'>): Promise<string> {
    const batch = db.batch();

    // Create post
    const postRef = doc(collection(db, 'forum_posts'));
    batch.set(postRef, {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0
    });

    // Update topic reply count
    const topicRef = doc(db, 'forum_topics', post.topicId);
    batch.update(topicRef, {
      replyCount: increment(1),
      updatedAt: serverTimestamp()
    });

    await batch.commit();
    return postRef.id;
  },

  async getPosts(topicId: string, lastPost?: ForumPost) {
    let q = query(
      collection(db, 'forum_posts'),
      where('topicId', '==', topicId),
      orderBy('createdAt', 'asc'),
      limit(POSTS_PER_PAGE)
    );

    if (lastPost) {
      q = query(q, startAfter(lastPost.createdAt));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ForumPost[];
  },

  async updatePost(postId: string, content: string) {
    const postRef = doc(db, 'forum_posts', postId);
    await updateDoc(postRef, {
      content,
      updatedAt: serverTimestamp()
    });
  },

  async deletePost(postId: string, topicId: string) {
    const batch = db.batch();

    // Delete post
    const postRef = doc(db, 'forum_posts', postId);
    batch.delete(postRef);

    // Update topic reply count
    const topicRef = doc(db, 'forum_topics', topicId);
    batch.update(topicRef, {
      replyCount: increment(-1)
    });

    await batch.commit();
  },

  // Likes
  async toggleLike(type: 'topic' | 'post', id: string, userId: string) {
    const likeRef = doc(db, `${type}_likes`, `${id}_${userId}`);
    const likeDoc = await getDoc(likeRef);

    const batch = db.batch();
    const targetRef = doc(db, type === 'topic' ? 'forum_topics' : 'forum_posts', id);

    if (likeDoc.exists()) {
      // Unlike
      batch.delete(likeRef);
      batch.update(targetRef, {
        likes: increment(-1)
      });
    } else {
      // Like
      batch.set(likeRef, {
        userId,
        createdAt: serverTimestamp()
      });
      batch.update(targetRef, {
        likes: increment(1)
      });
    }

    await batch.commit();
  }
};

// Firestore Security Rules for the forum
export const forumSecurityRules = `
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

    // Forum topics
    match /forum_topics/{topicId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
        && request.resource.data.authorId == request.auth.uid;
      allow update: if isOwner(resource.data.authorId);
      allow delete: if isOwner(resource.data.authorId);
    }

    // Forum posts
    match /forum_posts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
        && request.resource.data.authorId == request.auth.uid;
      allow update: if isOwner(resource.data.authorId);
      allow delete: if isOwner(resource.data.authorId);
    }

    // Likes
    match /{type}_likes/{likeId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() 
        && likeId.matches('^.*_' + request.auth.uid + '$');
    }
  }
}`;