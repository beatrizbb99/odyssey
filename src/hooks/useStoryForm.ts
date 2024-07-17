import { useState, useEffect } from "react";
import { getAllCategories } from '@/services/category.database.handler';
import { Story } from "@/types/types";

export const useStoryForm = (initialStory: Story | null) => {
    const [title, setTitle] = useState<string>(initialStory?.title || '');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialStory?.categories || []);
    const [description, setDescription] = useState<string>(initialStory?.description || '');
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getAllCategories();
                setCategories(fetchedCategories ?? []); // Use an empty array if fetchedCategories is null
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setCategories([]); // Set an empty array on error
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
        }
    }, [initialStory]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
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
    };

    const isFormValid = title.trim() !== '' && selectedCategories.length > 0;

    return {
        title,
        setTitle,
        categories,
        selectedCategories,
        description,
        loadingCategories,
        handleTitleChange,
        handleDescriptionChange,
        handleCategoryChange,
        isFormValid,
    };
};
