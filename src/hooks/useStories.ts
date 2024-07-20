import { useState, useEffect } from 'react';
import { Story } from '@/types/types';
import { getStoriesFromCategory, getAllStories } from '@/services/story.database.handler';

export const useStories = (categoryId?: string) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [filteredStories, setFilteredStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            let fetchedStories: Story[] = [];
            if (categoryId) {
                fetchedStories = await getStoriesFromCategory(categoryId);
            } else {
                fetchedStories = await getAllStories();
            }
            setStories(fetchedStories);
            setFilteredStories(fetchedStories);
            setLoading(false);
        };

        fetchStories();
    }, [categoryId]);

    useEffect(() => {
        const filtered = stories.filter(story =>
            story.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStories(filtered);
    }, [searchQuery, stories]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return {
        stories: filteredStories,
        loading,
        searchQuery,
        handleSearchChange,
    };
};
