import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Story } from '@/types/types';
import { fetchStory } from '@/services/story.database.handler';
import EditStory from '@/components/EditStory';
import EditChapters from '@/components/EditChapters';
import styles from '@/styles/editStory.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@/components/Loading';

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

    useEffect(() => {
        console.log('Current story in EditableStory:', story);
    }, [story]);

    const switchToEditStoryMode = () => {
        setMode('editStory');
    };

    const switchToEditChaptersMode = () => {
        setMode('editChapters');
    };

    const handleUpdateStory = (updatedStory: Story, message: string) => {
        setStory(updatedStory);
        toast.success(message, { autoClose: 1000 });
    };

    if (!story) {
        return <Loading />
    }

    return (
        <div>
            <div className={styles.selectionContainer}>
                <button
                    className={`${styles.button} ${mode === 'editStory' ? styles.active : ''}`}
                    onClick={switchToEditStoryMode}
                >
                    Details zur Geschichte
                </button>
                <button
                    className={`${styles.button} ${mode === 'editChapters' ? styles.active : ''}`}
                    onClick={switchToEditChaptersMode}
                >
                    Kapitel
                </button>
            </div>
            {mode === 'editStory' && <EditStory story={story} onUpdateStory={handleUpdateStory} />}
            {mode === 'editChapters' && <EditChapters story={story} onUpdateStory={handleUpdateStory} />}
            <ToastContainer />
        </div>
    );
};

export default EditableStory;
