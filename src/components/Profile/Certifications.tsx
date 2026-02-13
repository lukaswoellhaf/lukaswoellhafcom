import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Certification } from '../../types/profile.types';
import styles from './Certifications.module.css';

interface CertificationsProps {
  certifications: Certification[];
}

export const Certifications: React.FC<CertificationsProps> = ({ certifications }) => {
  const { t } = useLanguage();
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{t('certifications.title')}</h2>
      {certifications.map((cert) => (
        <article key={cert.id} className={styles.entry}>
          <h3 className={styles.name}>{cert.name}</h3>
          <p className={styles.organization}>{cert.issuingOrganization}</p>
          <p className={styles.details}>
            {t('certifications.issued')}: {cert.issueDate}
            {cert.expirationDate && ` • ${t('certifications.expires')}: ${cert.expirationDate}`}
            {cert.isExpired && <span className={styles.expired}> ({t('certifications.expired')})</span>}
          </p>
          {cert.credentialUrl && (
            <p className={styles.link}>
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                {t('certifications.verify')}
              </a>
            </p>
          )}
        </article>
      ))}
    </section>
  );
};
