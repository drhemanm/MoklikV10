import {
  doc,
  increment,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { userService } from './user.js';

export const voteService = {
  async vote(
    type: 'topic' | 'post',
    id: string,
    userId: string,
    value: 1 | -1
  ): Promise<void> {
    const voteRef = doc(db, `${type}_votes`, `${id}_${userId}`);
    const itemRef = doc(db, type === 'topic' ? 'forum_topics' : 'forum_posts', id);

    await runTransaction(db, async (transaction) => {
      const voteDoc = await transaction.get(voteRef);
      const itemDoc = await transaction.get(itemRef);
      
      if (!itemDoc.exists()) {
        throw new Error('Item not found');
      }

      const authorId = itemDoc.data().authorId;
      const xpChange = value === 1 ? 10 : -5;

      if (!voteDoc.exists()) {
        // New vote
        transaction.set(voteRef, {
          userId,
          value,
          createdAt: serverTimestamp()
        });

        transaction.update(itemRef, {
          score: increment(value),
          [`votes.${value === 1 ? 'up' : 'down'}`]: increment(1)
        });

        // Update author's reputation
        await userService.updateReputation(authorId, xpChange);
      } else {
        const existingVote = voteDoc.data();
        if (existingVote.value === value) {
          // Remove vote
          transaction.delete(voteRef);
          transaction.update(itemRef, {
            score: increment(-value),
            [`votes.${value === 1 ? 'up' : 'down'}`]: increment(-1)
          });
          await userService.updateReputation(authorId, -xpChange);
        } else {
          // Change vote
          transaction.update(voteRef, {
            value,
            updatedAt: serverTimestamp()
          });
          transaction.update(itemRef, {
            score: increment(value * 2),
            [`votes.${value === 1 ? 'up' : 'down'}`]: increment(1),
            [`votes.${value === 1 ? 'down' : 'up'}`]: increment(-1)
          });
          await userService.updateReputation(authorId, xpChange * 2);
        }
      }
    });
  }
};