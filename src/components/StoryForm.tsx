import React from "react";
import styles from '@/styles/storyForm.module.css';
import Loading from "./Loading";

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
    onValidateForm: () => boolean;
    onSave: () => void;
    coverUrl: string;
    modelName: string,
    onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | null;
    onCancel: () => void;
    color: string;
    onColorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StoryForm: React.FC<StoryFormProps> = ({
    title,
    description,
    categories,
    selectedCategories,
    loadingCategories,
    color,
    onColorChange,
    onTitleChange,
    onDescriptionChange,
    onCategoryChange,
    isFormValid,
    onValidateForm,
    onSave,
    coverUrl,
    modelName,
    onCoverChange,
    error,
    onCancel
}) => {
    const maxDescriptionLength = 2000;

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.coverContainer}>
                    <div className={styles.coverWrapper}>
                        {coverUrl ? (
                            <img src={coverUrl} alt="Cover Preview" className={styles.coverImage} />
                        ) : (
                            <div className={styles.defaultCover}>No Cover</div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="cover"
                        accept="image/*"
                        onChange={onCoverChange}
                        className={styles.fileInput}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.inputs}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title">Titel:</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={onTitleChange}
                                className={`${styles.input} ${error && !title ? styles.inputError : ''}`}
                            />
                            <label htmlFor="description">Beschreibung:</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={onDescriptionChange}
                                className={styles.textarea}
                                maxLength={maxDescriptionLength}
                            ></textarea>
                            <p className={styles.charCount}>
                                {description.length}/{maxDescriptionLength} characters
                            </p>
                        </div>
                        <div className={styles.colorSelectionWrapper}>
                        <label htmlFor="color">Farbe für das Buch-Modell:</label>
                            <div
                                className={styles.colorDisplay}
                                style={{ backgroundColor: color }}
                            >
                            </div>
                            <select
                                id="color"
                                value={color}
                                onChange={onColorChange}
                                className={styles.colorSelection}
                            >
                                <option></option>
                                <option value="red" style={{ backgroundColor: 'red', color: 'white' }}>Red</option>
                                <option value="green" style={{ backgroundColor: 'green', color: 'white' }}>Green</option>
                                <option value="blue" style={{ backgroundColor: 'blue', color: 'white' }}>Blue</option>
                                <option value="pink" style={{ backgroundColor: 'pink', color: 'black' }}>Pink</option>
                                <option value="yellow" style={{ backgroundColor: 'yellow', color: 'black' }}>Yellow</option>
                            </select>
                        </div>
                        <div className={styles.categoryGroup}>
                            <div className={styles.categoryContainer}>
                                <div className={styles.category}>
                                    {selectedCategories.map((category, index) => (
                                        <div key={index} className={styles.categoryItem}>
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p>Kategorien:</p>
                            <div className={`${styles.categoryList} ${error && selectedCategories.length === 0 ? styles.inputError : ''}`}>
                                {loadingCategories ? (
                                    <Loading />
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
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.buttons}>
                            <button
                                onClick={() => {
                                    if (onValidateForm()) {
                                        onSave();
                                    }
                                }}
                                className={styles.saveButton}
                            >
                                Save Story
                            </button>
                            <button
                                onClick={onCancel}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryForm;
