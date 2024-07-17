import React from "react";
import { useStoryForm } from '@/hooks/useStoryForm';
import { addChapterToStory, saveStory } from '@/services/story.database.handler';
import { useRouter } from 'next/router';
import StoryForm from '@/components/StoryForm';

const CreateStory: React.FC = () => {
    const {
        title,
        categories,
        selectedCategories,
        description,
        loadingCategories,
        handleTitleChange,
        handleDescriptionChange,
        handleCategoryChange,
        isFormValid,
    } = useStoryForm(null); // No initial story for creating a new one

    const router = useRouter();

    const handleSaveStory = async () => {
        const newStory = {
            title,
            chapters: [], // Empty chapters list for a new story
            categories: selectedCategories,
            description,
            id: ""
        };

        const response = await saveStory(newStory);
        if (response.success && response.id) {
            await addChapterToStory(response.id, 0);
            router.push(`/edit/${response.id}`);
        } else {
            alert('Fehler beim Speichern der Geschichte. Bitte versuchen Sie es erneut.');
        }
    };

    return (
        <StoryForm
            title={title}
            description={description}
            categories={categories}
            selectedCategories={selectedCategories}
            loadingCategories={loadingCategories}
            onTitleChange={handleTitleChange}
            onDescriptionChange={handleDescriptionChange}
            onCategoryChange={handleCategoryChange}
            isFormValid={isFormValid}
            onSave={handleSaveStory}
        />
    );
};

export default CreateStory;
