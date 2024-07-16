import React from 'react';
import {useRouter} from 'next/router';

const Shelf: React.FC = () => {
    const router = useRouter();

    const returns = () => {
        router.push('/');
    }


  return (
    <div>
      <h1>Welcome to the Shelf Page</h1>
      <button onClick={returns} >Go back to the start!</button>
    </div>
  );
};

export default Shelf;
