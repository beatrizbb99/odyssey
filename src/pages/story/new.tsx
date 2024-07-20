import React from "react";
import { addChapterToStory, saveStory, uploadCoverImage } from '@/services/story.database.handler';
import { useRouter } from 'next/router';
import StoryForm from "@/components/StoryForm";
import { Story } from "@/types/types";
import { useStoryForm } from "@/hooks/useStoryForm";
import { toast } from "react-toastify";

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
        coverFile,
        coverUrl,
        handleCoverChange,
        handleCancel,
        validateForm,
        error
    } = useStoryForm(null);
    
    const router = useRouter();

    const handleSaveStory = async () => {
        const newStory: Story = {
            title,
            chapters: [],
            categories: selectedCategories,
            description,
            id: "",
            coverUrl
        };

        try {
            const response = await saveStory(newStory);
            if (response.success && response.id) {
                if (coverFile) {
                    await uploadCoverImage(response.id, coverFile);
                }
                await addChapterToStory(response.id, 0);
                toast.success('Story created successfully!', { autoClose: 1000 });
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

export default CreateStory;
