import React from 'react';
import {useRouter} from 'next/router';
import Scene from '@/components/Scene';
import styles from '@/styles/shelf.module.css'

/**
 * Shelf-Page with all available Categories
 * @returns 
 */


const Shelf: React.FC = () => {
    const router = useRouter();

    const returns = () => {
        router.push('/');
    }

    const create = () => {
      router.push('/story/new')
    }

    const showAll = () => {
      router.push('/story')
    }


    //scene: shelf!
  return (
    <div className={styles.shelfContainer}>
      <div className={styles.options}>
        <h1>Wähle eine Kategorie aus dem Regal</h1>
        <button onClick={returns} >Zurück zum Anfang</button>
        <button onClick={create}>Erstelle eine Geschichte!</button>
      </div>
      <button className={styles.allButton} onClick={showAll}>Alle Geschichten</button>
      <div className={styles.sceneContainer}>
        <Scene/>
      </div>
    </div>
  );
};

export default Shelf;
