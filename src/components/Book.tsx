import React from 'react';
import { useRouter } from 'next/router';
import { Story } from '@/types/types';
import styles from '@/styles/book.module.css';

interface StoryListProps {
    story: Story;
}

const Book: React.FC<StoryListProps> = ({ story }) => {
    const router = useRouter();

    const handleEdit = (storyId: string) => {
        router.push(`/edit/${storyId}`);
    };

    const handleRead = (storyId: string) => {
        router.push(`/story/${storyId}`);
    };

    const handleCategory = (category: string) => {
        router.push(`/category/${category}`);
    }

    return (
        <div className={styles.bookContainer}>
            <div key={story.id} className={styles.book}>
                <img src={story.coverUrl} alt={`${story.title} cover`} className={styles.coverImage} />
                <div className={styles.bookDetails}>
                    <h2>{story.title}</h2>
                    <p className={styles.bookDescription}>{story.description}</p>
                    <div className={styles.categoryContainer}>
                        <div className={styles.category}>
                            {story.categories.map((category, index) => (
                                <div key={index} className={styles.categoryItem} onClick={() => handleCategory(category)}>
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.bookButtons}>
                        <button onClick={() => handleRead(story.id)}>Read</button>
                        {!story.original && <button onClick={() => handleEdit(story.id)}>Edit</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;
