import { describe, it, expect } from 'vitest';
import { extractFrontmatter } from '../../src/utils/markdown-parser';

describe('markdown-parser', () => {
  describe('extractFrontmatter', () => {
    it('should extract simple key-value pairs from frontmatter', () => {
      const markdown = `---
title: My Project
date: 2024-01-15
author: John Doe
---
# Content here`;

      const result = extractFrontmatter(markdown);
      
      expect(result.data).toEqual({
        title: 'My Project',
        date: '2024-01-15',
        author: 'John Doe',
      });
      expect(result.content).toBe('# Content here');
    });

    it('should parse boolean values correctly', () => {
      const markdown = `---
published: true
draft: false
---
Content`;

      const result = extractFrontmatter(markdown);
      
      expect(result.data).toEqual({
        published: true,
        draft: false,
      });
    });

    it('should parse array values correctly', () => {
      const markdown = `---
tags: [TypeScript, React, Testing]
categories: ["Web Development", "Frontend"]
---
Content`;

      const result = extractFrontmatter<{
        tags: string[];
        categories: string[];
      }>(markdown);
      
      expect(result.data.tags).toEqual(['TypeScript', 'React', 'Testing']);
      expect(result.data.categories).toEqual(['Web Development', 'Frontend']);
    });

    it('should parse null values correctly', () => {
      const markdown = `---
description: null
author: null
---
Content`;

      const result = extractFrontmatter<{
        description: null;
        author: null;
      }>(markdown);
      
      expect(result.data.description).toBeNull();
      expect(result.data.author).toBeNull();
    });

    it('should remove quotes from string values', () => {
      const markdown = `---
title: "Quoted Title"
subtitle: 'Single Quoted'
plain: No Quotes
---
Content`;

      const result = extractFrontmatter<{
        title: string;
        subtitle: string;
        plain: string;
      }>(markdown);
      
      expect(result.data.title).toBe('Quoted Title');
      expect(result.data.subtitle).toBe('Single Quoted');
      expect(result.data.plain).toBe('No Quotes');
    });

    it('should handle markdown without frontmatter', () => {
      const markdown = `# Regular Markdown
This has no frontmatter`;

      const result = extractFrontmatter(markdown);
      
      expect(result.data).toEqual({});
      expect(result.content).toBe(markdown);
    });

it('should handle markdown without valid frontmatter delimiter', () => {
    const markdown = `No frontmatter here
Just regular content`;

    const result = extractFrontmatter(markdown);
    
    expect(result.data).toEqual({});
    expect(result.content).toBe(markdown);
    });

    it('should handle complex mixed types', () => {
      const markdown = `---
title: Advanced CI/CD Pipeline
published: true
tags: [GitHub Actions, Docker, ArgoCD]
stars: null
featured: false
---
# Project Description`;

      const result = extractFrontmatter(markdown);
      
      expect(result.data).toEqual({
        title: 'Advanced CI/CD Pipeline',
        published: true,
        tags: ['GitHub Actions', 'Docker', 'ArgoCD'],
        stars: null,
        featured: false,
      });
      expect(result.content).toBe('# Project Description');
    });
  });
});
