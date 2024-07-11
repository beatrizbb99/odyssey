import React, { useEffect } from 'react';
import '../styles/Headline.css'; // Add CSS styles here

const Headline: React.FC = () => {
  const parallaxScaling1 = 0.0005;
  const parallaxScaling2 = 0.00025;

  useEffect(() => {
    const updateScale = () => {
      const textBehind = document.getElementById('text-behind');
      const textFront = document.getElementById('text-front');
      const textBehindBlur = document.getElementById('text-behind-blur');
      const canvasRect = document.getElementById('canvas');
      if (!textBehind || !textFront || !textBehindBlur || !canvasRect) return;

      let scaleValue1 = 1; // Adjust as needed for initial scale
      let scaleValue2 = 1; // Adjust as needed for initial scale

      textBehind.style.transform = `scale(${scaleValue1})`;
      textFront.style.transform = `scale(${scaleValue1})`;
      textBehindBlur.style.transform = `scale(${scaleValue1})`;
      canvasRect.style.transform = `scale(${scaleValue2})`;
    };

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
    </div>
  );
};

export default Headline;
