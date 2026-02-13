import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { EducationRecord } from '../../types/profile.types';
import styles from './Education.module.css';

interface EducationProps {
  education: EducationRecord[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  const { t } = useLanguage();
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{t('education.title')}</h2>
      {education.map((edu) => (
        <article key={edu.id} className={styles.entry}>
          <h3 className={styles.degree}>{edu.degree}</h3>
          <p className={styles.institution}>{edu.institution}</p>
          <p className={styles.details}>
            {edu.graduationDate}
            {edu.location && ` • ${edu.location}`}
          </p>
        </article>
      ))}
    </section>
  );
};
