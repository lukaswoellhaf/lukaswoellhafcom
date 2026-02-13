import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Project } from '../../types/project.types';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectList.module.css';

interface ProjectListProps {
  projects: Project[];
  title?: string;
  emptyMessage?: string;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  title,
  emptyMessage,
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t('projects.title');
  const displayEmptyMessage = emptyMessage || t('projects.noProjects');
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{displayTitle}</h2>

      {projects.length === 0 ? (
        <p className={styles.empty}>{displayEmptyMessage}</p>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};
