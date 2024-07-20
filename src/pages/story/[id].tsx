import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Story } from '@/types/types';
import KapitelPanel from '@/components/KapitelPanel';
import { fetchStory } from '@/services/story.database.handler';
import BookViewer from '@/components/BookViewer';

import Loading from '@/components/Loading';

const StoryView: React.FC = () => {
  const router = useRouter();
  const { id: storyId } = router.query;
  //const { id: categoryId} = router.query; //korrekt? Muss das Query von vorher auslesen!

  const [story, setStory] = useState<Story | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  if(story) {
    console.log("STORYMODEL: ", story.modelName)
  }

  
  const backToCategory = () => {
    router.push('/category/[id]')
  } //toto: correct routing back to category

  useEffect(() => {
    const loadStory = async () => {
      if (storyId) {
        try {
          const fetchedStory = await fetchStory(storyId as string);
          setStory(fetchedStory);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch story:', error);
          setLoading(false);
        }
      }
    };

    loadStory();
  }, [storyId]);

  if (loading) {
    return <Loading />;
  }

  if (!story) {
    return <div>No story found</div>;
  }

  const selectedChapter = story.chapters[selectedChapterIndex];

  return (
    <div style={{ display: 'flex' }}>
      {story.chapters.length >= 2 && (
        <KapitelPanel
          chapters={story.chapters}
          onSelect={setSelectedChapterIndex} 
          selectedIndex={selectedChapterIndex}/>
      )}
      <div style={{ marginLeft: '20px', padding: '10px' }}>
        <h2>{story.title}</h2>
        <h3>{selectedChapter.title}</h3>
        <p>{selectedChapter.content}</p>
      </div>
      <BookViewer bookName={story.modelName}/>
    </div>
  );
};

export default StoryView;
