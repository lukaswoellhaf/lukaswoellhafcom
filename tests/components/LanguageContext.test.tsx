import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../src/contexts/LanguageContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function TestComponent() {
  const { language, t, setLanguage } = useLanguage();
  return (
    <div>
      <div data-testid="language">{language}</div>
      <div data-testid="translation">{t('nav.about')}</div>
      <button onClick={() => setLanguage('de')}>Switch to German</button>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should provide default language as English', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('language').textContent).toBe('en');
  });

  it('should switch language from English to German', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    act(() => {
      screen.getByText('Switch to German').click();
    });
    
    expect(screen.getByTestId('language').textContent).toBe('de');
  });

  it('should persist language preference to localStorage', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    act(() => {
      screen.getByText('Switch to German').click();
    });
    
    expect(localStorageMock.getItem('language')).toBe('de');
  });

  it('should restore language from localStorage on mount', () => {
    localStorageMock.setItem('language', 'de');
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('language').textContent).toBe('de');
  });

  it('should provide translation function that returns non-empty strings', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const translation = screen.getByTestId('translation');
    expect(translation.textContent).toBeTruthy();
    expect(translation.textContent!.length).toBeGreaterThan(0);
  });
});
