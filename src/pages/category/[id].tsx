import React from 'react';
import { useRouter } from 'next/router';
import StoriesPage from '@/components/StoriesPage';

const CategoryStoriesPage: React.FC = () => {
    const router = useRouter();
    const { id: categoryId } = router.query;

    return <StoriesPage categoryId={categoryId as string} title={`${categoryId}`} />;
};

export default CategoryStoriesPage;
