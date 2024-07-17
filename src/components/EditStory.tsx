import React from "react";
import { useStoryForm } from '@/hooks/useStoryForm';
import { updateStory } from '@/services/story.database.handler';
import { useRouter } from 'next/router';
import StoryForm from '@/components/StoryForm';
import { Story } from "@/types/types";

interface EditStoryProps {
    story: Story;
    onUpdateStory: (updatedStory: Story) => void;
}

const EditStory: React.FC<EditStoryProps> = ({ story, onUpdateStory }) => {
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
    } = useStoryForm(story);

    const router = useRouter();

    const handleSaveStory = async () => {
        const updatedStory = {
            ...story, // Keep all existing fields of the current story
            title,
            categories: selectedCategories,
            description
        };

        const response = await updateStory(updatedStory);
        if (response.success) {
            onUpdateStory(updatedStory); // Update the story in the parent with the updated story
            router.push(`/edit/${story.id}`);
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

export default EditStory;
