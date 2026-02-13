import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Project } from '../../types/project.types';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { language, t } = useLanguage();
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>
        <Link to={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>

      {project.category && (
        <div className={styles.category}>{project.category}</div>
      )}

      <time className={styles.date} dateTime={project.date}>
        {new Date(project.date).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
        })}
      </time>

      <div className={styles.technologies}>
        {project.technologies.map((tech, index) => (
          <span key={index} className={styles.tech}>
            {tech}
          </span>
        ))}
      </div>

      <Link to={`/projects/${project.slug}`} className={styles.readMore}>
        {t('projects.viewProject')} →
      </Link>
    </article>
  );
};
