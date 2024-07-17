import React, { useState, useEffect } from 'react';
import { Story, Chapter } from '@/types/types';
import StoryText from '@/components/StoryText';
import { fetchStory, updateChapter, addChapterToStory, deleteChapter, saveContentToStorage } from '@/services/story.database.handler';
import KapitelPanel from '@/components/KapitelPanel';

interface EditChaptersProps {
    story: Story; // Die gesamte Story als Prop übergeben
    onUpdateStory: (updatedStory: Story) => void; // Funktion zum Aktualisieren der Story im Elternkomponenten
}

const EditChapters: React.FC<EditChaptersProps> = ({ story, onUpdateStory }) => {
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [editableTitle, setEditableTitle] = useState<string>('');
    const [editableContent, setEditableContent] = useState<string>('');

    useEffect(() => {
        if (story && story.chapters.length > 0) {
            const selectedChapter = story.chapters[selectedChapterIndex];
            setEditableTitle(selectedChapter.title);
            setEditableContent(selectedChapter.content);
            setLoading(false);
        }
    }, [story, selectedChapterIndex]);

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

                onUpdateStory(updatedStory); // Aktualisierte Story an Elternkomponente zurückgeben

                await saveContentToStorage(story.id, updatedChapter.id, editableContent);
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
            const addedChapter = await addChapterToStory(story.id, currentChapterCount);

            if (addedChapter) {
                const updatedChapters = [...story.chapters, addedChapter];
                const updatedStory = {
                    ...story,
                    chapters: updatedChapters,
                };
                onUpdateStory(updatedStory); // Aktualisierte Story an Elternkomponente zurückgeben
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
            const response = await deleteChapter(chapterId, story.id);
            if (response.success) {
                const updatedChapters: Chapter[] = response.updatedChapters || [];

                const updatedStory = {
                    ...story,
                    chapters: updatedChapters,
                };

                onUpdateStory(updatedStory); // Aktualisierte Story an Elternkomponente zurückgeben

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

export default EditChapters;
