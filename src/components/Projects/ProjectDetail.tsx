import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Project } from '../../types/project.types';
import { parseMarkdown } from '../../utils/markdown-parser';
import styles from './ProjectDetail.module.css';

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  const { reactContent } = parseMarkdown(project.content);

  const handleBack = () => {
    navigate('/');
    // Wait for navigation, then scroll to projects section
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <article className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
        ← {t('projects.back')}
      </button>
      
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>

        <div className={styles.meta}>
          {project.category && (
            <span className={styles.category}>{project.category}</span>
          )}
          <time className={styles.date} dateTime={project.date}>
            {new Date(project.date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
            })}
          </time>
        </div>

        {project.technologies.length > 0 && (
          <div className={styles.technologies}>
            {project.technologies.map((tech, index) => (
              <span key={index} className={styles.tech}>
                {tech}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className={styles.content}>
        {reactContent}
      </div>
    </article>
  );
};
