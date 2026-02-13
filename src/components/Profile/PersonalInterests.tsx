import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import styles from './PersonalInterests.module.css';

interface Interest {
  title: string;
  description: string;
  imageDirectory?: string;
  soundcloudTracks?: string[];
}

interface PersonalInterestsProps {
  interests: Interest[];
}

export const PersonalInterests: React.FC<PersonalInterestsProps> = ({ interests }) => {
  const { t } = useLanguage();
  const [interestImages, setInterestImages] = useState<Record<string, string[]>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState<Array<{ src: string }>>([]);

  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, string[]> = {};

      for (const interest of interests) {
        if (interest.imageDirectory) {
          try {
            // Dynamically import all images from the directory
            const imageModules = import.meta.glob('/public/images/**/*.{jpg,jpeg,png,webp}', { eager: true, as: 'url' });
            
            // Filter images that match the directory
            const matchingImages = Object.entries(imageModules)
              .filter(([path]) => path.includes(`/images/${interest.imageDirectory}/`))
              .map(([, url]) => url as string);
            
            images[interest.title] = matchingImages;
          } catch (error) {
            console.error(`Failed to load images for ${interest.title}:`, error);
          }
        }
      }

      setInterestImages(images);
    };

    loadImages();
  }, [interests]);

  const openLightbox = (images: string[], index: number) => {
    setLightboxSlides(images.map(src => ({ src })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{t('personalInterests.title')}</h2>
      
      <div className={styles.interests}>
        {interests.map((interest, index) => (
          <div key={index} className={styles.interest}>
            <h3 className={styles.title}>{interest.title}</h3>
            <p className={styles.description}>{interest.description}</p>
            
            {interest.imageDirectory && interestImages[interest.title]?.length > 0 && (
              <div className={styles.gallery}>
                {interestImages[interest.title].map((image, imgIndex) => (
                  <img 
                    key={imgIndex} 
                    src={image} 
                    alt={`${interest.title} ${imgIndex + 1}`}
                    className={styles.image}
                    onClick={() => openLightbox(interestImages[interest.title], imgIndex)}
                  />
                ))}
              </div>
            )}
            
            {interest.soundcloudTracks && interest.soundcloudTracks.length > 0 && (
              <div className={styles.soundcloud}>
                {interest.soundcloudTracks.map((trackUrl, trackIndex) => {
                  const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
                  return (
                    <iframe
                      key={trackIndex}
                      width="100%"
                      height="166"
                      allow="autoplay"
                      src={embedUrl}
                      className={styles.soundcloudEmbed}
                      style={{ border: 'none' }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
    </section>
  );
};
