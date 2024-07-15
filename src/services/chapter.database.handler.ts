import { firestore } from '@/api/firebase';
import { doc, collection, getDocs, query, orderBy, addDoc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Chapter } from '@/types/types';

export const updateChapter = async (updatedChapter: Chapter, storyId: string): Promise<{ success: boolean }> => {
    try {
      const storyDocRef = doc(firestore, 'Stories', storyId, 'Kapitel', updatedChapter.id);
      await updateDoc(storyDocRef, {
        title: updatedChapter.title,
        content: updatedChapter.content
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating chapter:', error);
      return { success: false };
    }
  };
  
  export const addChapterToStory = async (storyId: string, currentChapterCount: number): Promise<Chapter | null> => {
    try {
      const chaptersCollectionRef = collection(firestore, 'Stories', storyId, 'Kapitel');
  
      const docRef = await addDoc(chaptersCollectionRef, {
        title: '',
        content: '',
        chapterNumber: currentChapterCount + 1
      });
  
      const newChapter: Chapter = {
        id: docRef.id,
        title: '',
        content: '',
        chapterNumber: currentChapterCount + 1
      };
  
      await setDoc(doc(chaptersCollectionRef, docRef.id), newChapter);
  
      return newChapter;
    } catch (error) {
      console.error('Error adding chapter to story:', error);
      return null;
    }
  };
  
  export const deleteChapter = async (deletedChapterId: string, storyId: string) => {
    try {
      const storyDocRef = doc(firestore, 'Stories', storyId, 'Kapitel', deletedChapterId);
      await deleteDoc(storyDocRef);
  
      const chaptersCollectionRef = collection(firestore, 'Stories', storyId, 'Kapitel');
      const q = query(chaptersCollectionRef, orderBy('chapterNumber'));
      const querySnapshot = await getDocs(q);
  
      const updatedChapters: Chapter[] = [];
      querySnapshot.forEach((doc) => {
        const chapterData = doc.data() as Chapter;
        if (chapterData.id !== deletedChapterId) {
          updatedChapters.push({
            ...chapterData,
            id: doc.id
          });
        }
      });
  
      for (let i = 0; i < updatedChapters.length; i++) {
        const chapter = updatedChapters[i];
        if (chapter.chapterNumber !== i + 1) {
          const chapterDocRef = doc(firestore, 'Stories', storyId, 'Kapitel', chapter.id);
          await updateDoc(chapterDocRef, { chapterNumber: i + 1 });
          updatedChapters[i].chapterNumber = i + 1; 
        }
      }
  
      return { success: true, updatedChapters };
    } catch (error) {
      console.error('Error deleting chapter:', error);
      return { success: false, updateChapters: [] };
    }
  };