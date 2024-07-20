import React from 'react';
import { Chapter } from '@/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/kapitelPanel.module.css';

interface KapitelPanelProps {
  chapters: Chapter[];
  onSelect: (index: number) => void;
  selectedIndex: number;
  onAddChapter?: () => void;
  onDeleteChapter?: (id: string) => void;
}

const KapitelPanel: React.FC<KapitelPanelProps> = ({ chapters, onSelect, selectedIndex, onAddChapter, onDeleteChapter }) => {
  return (
    <div className={styles.panelContainer}>
      <h4>Kapitel</h4>
      {chapters.length > 0 && (
        <ul className={styles.chapterList}>
          {chapters.map((chapter, index) => (
            <li key={chapter.id} className={`${styles.chapterItem} ${index === selectedIndex ? styles.selected : ''}`} onClick={() => onSelect(index)}>
              <span>Kapitel {chapter.chapterNumber}{chapter.title && ` - ${chapter.title}`}</span>
              {onDeleteChapter && (
                <FontAwesomeIcon icon={faTrash} 
                onClick={(e) => {e.stopPropagation(); onDeleteChapter(chapter.id)}} />
              )}
            </li>
          ))}
        </ul>
      )}
      {onAddChapter && (
        <div
          className={chapters.length > 0 ? styles.addChapter : styles.addChapterNoChapters}
          onClick={onAddChapter}
        >
          + Add Chapter
        </div>
      )}
    </div>
  );
};

export default KapitelPanel;
