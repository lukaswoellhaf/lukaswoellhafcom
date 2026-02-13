import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { WorkExperienceEntry } from '../../types/profile.types';
import styles from './WorkExperience.module.css';

interface WorkExperienceProps {
  experiences: WorkExperienceEntry[];
}

export const WorkExperience: React.FC<WorkExperienceProps> = ({ experiences }) => {
  const { t } = useLanguage();
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{t('workExperience.title')}</h2>
      {experiences.map((exp) => (
        <article key={exp.id} className={styles.entry}>
          <h3 className={styles.jobTitle}>{exp.jobTitle}</h3>
          <p className={styles.company}>{exp.company}</p>
          <p className={styles.period}>
            {exp.startDate} - {exp.endDate || 'Present'}
            {exp.location && ` • ${exp.location}`}
          </p>
          <ul className={styles.achievements}>
            {exp.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
};
