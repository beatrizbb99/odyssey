import React from "react";
import { addChapterToStory, saveStory, uploadCoverImage } from '@/services/story.database.handler';
import { useRouter } from 'next/router';
import StoryForm from "@/components/StoryForm";
import { Story } from "@/types/types";
import { useStoryForm } from "@/hooks/useStoryForm";

/**
 * Create a new Story and store it in the database
 * @returns 
 */


const CreateStory: React.FC = () => {
    const {
        title,
        categories,
        selectedCategories,
        description,
        loadingCategories,
        modelName,
        handleTitleChange,
        handleDescriptionChange,
        handleCategoryChange,
        isFormValid,
        coverFile,
        coverUrl,
        handleCoverChange,
        handleCancel,
        validateForm,
        error,
        handleColorChange,
        color
    } = useStoryForm(null);
    
    const router = useRouter();

    const handleSaveStory = async () => {
        const newStory: Story = {
            title,
            modelName,
            chapters: [],
            categories: selectedCategories,
            description,
            id: "",
            coverUrl,
            color
        };

        try {
            const response = await saveStory(newStory);
            if (response.success && response.id) {
                if (coverFile) {
                    await uploadCoverImage(response.id, coverFile);
                }
                await addChapterToStory(response.id, 0);
                router.push(`/edit/${response.id}`);
            } else {
                throw new Error('Failed to save story');
            }
        } catch (error) {
            console.error('Error saving story:', error);
        }
    };

    return (
        <>
        <h1 style={{backgroundColor: 'white', padding: '40px', margin: '0' }}>Erstelle eine neue Geschichte</h1>
        <StoryForm
                title={title}
                description={description}
                categories={categories}
                selectedCategories={selectedCategories}
                loadingCategories={loadingCategories}
                onTitleChange={handleTitleChange}
                modelName={modelName}
                onDescriptionChange={handleDescriptionChange}
                onCategoryChange={handleCategoryChange}
                isFormValid={isFormValid}
                onSave={handleSaveStory}
                coverUrl={coverUrl}
                onCoverChange={handleCoverChange}
                onCancel={handleCancel}
                onValidateForm={validateForm}
                error={error} 
                color={color} 
                onColorChange={handleColorChange}            />
        </>
    );
};

export default CreateStory;
