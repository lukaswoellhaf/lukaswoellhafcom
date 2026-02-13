import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { WorkExperience } from '../../src/components/Profile/WorkExperience';
import type { WorkExperienceEntry } from '../../src/types/profile.types';

const mockExperiences: WorkExperienceEntry[] = [
  {
    id: 'exp1',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    location: 'Berlin, Germany',
    achievements: [
      'Led team of 5 developers',
      'Reduced deployment time by 50%',
    ],
  },
  {
    id: 'exp2',
    jobTitle: 'Software Engineer',
    company: 'StartupCo',
    startDate: '2018-06',
    endDate: '2019-12',
    location: 'Munich, Germany',
    achievements: [
      'Built microservices architecture',
    ],
  },
  {
    id: 'exp3',
    jobTitle: 'Junior Developer',
    company: 'WebAgency',
    startDate: '2016-03',
    endDate: undefined,
    location: undefined,
    achievements: [
      'Developed client websites',
    ],
  },
];

describe('WorkExperience component', () => {
  it('should display "Present" for current positions without endDate', () => {
    render(
      <LanguageProvider>
        <WorkExperience experiences={mockExperiences} />
      </LanguageProvider>
    );

    expect(screen.getByText(/2016-03 - Present/)).toBeDefined();
  });

  it('should handle empty experiences array', () => {
    render(
      <LanguageProvider>
        <WorkExperience experiences={[]} />
      </LanguageProvider>
    );

    // Should still render the section with heading
    expect(screen.queryByText('Senior Software Engineer')).toBeNull();
  });
});
