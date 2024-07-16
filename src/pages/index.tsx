import React, { Suspense, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ModelViewer from './ModelViewer';
import Headline from './Headline';

const Home: React.FC = () => {

  return (
    <div>
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
      <div>
       {/*  <Suspense fallback={<Headline />}>
        </Suspense> */}
        <ModelViewer modelName="reading_room"/>
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