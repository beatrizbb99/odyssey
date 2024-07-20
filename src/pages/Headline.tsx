import React, { useEffect } from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

const Headline: React.FC = () => {
  
  const router = useRouter();

  const handleClick = () => {
    console.log("Go to shelf!")
    router.push('/category/shelf');
  }
  
  useEffect(() => {
    
    const updateScale = () => {

      const textBehind = document.getElementById('text-behind');
      const textFront = document.getElementById('text-front');
      const textBehindBlur = document.getElementById('text-behind-blur');
      const canvasRect = document.getElementById('canvasRect');

      if (!textBehind || !textFront || !textBehindBlur || !canvasRect) return;

      const canvasBounds = canvasRect.getBoundingClientRect();
      const textBehindBounds = textBehind.getBoundingClientRect();
      const textFrontBounds = textFront.getBoundingClientRect();
      const textBehindBlurBounds = textBehindBlur.getBoundingClientRect();

      const isColliding = (textBounds: DOMRect) => {
        return !(
          canvasBounds.right < textBounds.left ||
          canvasBounds.left > textBounds.right ||
          canvasBounds.bottom < textBounds.top ||
          canvasBounds.top > textBounds.bottom
        );
      };

      const collidingWithCanvas = isColliding(textBehindBounds) || isColliding(textFrontBounds) || isColliding(textBehindBlurBounds);

      if (collidingWithCanvas) {
        textBehind.style.color = 'transparent';
        textFront.style.color = 'transparent';
        textBehindBlur.style.color = 'transparent';
      } else {
        textBehind.style.color = 'white';
        textFront.style.color = 'transparent';
        textBehindBlur.style.color = 'white';
      }
    };

    updateScale(); // Initial call to set the correct styles
    const interval = setInterval(updateScale, 1000 / 60);

    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div className="headline-container">
      <div id="text-behind">CREATIVE<br />ODYSSEY</div>
      <div id="text-behind-blur">CREATIVE<br />ODYSSEY</div>
      <div id="text-front">CREATIVE<br />ODYSSEY</div>
      <div id="button-div">
        <button id="shelf-button" onClick={handleClick} > Go to Shelf </button>
      </div>
    </div>
  );
};

export default Headline;
