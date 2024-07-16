import { firestore } from '@/api/firebase';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, collection, getDocs, query, orderBy, addDoc, updateDoc, setDoc } from 'firebase/firestore';
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
      return { id: storyDoc.id, title: storyData.title || '', chapters, categories: storyData.categories };
    } else {
      console.error("Story does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching story: ", error);
    return null;
  }
};

export const createStory = async (newStory: Story): Promise<{ success: boolean, story?: Story }> => {
  try {
    const storiesCollectionRef = collection(firestore, 'Stories');

    // Create the main story and get the document reference
    const storyDocRef = doc(storiesCollectionRef);

    // Create the main story in Firestore and set the ID to the document ID
    await setDoc(storyDocRef, {
      id: storyDocRef.id,
      title: newStory.title,
      categories: newStory.categories
    });

    // Save the chapters in a subcollection 'Chapters' under the main story document
    const chaptersCollectionRef = collection(storyDocRef, 'Kapitel');

    // Iterate through all chapters and add them to the subcollection
    const chaptersWithId = await Promise.all(newStory.chapters.map(async (chapter) => {
      const chapterDocRef = doc(chaptersCollectionRef); // Add chapter and get document reference
      await setDoc(chapterDocRef, {
        ...chapter,
        id: chapterDocRef.id // Set the chapter ID to the document ID in Firestore
      });
      return { ...chapter, id: chapterDocRef.id };
    }));

    return { success: true, story: { ...newStory, id: storyDocRef.id, chapters: chaptersWithId } };
  } catch (error) {
    console.error('Error creating story:', error);
    return { success: false };
  }
};



export const updateStory = async (updatedStory: Story): Promise<{ success: boolean, story?: Story }> => {
  try {
    const storyDocRef = doc(firestore, 'Stories', updatedStory.id);

    // Update the story document
    await updateDoc(storyDocRef, {
      title: updatedStory.title,
      categories: updatedStory.categories
    });

    // Update each chapter document
    const chaptersCollectionRef = collection(storyDocRef, 'Kapitel');

    // Iterate through all chapters and add them to the subcollection
    const updatedChapters = await Promise.all(updatedStory.chapters.map(async (chapter) => {
      if(chapter.id) {
        const chapterDocRef = doc(chaptersCollectionRef, chapter.id);
        await setDoc(chapterDocRef, {
          ...chapter,
          id: chapterDocRef.id
        });
      } else {
        const chapterDocRef = doc(chaptersCollectionRef)
        await setDoc(chapterDocRef, {
          ...chapter,
        });
      }
      return { ...chapter };
    }));

    return { success: true, story: { ...updatedStory, chapters: updatedChapters } };
  } catch (error) {
    console.error('Error updating story:', error);
    throw new Error('Failed to update story');
  }
};
