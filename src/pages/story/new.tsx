import React, { useState, useEffect } from "react";
import { getAllCategories } from '@/services/category.database.handler';
import { addChapterToStory, saveStory } from '@/services/story.database.handler';
import { useRouter } from 'next/router';
import { Story } from "@/types/types";

const CreateStory: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [description, setDescription] = useState<string>('');
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getAllCategories();
                setCategories(fetchedCategories ?? []); // Verwende einen leeren Array, falls fetchedCategories null ist
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setCategories([]); // Setze einen leeren Array bei einem Fehler
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

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

    const handleSaveStory = async () => {
        const newStory: Story = {
            title,
            chapters: [], // Leere Kapitel-Liste für eine neue Story
            categories: selectedCategories,
            description,
            id: ""
        };

        const response = await saveStory(newStory);
        if (response.success && response.id) {
            await addChapterToStory(response.id, 0);
            router.push(`/edit/${response.id}`);
        } else {
            alert('Fehler beim Speichern der Geschichte. Bitte versuchen Sie es erneut.');
        }
    };

    return (
        <div>
            <div>
                {isFormValid ? (
                    <button onClick={handleSaveStory}>Weiter</button>
                ) : (
                    <button>Abbrechen</button>
                )}
            </div>
            <div>
                <p>Details zur Geschichte</p>
                <p>Titel</p>
                <input type="text" value={title} onChange={handleTitleChange} />
                <p>Beschreibung</p>
                <textarea value={description} onChange={handleDescriptionChange}></textarea>
                {selectedCategories.length > 0 && (
                    <ul>
                        {selectedCategories.map((cat, index) => (
                            <li key={index}>{cat}</li>
                        ))}
                    </ul>
                )}
                <p>Kategorien auswählen:</p>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '5px', backgroundColor: 'white' }}>
                    {loadingCategories ? (
                        <p>Lade Kategorien...</p>
                    ) : (
                        categories.map((cat) => (
                            <div key={cat}>
                                <input
                                    type="checkbox"
                                    id={cat}
                                    value={cat}
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => handleCategoryChange(cat)}
                                />
                                <label htmlFor={cat}>{cat}</label>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};


export default CreateStory;
