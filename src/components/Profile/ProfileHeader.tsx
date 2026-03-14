import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useTypewriter } from '../../hooks/useTypewriter';
import type { ProfessionalProfile } from '../../types/profile.types';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  profile: ProfessionalProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nameDelay = 400;
  const nameSpeed = 55;
  const titleDelay = nameDelay + profile.fullName.length * nameSpeed + 180;

  const { displayed: displayedName, done: nameDone } = useTypewriter(profile.fullName, nameSpeed, nameDelay);
  const { displayed: displayedTitle, done: titleDone } = useTypewriter(profile.professionalTitle, 40, titleDelay);

  return (
    <header className={styles.header}>
      <div className={styles.profileImage}>
        <img
          src="/images/profile/profile.jpg"
          alt={profile.fullName}
          className={styles.image}
          onClick={() => setLightboxOpen(true)}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            {displayedName}
            <span className={`${styles.cursor}${nameDone ? ` ${styles.cursorHidden}` : ''}`}>|</span>
          </h1>
          <p className={styles.subtitle}>
            {displayedTitle}
            {!nameDone && <span className={styles.cursorHidden}>|</span>}
            {nameDone && <span className={`${styles.cursor}${titleDone ? ` ${styles.cursorHidden}` : ''}`}>|</span>}
          </p>
          <p className={styles.intro}>{profile.specialization}</p>
        </div>
      
        <div className={styles.meta}>
          {profile.location && (
            <span className={styles.location}>→ {profile.location}</span>
          )}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: '/images/profile/profile.jpg' }]}
      />
    </header>
  );
};
