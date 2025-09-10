import { useState, useEffect } from 'react';
import { ForumLayout } from '../components/forum/ForumLayout';
import { DiscussionList, Discussion } from '../components/forum/DiscussionList';
import { DiscussionDetail, Reply } from '../components/forum/DiscussionDetail';
import { NewDiscussionForm } from '../components/forum/NewDiscussionForm';
import { useAuth } from '../hooks/useAuth';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast, { toast as toastLib } from 'react-hot-toast';

export function ForumPage() {
  const { user } = useAuth();
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [showNewDiscussionForm, setShowNewDiscussionForm] = useState(false);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);

  // Load discussions from Firestore
  useEffect(() => {
    const discussionsRef = collection(db, 'forum_discussions');
    const q = query(discussionsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const discussionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Discussion[];
      
      setDiscussions(discussionData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading discussions:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load replies when discussion is selected
  useEffect(() => {
    if (!selectedDiscussion) {
      setReplies([]);
      return;
    }

    const repliesRef = collection(db, 'forum_replies');
    const q = query(
      repliesRef, 
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const replyData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }))
        .filter((reply: any) => reply.discussionId === selectedDiscussion.id) as Reply[];
      
      setReplies(replyData);
    });

    return () => unsubscribe();
  }, [selectedDiscussion]);

  // Track online users
  useEffect(() => {
    if (!user) return;

    // Update user's online status
    const userPresenceRef = doc(db, 'user_presence', user.uid);
    const updatePresence = async () => {
      try {
        await updateDoc(userPresenceRef, {
          isOnline: true,
          lastSeen: serverTimestamp(),
          displayName: user.displayName || user.email,
          location: 'forum'
        });
      } catch (error) {
        // If document doesn't exist, create it
        await setDoc(userPresenceRef, {
          isOnline: true,
          lastSeen: serverTimestamp(),
          displayName: user.displayName || user.email,
          location: 'forum'
        });
      }
    };

    updatePresence();

    // Update presence every 30 seconds
    const presenceInterval = setInterval(updatePresence, 30000);

    // Set user offline when they leave
    const handleBeforeUnload = async () => {
      await updateDoc(userPresenceRef, {
        isOnline: false,
        lastSeen: serverTimestamp()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Listen to online users count
    const presenceRef = collection(db, 'user_presence');
    const presenceQuery = query(presenceRef);
    
    const unsubscribePresence = onSnapshot(presenceQuery, (snapshot) => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      const onlineCount = snapshot.docs.filter(doc => {
        const data = doc.data();
        const lastSeen = data.lastSeen?.toDate();
        return data.isOnline && lastSeen && lastSeen > fiveMinutesAgo;
      }).length;
      
      setOnlineUsers(onlineCount);
    });

    return () => {
      clearInterval(presenceInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      unsubscribePresence();
      // Set user offline when component unmounts
      updateDoc(userPresenceRef, {
        isOnline: false,
        lastSeen: serverTimestamp()
      }).catch(console.error);
    };
  }, [user]);

  const handleSelectDiscussion = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    
    // Increment view count
    if (discussion.id) {
      const discussionRef = doc(db, 'forum_discussions', discussion.id);
      updateDoc(discussionRef, {
        views: increment(1)
      }).catch(console.error);
    }
  };

  const handleBackToList = () => {
    setSelectedDiscussion(null);
  };

  const handleAddReply = async (content: string) => {
    if (!selectedDiscussion || !user) return;
    
    try {
      const repliesRef = collection(db, 'forum_replies');
      await addDoc(repliesRef, {
        discussionId: selectedDiscussion.id,
        content,
        author: {
          id: user.uid,
          name: user.displayName || user.email || 'Anonymous',
        },
        createdAt: serverTimestamp(),
        likes: 0,
        dislikes: 0,
        isAnswer: false
      });
      
      // Update discussion reply count
      const discussionRef = doc(db, 'forum_discussions', selectedDiscussion.id);
      await updateDoc(discussionRef, {
        replies: increment(1),
        updatedAt: serverTimestamp()
      });
      
      toastLib.success('Reply posted successfully!');
    } catch (error) {
      console.error('Error posting reply:', error);
      toastLib.error('Failed to post reply. Please try again.');
    }
  };

  const handleVoteDiscussion = async (value: 'up' | 'down') => {
    if (!selectedDiscussion || !user) return;
    
    try {
      const discussionRef = doc(db, 'forum_discussions', selectedDiscussion.id);
      await updateDoc(discussionRef, {
        likes: increment(value === 'up' ? 1 : -1)
      });
    } catch (error) {
      console.error('Error voting on discussion:', error);
      toastLib.error('Failed to vote. Please try again.');
    }
  };

  const handleVoteReply = async (replyId: string, value: 'up' | 'down') => {
    if (!user) return;
    
    try {
      const replyRef = doc(db, 'forum_replies', replyId);
      await updateDoc(replyRef, {
        [value === 'up' ? 'likes' : 'dislikes']: increment(1)
      });
    } catch (error) {
      console.error('Error voting on reply:', error);
      toastLib.error('Failed to vote. Please try again.');
    }
  };

  const handleMarkAsAnswer = async (replyId: string) => {
    if (!selectedDiscussion || !user) return;
    
    try {
      const replyRef = doc(db, 'forum_replies', replyId);
      await updateDoc(replyRef, {
        isAnswer: true
      });
      
      // Update discussion solved status
      const discussionRef = doc(db, 'forum_discussions', selectedDiscussion.id);
      await updateDoc(discussionRef, {
        solved: true
      });
      
      toastLib.success('Answer marked as accepted!');
    } catch (error) {
      console.error('Error marking answer:', error);
      toastLib.error('Failed to mark answer. Please try again.');
    }
  };

  const handleCreateDiscussion = async (title: string, content: string, tags: string[]) => {
    if (!user) return;
    
    try {
      const discussionsRef = collection(db, 'forum_discussions');
      await addDoc(discussionsRef, {
        title,
        content,
        author: {
          id: user.uid,
          name: user.displayName || user.email || 'Anonymous',
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        tags,
        likes: 0,
        views: 0,
        replies: 0,
        solved: false
      });
      
      setShowNewDiscussionForm(false);
      toastLib.success('Discussion created successfully!');
    } catch (error) {
      console.error('Error creating discussion:', error);
      toastLib.error('Failed to create discussion. Please try again.');
    }
  };

  return (
    <ForumLayout
      title={selectedDiscussion ? selectedDiscussion.title : "Discussion Forum"}
      showBackButton={!!selectedDiscussion}
      onBack={handleBackToList}
      onlineUsers={onlineUsers}
    >
      {showNewDiscussionForm ? (
        <NewDiscussionForm
          onSubmit={handleCreateDiscussion}
          onCancel={() => setShowNewDiscussionForm(false)}
        />
      ) : selectedDiscussion ? (
        <DiscussionDetail
          discussion={selectedDiscussion}
          replies={replies}
          onAddReply={handleAddReply}
          onVoteDiscussion={handleVoteDiscussion}
          onVoteReply={handleVoteReply}
          onMarkAsAnswer={handleMarkAsAnswer}
          isLoading={false}
        />
      ) : (
        <>
          <Card className="mb-6">
            <CardBody className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Student Discussions
                </h1>
                <p className="text-gray-600 mt-1">
                  Connect with other students, ask questions, and share knowledge
                </p>
              </div>
              <Button
                onClick={() => setShowNewDiscussionForm(true)}
                variant="primary"
                leftIcon={<PlusCircle className="w-5 h-5" />}
              >
                New Discussion
              </Button>
            </CardBody>
          </Card>
          
          {discussions.length === 0 && !isLoading ? (
            <Card className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No discussions yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to start a discussion! Ask questions, share insights, or help other students.
              </p>
              <Button
                onClick={() => setShowNewDiscussionForm(true)}
                variant="primary"
                leftIcon={<PlusCircle className="w-5 h-5" />}
              >
                Start First Discussion
              </Button>
            </Card>
          ) : (
            <DiscussionList
              discussions={discussions}
              onSelectDiscussion={handleSelectDiscussion}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </ForumLayout>
  );
}