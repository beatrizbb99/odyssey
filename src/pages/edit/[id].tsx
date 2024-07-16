import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Story, Chapter } from '@/types/types';
import StoryText from '@/components/StoryText';
import { fetchStory, updateChapter, addChapterToStory, deleteChapter } from '@/services/story.database.handler';
import KapitelPanel from '@/components/KapitelPanel';

const EditableStory: React.FC = () => {
    const router = useRouter();
    const { id: storyId } = router.query;

    const [story, setStory] = useState<Story | null>(null);
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [editableTitle, setEditableTitle] = useState<string>('');
    const [editableContent, setEditableContent] = useState<string>('');

    useEffect(() => {
        const loadStory = async () => {
            if (storyId) {
                try {
                    const fetchedStory = await fetchStory(storyId as string);
                    if (fetchedStory) {
                        setStory(fetchedStory);
                        const selectedChapter = fetchedStory.chapters[selectedChapterIndex];
                        setEditableTitle(selectedChapter.title);
                        setEditableContent(selectedChapter.content);
                    }
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to fetch story:', error);
                    setLoading(false);  // Laden beenden auch bei Fehler
                }
            }
        };

        loadStory();
    }, [storyId, selectedChapterIndex]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableTitle(e.target.value);
    };

    const handleContentChange = (newContent: string) => {
        setEditableContent(newContent);
    };

    const handleSave = async () => {
        if (!story) return;

        const updatedChapter = {
            ...story.chapters[selectedChapterIndex],
            title: editableTitle,
            content: editableContent,
        };

        try {
            const response = await updateChapter(updatedChapter, story.id);
            if (response.success) {
                const updatedChapters = [...story.chapters];
                updatedChapters[selectedChapterIndex] = updatedChapter;

                const updatedStory = {
                    ...story,
                    chapters: updatedChapters,
                };

                setStory(updatedStory);
            } else {
                alert('Failed to update chapter.');
            }
        } catch (error) {
            console.error('Error updating chapter:', error);
            alert('Failed to update chapter. Please try again.');
        }
    };

    const handleAddChapter = async () => {
        if (!story) return;

        try {
            const currentChapterCount = story.chapters.length;
            const addedChapter = await addChapterToStory(storyId as string, currentChapterCount);

            if (addedChapter) {
                const updatedChapters = [...story.chapters, addedChapter];
                setStory({
                    ...story,
                    chapters: updatedChapters,
                });
                setSelectedChapterIndex(updatedChapters.length - 1);
            } else {
                alert('Failed to add chapter.');
            }
        } catch (error) {
            console.error('Error adding chapter:', error);
            alert('Failed to add chapter. Please try again.');
        }
    };

    const handleDeleteChapter = async (chapterId: string) => {
        if (!story) return;

        try {
            const response = await deleteChapter(chapterId, storyId as string);
            if (response.success) {
                const updatedChapters: Chapter[] = response.updatedChapters || [];

                setStory({
                    ...story,
                    chapters: updatedChapters,
                });

                setSelectedChapterIndex(prevIndex => Math.max(prevIndex - 1, 0));
            } else {
                alert('Failed to delete chapter.');
            }
        } catch (error) {
            console.error('Error deleting chapter:', error);
            alert('Failed to delete chapter. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!story) {
        return <div>No story found</div>;
    }

    const selectedChapter = story.chapters[selectedChapterIndex];

    return (
        <div style={{ marginLeft: '20px', padding: '10px', flexGrow: 1, display: 'flex' }}>
            {story.chapters.length > 0 && (
                <KapitelPanel chapters={story.chapters} onSelect={setSelectedChapterIndex} onAddChapter={handleAddChapter} onDeleteChapter={handleDeleteChapter} />
            )}
            <div>
                <h2>{story.title}</h2>
                <input
                    type="text"
                    value={editableTitle}
                    onChange={handleTitleChange}
                    style={{ fontSize: '16px', width: '100%', marginBottom: '10px' }}
                />
                <StoryText initialText={editableContent} onTextChange={handleContentChange} />
                <button onClick={handleSave}>Save Chapter</button>
            </div>
        </div>
    );
};

export default EditableStory;
