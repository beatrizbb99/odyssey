import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Story } from '@/types/types';

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

    return (
        <div>
            <div key={story.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                <h2>{story.title}</h2>
                <p>{story.description}</p>
                <div>
                    <strong>Categories:</strong> {story.categories.join(', ')}
                </div>
                { !story.original && <button onClick={() => handleEdit(story.id)}>Edit</button> }
                <button onClick={() => handleRead(story.id)}>Read</button>
            </div>
        </div>
    );
};

export default Book;
