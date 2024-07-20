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
        coverFile,
        coverUrl,
        handleCoverChange,
        handleCancel,
        validateForm,
        error
    } = useStoryForm(story);

    const router = useRouter();

    const handleSaveStory = async () => {
        const updatedStory = {
            ...story,
            title,
            categories: selectedCategories,
            description,
            coverUrl: coverFile ? URL.createObjectURL(coverFile) : story.coverUrl
        };

        const response = await updateStory(updatedStory, coverFile);
        if (response.success) {
            onUpdateStory(updatedStory);
            router.push(`/edit/${story.id}`);
        } else {
            alert('Error saving the story. Please try again.');
        }
    };

    return (
        <>
        <h1 style={{backgroundColor: 'white', padding: '40px', margin: '0' }}>Geschichte bearbeiten</h1>
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
            coverUrl={coverUrl}
            onCoverChange={handleCoverChange}
            onCancel={handleCancel} 
            onValidateForm={validateForm}
            error={error}
            />
        </>
    );
};

export default EditStory;
