import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import styles from '../styles/Page1.module.css';

const Page1: React.FC = () => {
  const { clickCount, setClickCount } = useAppContext();

  return (
    <div className={styles.page1}>
      <div className={styles.content}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setClickCount(clickCount + 1)}
        >
          <Link href="/page2" className={styles.link}>
            Klicke mich
          </Link>
        </motion.div>
        <p>Klickanzahl: {clickCount}</p>
      </div>
    </div>
  );
};

export default Page1;
