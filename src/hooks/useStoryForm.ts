import { useState, useEffect } from "react";
import { getAllCategories } from '@/services/category.database.handler';
import { Story } from "@/types/types";
import router from "next/router";

export const useStoryForm = (initialStory: Story | null) => {
    const [title, setTitle] = useState<string>(initialStory?.title || '');
    const [modelName, setModelName] = useState<string>(initialStory?.modelName || 'book_blue');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialStory?.categories || []);
    const [description, setDescription] = useState<string>(initialStory?.description || '');
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [coverFile, setCoverFile] = useState<File | null>(null); 
    const [coverUrl, setCoverUrl] = useState<string>(initialStory?.coverUrl || '');
    const [error, setError] = useState<string | null>(null);
    const [color, setColor] = useState<string>(initialStory?.color || 'brown');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getAllCategories();
                setCategories(fetchedCategories ?? []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialStory) {
            setTitle(initialStory.title);
            setDescription(initialStory.description);
            setSelectedCategories(initialStory.categories);
            setCoverUrl(initialStory.coverUrl);
            setModelName(initialStory.modelName);
        }
    }, [initialStory]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (error) setError(null);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleCategoryChange = (category: string) => {
        const isChecked = selectedCategories.includes(category);
        if (isChecked) {
            setSelectedCategories(prev => prev.filter(cat => cat !== category));
        } else {
            setSelectedCategories(prev => [...prev, category]);
        }
        if (error) setError(null);
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCoverUrl(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setColor(e.target.value);
        setModelName('book_' + e.target.value);
        console.log(e.target.value);
    };


    const isFormValid = title.trim() !== '' && selectedCategories.length > 0;

    const validateForm = () => {
        if(!isFormValid) {
            setError('Bitte die angegebenen Felder füllen');
            return false;
        }
        setError(null);
        console.log('speichern');
        return true;
    };

    const handleCancel = () => {
        router.back();
    };

    return {
        title,
        setTitle,
        modelName,
        categories,
        selectedCategories,
        description,
        loadingCategories,
        coverFile,
        coverUrl,
        error,
        handleTitleChange,
        handleDescriptionChange,
        handleCategoryChange,
        handleCoverChange,
        handleCancel,
        isFormValid,
        validateForm,
        color,
        handleColorChange,
    };
};
