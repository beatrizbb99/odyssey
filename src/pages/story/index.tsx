import React from 'react';
import StoriesPage from '@/components/StoriesPage';

/**
 * 
 * @returns all stored storys from the firebase-Datastore
 */

const AllStoriesPage: React.FC = () => {
    return <StoriesPage title="Alle Geschichten" />;
};

export default AllStoriesPage;
