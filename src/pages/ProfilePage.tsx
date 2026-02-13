import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { featureFlags } from '../config/features';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { WorkExperience } from '../components/Profile/WorkExperience';
import { Skills } from '../components/Profile/Skills';
import { Education } from '../components/Profile/Education';
import { Certifications } from '../components/Profile/Certifications';
import { PersonalInterests } from '../components/Profile/PersonalInterests';
import { ProjectList } from '../components/Projects/ProjectList';
import {
  loadProfile,
  loadExperience,
  loadSkills,
  loadEducation,
  loadCertifications,
  loadProjects,
  loadInterests,
} from '../utils/content-loader';
import type { ProfessionalProfile, WorkExperienceEntry, SkillsCategory, EducationRecord, Certification } from '../types/profile.types';
import type { Project } from '../types/project.types';

interface Interest {
  title: string;
  description: string;
  imageDirectory?: string;
  soundcloudTracks?: string[];
}

interface ProfileData {
  profile: ProfessionalProfile | null;
  experience: WorkExperienceEntry[];
  skills: SkillsCategory | null;
  education: EducationRecord[];
  certifications: Certification[];
  projects: Project[];
  interests: { interests: Interest[] };
}

export const ProfilePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [data, setData] = useState<ProfileData>({
    profile: null,
    experience: [],
    skills: null,
    education: [],
    certifications: [],
    projects: [],
    interests: { interests: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [profile, experience, skills, education, certifications, projects, interests] = await Promise.all([
          loadProfile(language),
          loadExperience(language),
          loadSkills(language),
          loadEducation(language),
          loadCertifications(language),
          loadProjects({ language }),
          loadInterests(language),
        ]);

        setData({
          profile,
          experience,
          skills,
          education,
          certifications,
          projects,
          interests,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.profileLoad'));
        setLoading(false);
      }
    };

    loadAllData();
  }, [language, t]);

  if (loading) {
    return <div>{t('loading.profile')}</div>;
  }

  if (error) {
    return <div>{t('error')}: {error}</div>;
  }

  if (!data.profile || !data.skills) {
    return <div>{t('error.profileIncomplete')}</div>;
  }

  // Generate JSON-LD structured data for resume/CV
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.profile.fullName,
    jobTitle: data.profile.professionalTitle,
    description: data.profile.specialization,
    url: 'https://lukaswoellhaf.com',
    sameAs: data.profile.contactMethods
      ?.filter((m) => m.type !== 'email')
      .map((m) => m.value) || [],
    email: data.profile.contactMethods?.find((m) => m.type === 'email')?.value,
    address: data.profile.location ? {
      '@type': 'PostalAddress',
      addressLocality: data.profile.location,
    } : undefined,
    alumniOf: data.education.map((edu) => ({
      '@type': 'EducationalOrganization',
      name: edu.institution,
    })),
    hasCredential: data.certifications.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      credentialCategory: 'Certificate',
      dateCreated: cert.issueDate,
      expires: cert.expirationDate,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {featureFlags.sections.about && (
        <div id="about">
          <ProfileHeader profile={data.profile} />
          {featureFlags.sections.workExperience && <WorkExperience experiences={data.experience} />}
          {featureFlags.sections.skills && <Skills skills={data.skills} />}
          {featureFlags.sections.education && <Education education={data.education} />}
          {featureFlags.sections.certifications && <Certifications certifications={data.certifications} />}
        </div>
      )}
      {featureFlags.sections.personal && (
        <div id="personal">
          <PersonalInterests interests={data.interests.interests} />
        </div>
      )}
      {featureFlags.sections.projects && (
        <div id="projects">
          <ProjectList projects={data.projects} title={t('projects.title')} />
        </div>
      )}
    </>
  );
};
