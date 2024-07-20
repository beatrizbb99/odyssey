import React, { useState, useEffect } from 'react';
import { Story, Chapter } from '@/types/types';
import { updateChapter, addChapterToStory, deleteChapter, saveContentToStorage } from '@/services/story.database.handler';
import KapitelPanel from '@/components/KapitelPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/editChapter.module.css';
import Loading from './Loading';

interface EditChaptersProps {
    story: Story;
    onUpdateStory: (updatedStory: Story, message: string) => void;
}

const EditChapters: React.FC<EditChaptersProps> = ({ story, onUpdateStory }) => {
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [editableTitle, setEditableTitle] = useState<string>('');
    const [editableContent, setEditableContent] = useState<string>('');
    const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);

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

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditableContent(e.target.value);
    };

    const handleSave = async () => {
        if (!story || selectedChapterIndex < 0 || selectedChapterIndex >= story.chapters.length) return;

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

                await saveContentToStorage(story.id, updatedChapter.id, editableContent);

                onUpdateStory(updatedStory, 'Kapitel gespeichert.');
                return updatedStory;
            } else {
                alert('Failed to update chapter.');
            }
        } catch (error) {
            console.error('Error updating chapter:', error);
            alert('Failed to update chapter. Please try again.');
        }
    };

    const checkForUnsavedChanges = () => {
        const selectedChapter = story.chapters[selectedChapterIndex];
        return (
            editableTitle !== selectedChapter.title ||
            editableContent !== selectedChapter.content
        );
    };

    const handleAddChapter = async () => {
        if (!story) return;

        let savedStory;
        if (checkForUnsavedChanges()) {
            savedStory = await handleSave();
        } else {
            savedStory = story;
        }

        try {
            const currentChapterCount = story.chapters.length;
            const addedChapter = await addChapterToStory(story.id, currentChapterCount);

            if (addedChapter && savedStory) {
                const updatedChapters = [...savedStory.chapters, addedChapter];
                const updatedStory = {
                    ...savedStory,
                    chapters: updatedChapters,
                };

                onUpdateStory(updatedStory, 'Kapitel hinzugefügt.');
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

        if (story.chapters.length === 1) {
            alert('Cannot delete the only chapter.');
            return;
        }
    
        try {
            const response = await deleteChapter(chapterId, story);
            
            if (response.success && response.story) {
                const updatedStory: Story = response.story;
    
                const chapterIndex = story.chapters.findIndex(chapter => chapter.id === chapterId);
    
                const newSelectedIndex = selectedChapterIndex >= chapterIndex
                    ? Math.max(selectedChapterIndex - 1, 0)
                    : selectedChapterIndex;
    
                onUpdateStory(updatedStory, 'Kapitel gelöscht.');
                setSelectedChapterIndex(newSelectedIndex);
            } else {
                alert('Failed to delete chapter or update story.');
            }
        } catch (error) {
            console.error('Error deleting chapter:', error);
            alert('Failed to delete chapter. Please try again.');
        }
    };        

    const togglePanel = () => {
        setIsPanelCollapsed(!isPanelCollapsed);
    };

    if (loading) {
        return <Loading />;
    }

    if (!story) {
        return <div>No story found</div>;
    }

    const selectedChapter = story.chapters[selectedChapterIndex];

    return (
        <div className={styles.container}>
            <div className={`${styles.panelContainer} ${isPanelCollapsed ? styles.collapsed : ''}`}>
                <div className={styles.toggleButton} onClick={togglePanel}>
                    <FontAwesomeIcon icon={isPanelCollapsed ? faChevronRight : faChevronLeft} />
                </div>
                {!isPanelCollapsed && (
                    <KapitelPanel
                        chapters={story.chapters}
                        onSelect={setSelectedChapterIndex}
                        selectedIndex={selectedChapterIndex}
                        onAddChapter={handleAddChapter}
                        onDeleteChapter={handleDeleteChapter}
                    />
                )}
            </div>
            <div className={styles.chapterEditor}>
                <h2>{story.title}</h2>
                <input
                    type="text"
                    value={editableTitle}
                    onChange={handleTitleChange}
                />
                <textarea
                    value={editableContent}
                    onChange={handleContentChange}
                    className={styles.text}
                />
                <button className={styles.saveButton} onClick={handleSave}>Save Chapter</button>
            </div>
        </div>
    );
};

export default EditChapters;
