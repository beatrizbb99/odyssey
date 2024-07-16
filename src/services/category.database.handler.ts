import { firestore } from '@/api/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getAllCategories = async (): Promise<string[] | null> => {
    try {
        const ref = collection(firestore, 'Categories');
        const snapshot = await getDocs(ref);

        const categories: string[] = [];
        snapshot.forEach(doc => {
            categories.push(doc.id); // doc.id ist category name
        });

        return categories;
    } catch (error) {
        console.error('Error getting categories:', error);
        throw new Error('Error getting categories');
    }
};