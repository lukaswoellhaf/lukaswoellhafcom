import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { featureFlags } from '../../config/features';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [iconKey, setIconKey] = useState(0);
  const [langKey, setLangKey] = useState(0);
  
  // Only track scroll on home page
  const isHomePage = location.pathname === '/';
  const isProjectPage = location.pathname.startsWith('/projects/');

  // Set active section based on current page
  useEffect(() => {
    const updateActiveSection = () => {
      if (isProjectPage) {
        setActiveSection('projects');
      }
    };
    updateActiveSection();
  }, [isProjectPage]);

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setIconKey((k) => k + 1);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
    setLangKey((k) => k + 1);
  };

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      const personalSection = document.getElementById('personal');
      const projectsSection = document.getElementById('projects');
      
      if (aboutSection && personalSection && projectsSection) {
        const scrollTop = window.scrollY + window.innerHeight / 3;
        const personalTop = personalSection.offsetTop;
        const projectsTop = projectsSection.offsetTop;
        
        if (scrollTop < personalTop) {
          setActiveSection('about');
        } else if (scrollTop < projectsTop) {
          setActiveSection('personal');
        } else {
          setActiveSection('projects');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false);
    if (!isHomePage) {
      // Navigate to home page first, then scroll after navigation
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        if (sectionId === 'contact') {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      if (sectionId === 'contact') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineTopOpen : ''}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineMiddleOpen : ''}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineBottomOpen : ''}`} />
        </button>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Main navigation">
          {featureFlags.sections.about && (
            <button 
              onClick={() => scrollToSection('about')}
              className={`${styles.navLink} ${activeSection === 'about' && isHomePage ? styles.active : ''}`}
            >
              {t('nav.about')}
            </button>
          )}
          {featureFlags.sections.personal && (
            <button 
              onClick={() => scrollToSection('personal')}
              className={`${styles.navLink} ${activeSection === 'personal' && isHomePage ? styles.active : ''}`}
            >
              {t('nav.personal')}
            </button>
          )}
          {featureFlags.sections.projects && (
            <button 
              onClick={() => scrollToSection('projects')}
              className={`${styles.navLink} ${activeSection === 'projects' && (isHomePage || isProjectPage) ? styles.active : ''}`}
            >
              {t('nav.projects')}
            </button>
          )}
          {featureFlags.sections.contact && (
            <button 
              onClick={() => scrollToSection('contact')}
              className={`${styles.navLink} ${activeSection === 'contact' && isHomePage ? styles.active : ''}`}
            >
              {t('nav.contact')}
            </button>
          )}
        </nav>
        <div className={styles.controls}>
          <button 
            onClick={toggleLanguage}
            className={styles.languageToggle}
            aria-label="Toggle language"
          >
            <span key={langKey} className={styles.themeIcon}>
              {language === 'en' ? 'DE' : 'EN'}
            </span>
          </button>
          <button 
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle theme"
          >
            <span key={iconKey} className={styles.themeIcon}>
              {isDark ? '☀' : '☾'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
