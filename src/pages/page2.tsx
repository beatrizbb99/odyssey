import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import styles from '../styles/Page2.module.css';
import Link from 'next/link';

const Page2: React.FC = () => {
  const { title, setTitle } = useAppContext();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={styles.page2}
    >
      <h1>Welcome to the book-page!</h1>
        <Link href="/" className={styles.link}>
            Go back to your bookshelf
        </Link>
    </motion.div>
  );
};

export default Page2;
