import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppContext } from '../contexts/AppContext';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const { title } = useAppContext();

  return (
    <div className={styles.container}>
      <section className={styles.section1}>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Link href="#section2" passHref>
          </Link>
        </motion.div>
      </section>
      <section id="section2" className={styles.section2}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Link href="/page2" passHref>
              open a book!
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
