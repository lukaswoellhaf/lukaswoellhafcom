import { describe, it, expect } from 'vitest';
import { loadExperience, loadEducation } from '../../src/utils/content-loader';

describe('content-loader', () => {
  describe('loadExperience', () => {
    it('should sort experiences by startDate descending (most recent first)', async () => {
      const experiences = await loadExperience('en');
      
      // Verify it's an array
      expect(Array.isArray(experiences)).toBe(true);
      
      // Check if sorted correctly (most recent first)
      for (let i = 0; i < experiences.length - 1; i++) {
        const current = experiences[i].startDate;
        const next = experiences[i + 1].startDate;
        expect(current >= next).toBe(true);
      }
    });
  });

  describe('loadEducation', () => {
    it('should sort education by graduationDate descending (most recent first)', async () => {
      const education = await loadEducation('en');
      
      expect(Array.isArray(education)).toBe(true);
      
      // Check if sorted correctly
      for (let i = 0; i < education.length - 1; i++) {
        const current = education[i].graduationDate;
        const next = education[i + 1].graduationDate;
        expect(current >= next).toBe(true);
      }
    });
  });
});
