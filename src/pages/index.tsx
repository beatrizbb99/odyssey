import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ModelViewer from './ModelViewer';
import Headline from './Headline';
import styles from '@/styles/Headline.module.css'; // Verwenden Sie .scss für SCSS-Dateien

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

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
        </motion.h1>
      </motion.div>
      {/* <div className={styles.modelContainer}>
         <ModelViewer modelName="reading_room" />
      </div> */}
      <div className={styles.headlineContainer}>
        <Headline/>
      </div>
      <Link href="/page2" passHref>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
        </motion.span>
      </Link>
    </div>
  );
};

export default Home;
