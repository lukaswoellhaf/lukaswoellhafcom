import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ContactInfo } from '../Contact/ContactInfo';
import { loadProfile } from '../../utils/content-loader';
import type { ProfessionalProfile } from '../../types/profile.types';
import styles from './Footer.module.css';

interface FooterProps {
  showContact?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ showContact = false }) => {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);

  useEffect(() => {
    if (!showContact) return;
    
    const loadData = async () => {
      try {
        const data = await loadProfile(language);
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile for footer:', err);
      }
    };

    loadData();
  }, [showContact, language]);

  return (
    <footer className={styles.footer} id="contact">
      {showContact && profile?.contactMethods && profile.contactMethods.length > 0 && (
        <div className={styles.contact}>
          <ContactInfo contactMethods={profile.contactMethods} title={t('contact.title')} />
        </div>
      )}
      <p className={styles.copyright}>
        © {currentYear} Lukas Wöllhaf. {t('footer.copyright')}.
      </p>
    </footer>
  );
};
