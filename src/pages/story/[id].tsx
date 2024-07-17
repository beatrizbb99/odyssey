import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Story } from '@/types/types';
import KapitelPanel from '@/components/KapitelPanel';
import { fetchStory } from '@/services/story.database.handler';

const StoryView: React.FC = () => {
  const router = useRouter();
  const { id: storyId } = router.query;

  const [story, setStory] = useState<Story | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
    return <div>Loading...</div>;
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
        />
      )}
      <div style={{ marginLeft: '20px', padding: '10px' }}>
        <h2>{story.title}</h2>
        <h3>{selectedChapter.title}</h3>
        <p>{selectedChapter.content}</p>
      </div>
    </div>
  );
};

export default StoryView;
