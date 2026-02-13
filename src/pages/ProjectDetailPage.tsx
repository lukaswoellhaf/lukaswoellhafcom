import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ProjectDetail } from '../components/Projects/ProjectDetail';
import { loadProjectBySlug } from '../utils/content-loader';
import type { Project } from '../types/project.types';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setError(t('error.projectSlugMissing'));
        setLoading(false);
        return;
      }

      try {
        const data = await loadProjectBySlug(slug, language);
        setProject(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.projectLoad'));
        setLoading(false);
      }
    };

    loadData();
  }, [slug, language, t]);

  if (loading) {
    return <div>{t('loading.project')}</div>;
  }

  if (error || !project) {
    return <Navigate to="/404" replace />;
  }

  return <ProjectDetail project={project} />;
};
