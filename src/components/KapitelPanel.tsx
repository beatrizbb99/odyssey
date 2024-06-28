import React from 'react';
import { Chapter } from '@/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface KapitelPanelProps {
  chapters: Chapter[];
  onSelect: (index: number) => void;
  onAddChapter?: () => void;
  onDeleteChapter?: (id: string) => void;
}

const KapitelPanel: React.FC<KapitelPanelProps> = ({ chapters, onSelect, onAddChapter, onDeleteChapter }) => {
  return (
    <div style={{ width: '200px', borderRight: '1px solid #ddd', padding: '10px' }}>
      <h4>Kapitel</h4>
      {chapters.length >= 2 && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {chapters.map((chapter, index) => (
            <li key={chapter.id} style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => onSelect(index)}>
              Kapitel {chapter.chapterNumber} 
              {chapter.title.length > 0 && ( <span>- {chapter.title}</span>)}
              {onDeleteChapter && (
                <FontAwesomeIcon icon={faTrash} 
                onClick={() => onDeleteChapter(chapter.id)}/>
              )}
            </li>
          ))}
        </ul>
      )}
      {onAddChapter && (
        <div
          style={{ marginTop: chapters.length > 0 ? '10px' : '0', cursor: 'pointer', color: 'blue' }}
          onClick={onAddChapter}
        >
          + Add Chapter
        </div>
      )}
    </div>
  );
};

export default KapitelPanel;
