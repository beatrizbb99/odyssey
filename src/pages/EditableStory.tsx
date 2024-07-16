import React, { useState, useEffect } from 'react';
import { Story, Chapter } from '@/types/types';
import StoryText from '@/components/StoryText';
import { createStory, fetchStory, updateStory } from '@/services/story.database.handler';
import KapitelPanel from '@/components/KapitelPanel';

interface EditableStoryProps {
    storyId?: string;
}

const EditableStory: React.FC<EditableStoryProps> = ({ storyId }) => {
    const [story, setStory] = useState<Story | null>(null);
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [editableStoryTitle, setEditableStoryTitle] = useState<string>('');
    const [editableChapterTitle, setEditableChapterTitle] = useState<string>('');
    const [editableContent, setEditableContent] = useState<string>('');

    useEffect(() => {
        const loadStory = async () => {
            if (!storyId) {
                // Create a new empty story
                const newStory: Story = {
                    id: '',
                    title: 'New Story',
                    chapters: [{ id: '', title: 'New Chapter', content: '', chapterNumber: 1 }],
                    categories: []
                };
                setStory(newStory);
                setEditableStoryTitle(newStory.title);
                setEditableChapterTitle('New Chapter');
                setEditableContent('');
                setSelectedChapterIndex(0);
                setLoading(false);
                return;
            }

            try {
                const fetchedStory = await fetchStory(storyId);
                if (fetchedStory) {
                    setStory(fetchedStory);
                    setEditableStoryTitle(fetchedStory.title);
                    setSelectedChapterIndex(0);
                } else {
                    alert('Story not found');
                }
            } catch (error) {
                console.error('Failed to fetch story:', error);
                alert('Failed to fetch story');
            } finally {
                setLoading(false);
            }
        };

        loadStory();
    }, [storyId]);

    useEffect(() => {
        if (story && story.chapters.length > 0 && selectedChapterIndex < story.chapters.length) {
            const selectedChapter = story.chapters[selectedChapterIndex];
            setEditableChapterTitle(selectedChapter.title);
            setEditableContent(selectedChapter.content);
        } else {
            // Wenn keine Kapitel vorhanden sind oder der ausgewählte Index ungültig ist
            setEditableChapterTitle('');
            setEditableContent('');
        }
    }, [selectedChapterIndex, story]);


    const handleStoryTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableStoryTitle(e.target.value);
    };

    const handleChapterTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableChapterTitle(e.target.value);
    };

    const handleContentChange = (newContent: string) => {
        setEditableContent(newContent);
    };

    const handleSave = async () => {
        if (!story) return;
    
        // Save all chapters with the updated title and content for the selected chapter
        const updatedChapters = story.chapters.map((chapter, index) =>
            index === selectedChapterIndex ? { ...chapter, title: editableChapterTitle, content: editableContent } : chapter
        );
    
        console.log("save: ", updatedChapters);
    
        let tempStory: Story = {
            ...story,
            title: editableStoryTitle,
            chapters: updatedChapters
        };
    
        console.log("before: ", tempStory);
        try {
            let updatedStory: Story;
    
            if (story.id) {
                const createResult = await updateStory(tempStory);
                if (createResult.success && createResult.story) {
                    updatedStory = createResult.story;
                } else {
                    throw new Error('Failed to update story');
                }
            } else {
                const createResult = await createStory(tempStory);
                if (createResult.success && createResult.story) {
                    updatedStory = createResult.story;
                } else {
                    throw new Error('Failed to create story');
                }
            }
    
            setStory(updatedStory);
            console.log(updatedStory);
            alert('Story saved successfully');
        } catch (error) {
            console.error('Failed to save story:', error);
            alert('Failed to save story');
        }
    };    


    const handleAddChapter = () => {
        if (!story) return;

        // Save the current chapter's title and content before adding a new chapter
        const updatedChapters = story.chapters.map((chapter, index) =>
            index === selectedChapterIndex ? { ...chapter, title: editableChapterTitle, content: editableContent } : chapter
        );

        const newChapter: Chapter = {
            id: '',
            title: 'New Chapter',
            content: '',
            chapterNumber: story.chapters.length + 1
        };

        const updatedChaptersWithNewChapter = [...updatedChapters, newChapter];
        setStory({ ...story, chapters: updatedChaptersWithNewChapter });
        setSelectedChapterIndex(updatedChaptersWithNewChapter.length - 1);

        // Reset editableChapterTitle and editableContent for the new chapter
        setEditableChapterTitle('New Chapter');
        setEditableContent('');
    };

    const handleDeleteChapter = (chapterNumber: number) => {
        if (!story) return;

        // Filtern und aktualisieren der Kapitelnummer
        story.chapters = story.chapters
            .filter(chapter => chapter.chapterNumber !== chapterNumber)
            .map((chapter, index) => ({
                ...chapter,
                chapterNumber: index + 1 // Aktualisiere die Kapitelnummer basierend auf der neuen Reihenfolge
            }));

        // Überprüfen, ob der aktuelle selectedChapterIndex innerhalb der Grenzen liegt
        setSelectedChapterIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };


    const handleSelectChapter = (index: number) => {
        // Save the current chapter's title and content before switching to the new chapter
        if (story && story.chapters.length > 0) {
            const updatedChapters = story.chapters.map((chapter, idx) =>
                idx === selectedChapterIndex ? { ...chapter, title: editableChapterTitle, content: editableContent } : chapter
            );

            const updatedStory: Story = {
                ...story,
                chapters: updatedChapters
            };

            setStory(updatedStory);
        }

        setSelectedChapterIndex(index);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!story) {
        return <div>No story found</div>;
    }

    return (
        <div style={{ marginLeft: '20px', padding: '10px', flexGrow: 1, display: 'flex' }}>
            {story.chapters.length >= 1 && (
                <KapitelPanel
                    chapters={story.chapters}
                    onSelect={handleSelectChapter}
                    onDeleteChapter={handleDeleteChapter} // Rename onSelect to onDeleteChapter
                    onAddChapter={handleAddChapter}
                />
            )}
            <div>
                <h2>Story Title:</h2>
                <input
                    type="text"
                    value={editableStoryTitle}
                    onChange={handleStoryTitleChange}
                    style={{ fontSize: '16px', width: '100%', marginBottom: '10px' }}
                />
                <h2>Chapter Title:</h2>
                <input
                    type="text"
                    value={editableChapterTitle}
                    onChange={handleChapterTitleChange}
                    style={{ fontSize: '16px', width: '100%', marginBottom: '10px' }}
                />
                <StoryText initialText={editableContent} onTextChange={handleContentChange} />
                <button onClick={handleSave}>Save Story</button>
            </div>
        </div>
    );
};

export default EditableStory;
