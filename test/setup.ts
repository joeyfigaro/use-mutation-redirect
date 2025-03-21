import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

import { Window } from 'happy-dom';

// @ts-ignore
global.window = new Window({ url: 'http://localhost' });
// @ts-ignore
global.document = window.document;

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Optional: Mock matchMedia if you need it
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
