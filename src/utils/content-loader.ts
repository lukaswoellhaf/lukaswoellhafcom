import type {
  ProfessionalProfile,
  WorkExperienceEntry,
  SkillsCategory,
  EducationRecord,
  Certification,
} from '../types/profile.types';
import type { Project } from '../types/project.types';

type Language = 'en' | 'de';

export async function loadProfile(language: Language = 'en'): Promise<ProfessionalProfile> {
  try {
    const module = await import(`../content/profile-${language}.json`);
    return module.default as ProfessionalProfile;
  } catch (error) {
    throw new Error(`Failed to load profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function loadExperience(language: Language = 'en'): Promise<WorkExperienceEntry[]> {
  try {
    const module = await import(`../content/experience-${language}.json`);
    const entries: WorkExperienceEntry[] = module.default;
    // Sort by startDate descending (most recent first)
    return entries.sort((a, b) => b.startDate.localeCompare(a.startDate));
  } catch (error) {
    throw new Error(`Failed to load experience: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function loadSkills(language: Language = 'en'): Promise<SkillsCategory> {
  try {
    const module = await import(`../content/skills-${language}.json`);
    return module.default as SkillsCategory;
  } catch (error) {
    throw new Error(`Failed to load skills: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function loadEducation(language: Language = 'en'): Promise<EducationRecord[]> {
  try {
    const module = await import(`../content/education-${language}.json`);
    const records: EducationRecord[] = module.default;
    // Sort by graduationDate descending
    return records.sort((a, b) => b.graduationDate.localeCompare(a.graduationDate));
  } catch (error) {
    throw new Error(`Failed to load education: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function loadCertifications(language: Language = 'en'): Promise<Certification[]> {
  try {
    const module = await import(`../content/certifications-${language}.json`);
    const certs: Certification[] = module.default;

    // Compute isExpired and daysUntilExpiration
    const now = new Date();
    const enriched = certs.map(cert => {
      if (!cert.expirationDate) {
        return { ...cert, isExpired: false, daysUntilExpiration: undefined };
      }

      const expirationDate = new Date(cert.expirationDate);
      const isExpired = now > expirationDate;
      const daysUntilExpiration = isExpired ? undefined : Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return { ...cert, isExpired, daysUntilExpiration };
    });

    // Sort by issueDate descending
    return enriched.sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  } catch (error) {
    throw new Error(`Failed to load certifications: ${error instanceof Error ? error.message : String(error)}`);
  }
}

interface LoadProjectsOptions {
  featuredOnly?: boolean;
  category?: string;
  limit?: number;
  language?: Language;
}

export async function loadProjects(options: LoadProjectsOptions = {}): Promise<Project[]> {
  const language = options.language || 'en';
  try {
    // Use Vite's glob import to load all markdown files in projects directory
    const projectModules = import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default' });
    
    const projectPromises = Object.entries(projectModules)
      .filter(([path]) => path.includes(`-${language}.md`))
      .map(async ([path, loader]) => {
        const content = await loader() as string;
        const { extractFrontmatter } = await import('./markdown-parser');
        const { data, content: markdownContent } = extractFrontmatter<{
          title: string;
          slug: string;
          date: string;
          technologies: string[];
          category?: string;
          featured?: boolean;
        }>(content);

        // Extract slug from filename if not in frontmatter
        const filename = path.split('/').pop()?.replace(`-${language}.md`, '') || '';
        const slug = data.slug || filename;

        return {
          id: slug,
          title: data.title,
          slug,
          date: data.date,
          technologies: data.technologies || [],
          category: data.category,
          featured: data.featured || false,
          content: markdownContent,
        } as Project;
      });

    const projects = await Promise.all(projectPromises);

    let filtered = projects;

    if (options.featuredOnly) {
      filtered = filtered.filter(p => p.featured);
    }

    if (options.category) {
      filtered = filtered.filter(p => p.category === options.category);
    }

    // Sort by date descending (most recent first)
    filtered.sort((a, b) => b.date.localeCompare(a.date));

    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  } catch (error) {
    throw new Error(`Failed to load projects: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function loadProjectBySlug(slug: string, language: Language = 'en'): Promise<Project> {
  try {
    // Use Vite's glob import to load specific project file
    const projectModules = import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default' });
    
    for (const [path, loader] of Object.entries(projectModules)) {
      const filename = path.split('/').pop()?.replace('.md', '') || '';
      
      // Match slug with language suffix (e.g., k8s-migration-en or k8s-migration-de)
      if (filename === `${slug}-${language}`) {
        const content = await loader() as string;
        const { extractFrontmatter } = await import('./markdown-parser');
        const { data, content: markdownContent } = extractFrontmatter<{
          title: string;
          slug: string;
          date: string;
          technologies: string[];
          category?: string;
          featured?: boolean;
        }>(content);

        return {
          id: slug,
          title: data.title,
          slug: data.slug || slug,
          date: data.date,
          technologies: data.technologies || [],
          category: data.category,
          featured: data.featured || false,
          content: markdownContent,
        } as Project;
      }
    }

    throw new Error(`Project not found: ${slug}`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Project not found')) {
      throw error;
    }
    throw new Error(`Failed to load project ${slug}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function loadInterests(language: Language = 'en'): Promise<{ interests: Array<{ title: string; description: string; imageDirectory?: string; soundcloudTracks?: string[] }> }> {
  try {
    const module = await import(`../content/interests-${language}.json`);
    return module.default;
  } catch (error) {
    throw new Error(`Failed to load interests: ${error instanceof Error ? error.message : String(error)}`);
  }
}
