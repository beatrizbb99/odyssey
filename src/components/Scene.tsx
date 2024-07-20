import React, { useState, useEffect, useRef, useMemo } from 'react';
import GLTFMeshGL from './GLTFMeshGL';
import { loadModel } from '@/helpers/loadModel';
import { getAllCategories } from '@/services/category.database.handler';

const Scene: React.FC = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ title: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories: string[] | null = await getAllCategories();
      if (fetchedCategories) {
        const formattedCategories = fetchedCategories.map(category => ({ title: category }));
        setCategories(formattedCategories);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchModelUrl = async () => {
      const url = await loadModel('models/shelf.glb');
      setModelUrl(url);
    };

    fetchModelUrl();
  }, []);

  const chunkCategories = (categories: { title: string }[]) => {
    const chunks: { title: string }[][] = [];
    for (let i = 0; i < categories.length; i += 10) {
      chunks.push(categories.slice(i, i + 10));
    }
    return chunks;
  };

  const categoryChunks = useMemo(() => chunkCategories(categories), [categories]);

  const groupTitlesArray = useMemo(() => {
    return categoryChunks.map((chunk, chunkIndex) => {
      const titles: { [key: string]: string } = {};
      chunk.forEach((category, index) => {
        const key = `book_pile${index + 1}`;
        titles[key] = category.title;
      });
      return titles;
    });
  }, [categoryChunks]);

  return (
    <div style={{ display: 'flex'}}>
      {modelUrl && groupTitlesArray.map((groupTitles, index) => (
        <GLTFMeshGL key={index} modelUrl={modelUrl} groupTitles={groupTitles} />
      ))}
    </div>
  );
};

export default Scene;
