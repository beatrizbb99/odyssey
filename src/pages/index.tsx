import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppContext } from '../contexts/AppContext';
import ModelViewer from './ModelViewer'; // Import the updated ModelViewer component

const Home: React.FC = () => {
  const { title } = useAppContext();

  const styles = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Prevent scrolling
    backgroundColor: '#ffc0cb', // Pastel pink background
  };

  return (
    <div style={styles}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', maxWidth: '800px' }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {title}
        </motion.h1>
        <div style={{ width: '100%', height: '80vh', position: 'relative' }}> {/* Adjust height as needed */}
          <ModelViewer modelName="one_ring" /> {/* Replace with your actual model name */}
        </div>
        <Link href="/page2" passHref>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ cursor: 'pointer', display: 'block', marginTop: '20px', fontSize: '1.5rem' }}
          >
            Open a book!
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
