import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/api/firebase';

export const loadModel = async (modelPath: string): Promise<string | null> => {
  try {
    const modelRef = ref(storage, modelPath);
    const url = await getDownloadURL(modelRef);
    return url;
  } catch (error) {
    console.error('Error getting model URL: ', error);
    return null;
  }
};
