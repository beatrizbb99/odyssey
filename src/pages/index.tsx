import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppContext } from '../contexts/AppContext';
import ModelViewer from './ModelViewer';
import styles from '@/styles/Home.module.css';

const Home: React.FC = () => {
  const { title } = useAppContext();

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {title}
        </motion.h1>
      </motion.div>
      <div className={styles.modelContainer}>
        <ModelViewer modelName="reading_room" />
      </div>
      <Link href="/page2" passHref>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Open a book!
        </motion.span>
      </Link>
    </div>
  );
};

export default Home;
