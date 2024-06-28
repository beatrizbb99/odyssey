import React, { useState, useEffect } from 'react';

interface StoryTextProps {
  initialText: string;
  onTextChange: (newText: string) => void;
}

const StoryText: React.FC<StoryTextProps> = ({ initialText, onTextChange }) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <textarea
        value={text}
        onChange={handleChange}
        rows={10}
        style={{
          width: '100%',
          fontSize: '16px',
          minHeight: '350px',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

export default StoryText;
