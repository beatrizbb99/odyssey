import React, { useEffect, useState } from 'react';
import Book from '@/components/Book';
import { useRouter } from 'next/router';
import { Story } from '@/types/types';
import { getStoriesFromCategory } from '@/services/story.database.handler';

const CategoryStoriesPage: React.FC = () => {
    const router = useRouter();
    const { id: categoryId } = router.query;

    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    const backToShelf = () => {
        router.push('/category/shelf')
    }

    useEffect(() => {
        if (!categoryId) {
            console.error('Invalid categoryId:', categoryId);
            setLoading(false);
            return;
        }

        const fetchStories = async () => {
            setLoading(true);
            const fetchedStories = await getStoriesFromCategory(categoryId as string);
            setStories(fetchedStories);
            setLoading(false);
        };

        fetchStories();
    }, [categoryId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{categoryId}</h1>
            <button onClick={backToShelf}>Zurück zur Auswahl</button>
            {stories.map((story, index) => (
                <Book key={index} story={story} />
            ))}
        </div>
    );
};

export default CategoryStoriesPage;
