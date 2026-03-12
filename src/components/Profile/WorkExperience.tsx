import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useInView } from '../../hooks/useInView';
import type { WorkExperienceEntry } from '../../types/profile.types';
import styles from './WorkExperience.module.css';

interface WorkExperienceProps {
  experiences: WorkExperienceEntry[];
}

export const WorkExperience: React.FC<WorkExperienceProps> = ({ experiences }) => {
  const { t } = useLanguage();
  const [ref, inView] = useInView();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={`${styles.section}${inView ? ` ${styles.visible}` : ''}`}>
      <h2 className={styles.heading}>{t('workExperience.title')}</h2>
      <div className={styles.timelineList}>
        {experiences.map((exp, i) => {
          const isActive = exp.endDate === 'Present' || exp.endDate === 'Heute';
          return (
          <div
            key={exp.id}
            className={`${styles.timelineItem}${isActive ? ` ${styles.timelineItemActive}` : ''}`}
            style={inView ? { transitionDelay: `${i * 80}ms` } : undefined}
          >
            <article>
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
          </div>
          );
        })}
      </div>
    </section>
  );
};
