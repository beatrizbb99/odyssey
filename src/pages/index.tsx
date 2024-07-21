import React from 'react';
import ModelViewer from '../components/ModelViewer';
import Headline from '@/components/Headline';

const Home: React.FC = () => {

  /**
   * Homepage of the Application, starts with the reading_room-model
   * and a Headline
   */

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