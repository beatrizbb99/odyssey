import React from 'react';
import {useRouter} from 'next/router';
import Scene from '@/components/Scene';

const Shelf: React.FC = () => {
    const router = useRouter();

    const returns = () => {
        router.push('/');
    }

    const create = () => {
      router.push('/story/new')
    }


    //scene: shelf!
  return (
    <div>
      <h1>Welcome to the Shelf Page</h1>
      <button onClick={returns} >Go back to the start!</button>
      <button onClick={create}> Create a new story!</button>
      <Scene />
    </div>
  );
};

export default Shelf;
