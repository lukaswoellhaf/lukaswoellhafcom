export interface Project {
  id: string;
  title: string;
  slug: string;
  date: string;
  technologies: string[];
  category?: string;
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  blogPostUrl?: string;
  content: string; // Parsed Markdown content
}

export interface ProjectFrontmatter {
  id: string;
  title: string;
  slug: string;
  date: string;
  technologies: string[];
  category?: string;
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  blogPostUrl?: string;
}
