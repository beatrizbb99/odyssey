import React from 'react';
import {useRouter} from 'next/router';
import Scene from '@/components/Scene';

const Shelf: React.FC = () => {
    const router = useRouter();

    const returns = () => {
        router.push('/');
    }


  return (
    <div>
      <h1>Welcome to the Shelf Page</h1>
      <Scene />
      <button onClick={returns} >Go back to the start!</button>
    </div>
  );
};

export default Shelf;
