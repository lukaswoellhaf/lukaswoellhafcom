/**
 * Feature Flags Configuration
 * 
 * Control visibility of sections and routes in the portfolio.
 * Set to `false` to hide a section/route.
 */

export interface FeatureFlags {
  sections: {
    about: boolean;
    workExperience: boolean;
    skills: boolean;
    education: boolean;
    certifications: boolean;
    personal: boolean;
    projects: boolean;
    contact: boolean;
  };
  routes: {
    projectDetail: boolean;
  };
}

export const featureFlags: FeatureFlags = {
  sections: {
    about: true,
    workExperience: true,
    skills: true,
    education: true,
    certifications: false,
    personal: false,
    projects: false,
    contact: true,
  },
  routes: {
    projectDetail: false,
  },
};
