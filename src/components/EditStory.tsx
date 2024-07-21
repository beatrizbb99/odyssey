import React from "react";
import { useStoryForm } from '@/hooks/useStoryForm';
import { deleteStory, updateStory } from '@/services/story.database.handler';
import { useRouter } from 'next/router';
import StoryForm from '@/components/StoryForm';
import { Story } from "@/types/types";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import style from '@/styles/editStory.module.css';

interface EditStoryProps {
    story: Story;
    onUpdateStory: (updatedStory: Story, message: string) => void;
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
        modelName,
        handleCoverChange,
        handleCancel,
        validateForm,
        error,
        color,
        handleColorChange
    } = useStoryForm(story);

    const router = useRouter();

    const handleSaveStory = async () => {
        const updatedStory = {
            ...story,
            title,
            categories: selectedCategories,
            description,
            color,
            modelName,
            coverUrl: coverFile ? URL.createObjectURL(coverFile) : story.coverUrl
        };

        const response = await updateStory(updatedStory, coverFile);
        if (response.success) {
            onUpdateStory(updatedStory, 'Details gespeichert.');
            router.push(`/edit/${story.id}`);
        } else {
            alert('Error saving the story. Please try again.');
        }
    };

    const handleDeleteStory = async () => {
        if (!story) return;

        const confirmation = window.confirm('Bist du sicher, dass du diese Geschichte löschen möchtest?');
        if (!confirmation) return;

        const response = await deleteStory(story);

        if (response.success) {
            toast('Geschichte wurde gelöscht', {
                autoClose: 3000,
                icon: <FontAwesomeIcon icon={faTrashCan} style={{ color: "#e70dca" }} />,
            });
            router.back();
        } else {
            toast.error('Geschichte wurde nicht gelöscht');
        }
    };

    return (
        <>
            <div className={style.infoContainer}>
                <h1>Details der Geschichte bearbeiten</h1>
                <button className='cancelButton' onClick={handleDeleteStory}>Löschen</button>
            </div>
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
                modelName={modelName}
                color={color} 
                onColorChange={handleColorChange}
            />
        </>
    );
};

export default EditStory;
