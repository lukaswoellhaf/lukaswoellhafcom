import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { SkillsCategory } from '../../types/profile.types';
import styles from './Skills.module.css';

interface SkillsProps {
  skills: SkillsCategory;
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { t } = useLanguage();
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{t('skills.title')}</h2>
      {Object.entries(skills).map(([category, skillList]) => (
        <div key={category} className={styles.category}>
          <h3 className={styles.categoryName}>{category}</h3>
          <ul className={styles.skillList}>
            {skillList.map((skill) => (
              <li key={skill.name} className={styles.skill}>
                {skill.name}
                {skill.proficiency && (
                  <span className={styles.proficiency}> ({skill.proficiency})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};
