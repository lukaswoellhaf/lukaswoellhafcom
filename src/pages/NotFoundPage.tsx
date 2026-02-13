import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './NotFoundPage.module.css';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('notFound.title')}</h1>
      <p className={styles.message}>{t('notFound.message')}</p>
      <p className={styles.description}>
        {t('notFound.description')}
      </p>
      <Link to="/" className={styles.link}>
        ← {t('notFound.backHome')}
      </Link>
    </div>
  );
};
