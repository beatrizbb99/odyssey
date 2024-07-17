import React from "react";

interface StoryFormProps {
    title: string;
    description: string;
    categories: string[];
    selectedCategories: string[];
    loadingCategories: boolean;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCategoryChange: (category: string) => void;
    isFormValid: boolean;
    onSave: () => void;
}

const StoryForm: React.FC<StoryFormProps> = ({
    title,
    description,
    categories,
    selectedCategories,
    loadingCategories,
    onTitleChange,
    onDescriptionChange,
    onCategoryChange,
    isFormValid,
    onSave,
}) => (
    <div>
        <div>
            {isFormValid ? (
                <button onClick={onSave}>Speichern</button>
            ) : (
                <button disabled>Speichern</button>
            )}
        </div>
        <div>
            <p>Titel</p>
            <input type="text" value={title} onChange={onTitleChange} />
            <p>Beschreibung</p>
            <textarea value={description} onChange={onDescriptionChange}></textarea>
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
                                onChange={() => onCategoryChange(cat)}
                            />
                            <label htmlFor={cat}>{cat}</label>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
);

export default StoryForm;
