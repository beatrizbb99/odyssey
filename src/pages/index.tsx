import React, { Suspense, useRef, useState } from 'react';
import ModelViewer from './ModelViewer';
import Headline from './Headline';

const Home: React.FC = () => {

  return (
    <div>
      <div>
        {/*  <Suspense fallback={<Headline />}>
        </Suspense> */}
        <ModelViewer modelName="reading_room" />
        <Headline />
      </div>
    </div>
  );
};

export default Home;