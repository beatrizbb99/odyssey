import React from 'react';
import Image from 'next/image';
import '@/styles/loading.module.css';
import loadingGif from '@/assets/loading.gif';

const Loading = () => {
  return (
    <div className="loading-container">
      <Image src={loadingGif} alt="Loading..." className="loading-gif" />
    </div>
  );
};

export default Loading;
