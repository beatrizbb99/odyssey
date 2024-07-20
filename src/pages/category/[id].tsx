import React, { useEffect, useState } from 'react';
import Book from '@/components/Book';
import { useRouter } from 'next/router';
import { Story } from '@/types/types';
import { getStoriesFromCategory } from '@/services/story.database.handler';
import styles from '@/styles/book.list.module.css';
import Loading from '@/components/Loading';

const CategoryStoriesPage: React.FC = () => {
    const router = useRouter();
    const { id: categoryId } = router.query;

    const [stories, setStories] = useState<Story[]>([]);
    const [filteredStories, setFilteredStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleCreateBook = () => {
        router.push('/story/new');
    }

    const handleGoToShelf = () => {
        router.push('/shelf');
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>{categoryId}</h1>
                    <button onClick={() => handleGoToShelf()}> Weitere Kategorien durchsuchen</button>
                </div>
                <div>
                    <p>Erstelle weitere Bücher</p>
                    <button onClick={() => handleCreateBook()}>+ Erstellen</button>
                </div>
            </div>
            <div className={styles.content}>
                <input
                    className={styles.search}
                    type="text"
                    placeholder="Suchen..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <div className={styles.bookList}>
                    {filteredStories.map((story, index) => (
                        <div key={index} className={styles.bookItem}>
                            <Book story={story} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryStoriesPage;
