import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

export const attachmentService = {
  async uploadAttachment(file: File, userId: string): Promise<string> {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 5MB');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only images and PDFs are allowed.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, `forum_attachments/${fileName}`);

    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
};