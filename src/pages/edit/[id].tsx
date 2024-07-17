import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Story } from '@/types/types';
import { fetchStory } from '@/services/story.database.handler';
import EditStory from '@/components/EditStory';
import EditChapters from '@/components/EditChapters';

const EditableStory: React.FC = () => {
    const router = useRouter();
    const { id: storyId } = router.query;

    const [story, setStory] = useState<Story | null>(null);
    const [mode, setMode] = useState<'editStory' | 'editChapters'>('editChapters');

    useEffect(() => {
        const loadStory = async () => {
            if (storyId) {
                try {
                    const fetchedStory = await fetchStory(storyId as string);
                    if (fetchedStory) {
                        setStory(fetchedStory);
                    }
                } catch (error) {
                    console.error('Failed to fetch story:', error);
                }
            }
        };

        loadStory();
    }, [storyId]);

    const switchToEditStoryMode = () => {
        setMode('editStory');
    };

    const switchToEditChaptersMode = () => {
        setMode('editChapters');
    };

    if (!story) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Buttons oder Links zum Wechseln zwischen den Modi */}
            <button onClick={switchToEditStoryMode}>Details zur Geschichte</button>
            <button onClick={switchToEditChaptersMode}>Kapitel</button>

            {/* Abhängig vom aktuellen Modus die entsprechende Komponente anzeigen */}
            {mode === 'editStory' && <EditStory story={story} onUpdateStory={setStory} />}
            {mode === 'editChapters' && <EditChapters story={story} onUpdateStory={setStory} />}
        </div>
    );
};

export default EditableStory;
