import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { ProfessionalProfile } from '../../types/profile.types';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  profile: ProfessionalProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
          <h1 className={styles.title}>{profile.fullName}</h1>
          <p className={styles.subtitle}>{profile.professionalTitle}</p>
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
