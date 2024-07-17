import { firestore, storage } from '@/api/firebase';
import { uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, collection, getDocs, query, orderBy, addDoc, updateDoc, setDoc, deleteDoc, where } from 'firebase/firestore';
import { Story, Chapter } from '@/types/types';

export const fetchStory = async (storyId: string): Promise<Story | null> => {
  try {
    if (!storyId) {
      throw new Error("No storyId");
    }

    const storyDocRef = doc(firestore, 'Stories', storyId);
    const storyDoc = await getDoc(storyDocRef);

    if (storyDoc.exists()) {
      const storyData = storyDoc.data();
      if (!storyData) {
        console.error("No data found in story doc");
        return null;
      }

      const chaptersCollectionRef = collection(storyDocRef, 'Kapitel');
      const chaptersQuery = query(chaptersCollectionRef, orderBy('chapterNumber'));
      const chaptersSnapshot = await getDocs(chaptersQuery);
      const chapters = chaptersSnapshot.docs.map(chap => chap.data() as Chapter);

      // Fetch content from Firebase Storage
      for (let chapter of chapters) {
        const contentUrl = await getDownloadURL(ref(storage, `stories/${storyId}/${chapter.id}.txt`));
        const response = await fetch(contentUrl);
        const text = await response.text();
        chapter.content = text;
      }

      return { id: storyDoc.id, title: storyData.title || '', chapters, categories: storyData.categories, description: storyData.description };
    } else {
      console.error("Story does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching story: ", error);
    return null;
  }
};

export const updateChapter = async (updatedChapter: Chapter, storyId: string): Promise<{ success: boolean }> => {
  try {
    // Update title in Firestore
    const chapterDocRef = doc(firestore, 'Stories', storyId, 'Kapitel', updatedChapter.id);
    await updateDoc(chapterDocRef, {
      title: updatedChapter.title,
    });

    // Save content to Firebase Storage
    await saveContentToStorage(storyId, updatedChapter.id, updatedChapter.content);

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
      chapterNumber: currentChapterCount + 1
    });

    const newChapter: Chapter = {
      id: docRef.id,
      title: '',
      content: '',
      chapterNumber: currentChapterCount + 1
    };

    await setDoc(doc(chaptersCollectionRef, docRef.id), newChapter);

    // Save initial empty content to Firebase Storage
    await saveContentToStorage(storyId, docRef.id, '');

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

    // Delete content from Firebase Storage
    const contentRef = ref(storage, `stories/${storyId}/${deletedChapterId}.txt`);
    await deleteObject(contentRef);

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
    return { success: false, updatedChapters: [] };
  }
};

export const saveStory = async (story: Story): Promise<{ success: boolean; id?: string }> => {
  try {
    const storyRef = collection(firestore, 'Stories');
    const storyDocRef = doc(storyRef);

    await setDoc(storyDocRef, {
      id: storyDocRef.id,
      title: story.title,
      description: story.description,
      categories: story.categories
    });

    return { success: true, id: storyDocRef.id };
  } catch (error) {
    console.error('Error saving story:', error);
    return { success: false };
  }
};

export const updateStory = async (updatedStory: Story): Promise<{ success: boolean }> => {
  try {
    const storyDocRef = doc(firestore, 'Stories', updatedStory.id);
    await updateDoc(storyDocRef, {
      title: updatedStory.title,
      description: updatedStory.description,
      categories: updatedStory.categories
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating story:', error);
    return { success: false };
  }
};

export const saveContentToStorage = async (storyId: string, chapterId: string, content: string) => {
  try {
    const storageRefPath = ref(storage, `stories/${storyId}/${chapterId}.txt`);
    await uploadBytes(storageRefPath, new Blob([content], { type: 'text/plain' }));
    console.log('Content saved to Firebase Storage.');
  } catch (error) {
    console.error('Error saving content to Firebase Storage:', error);
  }
};

export const getStoriesFromCategory = async (categoryId: string): Promise<Story[]> => {
  try {
    if (!categoryId) {
      throw new Error('Invalid categoryId');
    }
    
    const storiesCollectionRef = collection(firestore, 'Stories');
    const storiesQuery = query(storiesCollectionRef, where('categories', 'array-contains', categoryId));
    const querySnapshot = await getDocs(storiesQuery);

    const stories: Story[] = querySnapshot.docs.map(doc => {
      const storyData = doc.data();
      const story: Story = {
        id: doc.id,
        title: storyData.title,
        description: storyData.description,
        categories: storyData.categories,
        chapters: []
      };

      if (storyData.original) {
        story.original = storyData.original;
      }

      return story;
    });

    return stories;
  } catch (error) {
    console.error('Error fetching stories from category:', error);
    return [];
  }
};
