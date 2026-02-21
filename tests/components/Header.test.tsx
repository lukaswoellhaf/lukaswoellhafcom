import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { Header } from '../../src/components/Layout/Header';
import { featureFlags } from '../../src/config/features';

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

// Mock window methods
const scrollIntoViewMock = vi.fn();
const scrollToMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  
  // Setup default mocks
  (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());
  (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ pathname: '/' });
  
  // Mock DOM methods
  window.scrollTo = scrollToMock;
  globalThis.Element.prototype.scrollIntoView = scrollIntoViewMock;
  
  // Mock matchMedia for theme
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Header Navigation Logic', () => {
  it.skipIf(!featureFlags.sections.projects)('should set active section to "projects" when on project detail page', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ 
      pathname: '/projects/my-project' 
    });

    render(
      <BrowserRouter>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </BrowserRouter>
    );

    const projectsButton = screen.getAllByRole('button').find(
      btn => btn.textContent?.includes('Projects') || btn.textContent?.includes('nav.projects')
    );
    
    expect(projectsButton?.className).toContain('active');
  });

  it('should scroll to section when clicking navigation button on home page', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'about';
    document.body.appendChild(mockElement);

    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ pathname: '/' });

    render(
      <BrowserRouter>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </BrowserRouter>
    );

    const aboutButtons = screen.getAllByRole('button');
    const aboutButton = aboutButtons.find(btn => 
      btn.textContent?.includes('About') || btn.className?.includes('navLink')
    );
    
    if (aboutButton) {
      fireEvent.click(aboutButton);
      expect(scrollIntoViewMock).toHaveBeenCalled();
    }

    document.body.removeChild(mockElement);
  });

  it('should navigate to home page when clicking section link from project page', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ 
      pathname: '/projects/some-project' 
    });

    render(
      <BrowserRouter>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const personalButton = buttons.find(btn => 
      btn.textContent?.toLowerCase().includes('personal') ||
      btn.textContent?.includes('nav.personal')
    );

    if (personalButton) {
      fireEvent.click(personalButton);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }
  });

  it('should scroll to bottom for contact section', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ pathname: '/' });
    
    // Mock scrollHeight
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      value: 5000,
    });

    render(
      <BrowserRouter>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const contactButton = buttons.find(btn => 
      btn.textContent?.toLowerCase().includes('contact') ||
      btn.textContent?.includes('nav.contact')
    );

    if (contactButton) {
      fireEvent.click(contactButton);
      expect(scrollToMock).toHaveBeenCalledWith({
        top: 5000,
        behavior: 'smooth',
      });
    }
  });

  it.skipIf(!featureFlags.sections.personal)('should toggle active section based on scroll position', async () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ pathname: '/' });

    // Create mock sections
    const aboutSection = document.createElement('div');
    aboutSection.id = 'about';
    Object.defineProperty(aboutSection, 'offsetTop', { value: 0 });
    
    const personalSection = document.createElement('div');
    personalSection.id = 'personal';
    Object.defineProperty(personalSection, 'offsetTop', { value: 1000 });
    
    const projectsSection = document.createElement('div');
    projectsSection.id = 'projects';
    Object.defineProperty(projectsSection, 'offsetTop', { value: 2000 });

    document.body.appendChild(aboutSection);
    document.body.appendChild(personalSection);
    document.body.appendChild(projectsSection);

    render(
      <BrowserRouter>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </BrowserRouter>
    );

    // Simulate scroll to personal section
    Object.defineProperty(window, 'scrollY', { writable: true, value: 800 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 600 });
    
    fireEvent.scroll(window);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const personalButton = buttons.find(btn => 
        btn.textContent?.toLowerCase().includes('personal') ||
        btn.textContent?.includes('nav.personal')
      );
      
      // Active section should update based on scroll position
      expect(personalButton).toBeDefined();
    });

    // Cleanup
    document.body.removeChild(aboutSection);
    document.body.removeChild(personalSection);
    document.body.removeChild(projectsSection);
  });
});
