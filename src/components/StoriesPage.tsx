import React from 'react';
import Book from '@/components/Book';
import { useRouter } from 'next/router';
import { useStories } from '@/hooks/useStories';
import styles from '@/styles/book.list.module.css';
import Loading from '@/components/Loading';

interface StoriesPageProps {
    categoryId?: string;
    title: string;
}

const StoriesPage: React.FC<StoriesPageProps> = ({ categoryId, title }) => {
    const router = useRouter();
    const { stories, loading, searchQuery, handleSearchChange } = useStories(categoryId);

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
                    <h1>{title}</h1>
                    <button onClick={() => handleGoToShelf()}>Kategorien durchsuchen</button>
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
                    {stories.map((story, index) => (
                        <div key={index} className={styles.bookItem}>
                            <Book story={story} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoriesPage;
