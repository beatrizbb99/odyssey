import React, { Suspense, useRef, useState } from 'react';
import ModelViewer from '../components/ModelViewer';
import Headline from '@/components/Headline';

const Home: React.FC = () => {

  return (
    <div>
      <div>
        <ModelViewer modelName="reading_room" />
        <Headline />
      </div>
    </div>
  );
};

export default Home;