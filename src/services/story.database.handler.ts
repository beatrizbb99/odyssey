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

    // Create the main story document and get the reference
    const storyDocRef = doc(storiesCollectionRef);

    // Set the ID of the story to the Firestore document ID
    await setDoc(storyDocRef, {
      id: storyDocRef.id,
      title: newStory.title,
      categories: newStory.categories
    });

    // Save the chapters in a sub-collection 'Kapitel' under the main story document
    const chaptersCollectionRef = collection(storyDocRef, 'Kapitel');

    // Iterate through all chapters, update IDs, and add them to the sub-collection
    const updatedChapters: Chapter[] = [];
    for (const chapter of newStory.chapters) {
      const chapterDocRef = doc(chaptersCollectionRef); // Add chapter and get document reference
      chapter.id = chapterDocRef.id; // Set chapter ID to the Firestore document ID
      updatedChapters.push(chapter);
      await setDoc(chapterDocRef, chapter); // Save chapter document
    }

    // Return success and the updated story object with IDs
    const updatedStory: Story = { ...newStory, id: storyDocRef.id, chapters: updatedChapters };
    console.log("return: ", updatedStory);
    return { success: true, story: updatedStory };
  } catch (error) {
    console.error('Error creating story:', error);
    return { success: false };
  }
};



export const updateStory = async (story: Story): Promise<{ success: boolean }> => {
  try {
    const storyDocRef = doc(firestore, 'Stories', story.id);

    // Update the story document
    await updateDoc(storyDocRef, {
      title: story.title,
      categories: story.categories
    });

    // Update each chapter document
    const chaptersCollectionRef = collection(storyDocRef, 'Kapitel');
    for (const chapter of story.chapters) {
      const chapterDocRef = doc(chaptersCollectionRef, chapter.id);
      console.log(chapter);
      await setDoc(chapterDocRef, chapter);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating story:', error);
    throw new Error('Failed to update story');
  }
};
