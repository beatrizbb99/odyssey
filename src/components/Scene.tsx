import React, { useState, useEffect, useMemo } from 'react';
import GLTFMeshGL from './GLTFMeshGL';
import { loadModel } from '@/helpers/loadModel';
import { getAllCategories } from '@/services/category.database.handler';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import styles from '@/styles/shelf.module.css';
import Loading from './Loading';

const Scene: React.FC = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ title: string }[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories: string[] | null = await getAllCategories();
      if (fetchedCategories) {
        const formattedCategories = fetchedCategories.map(category => ({ title: category }));
        setCategories(formattedCategories);
      }
    };

    const fetchModelUrl = async () => {
      const url = await loadModel('models/shelf.glb');
      setModelUrl(url);
    };

    Promise.all([fetchCategories(), fetchModelUrl()]).then(() => {
      setLoading(false);
    });
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
    return categoryChunks.map((chunk) => {
      const titles: { [key: string]: string } = {};
      chunk.forEach((category, index) => {
        const key = `book_pile${index + 1}`;
        titles[key] = category.title;
      });
      return titles;
    });
  }, [categoryChunks]);

  return (
    <div className={styles.sliderContainer}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.swiperContainer}>
          <>
            <button className="arrow-left arrow"><FontAwesomeIcon icon={faChevronLeft} /></button>
            {modelUrl && (
              <Swiper
                navigation={{
                  nextEl: ".arrow-right",
                  prevEl: ".arrow-left"
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                modules={[Navigation, Pagination, EffectFade]}
              >
                {groupTitlesArray.map((groupTitles, index) => (
                  <SwiperSlide key={index} >
                    <GLTFMeshGL modelUrl={modelUrl} groupTitles={groupTitles} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <button className="arrow-right arrow"><FontAwesomeIcon icon={faChevronRight} /></button>
          </>
       
        </div>
       )}
    </div>
  );
};

export default Scene;
