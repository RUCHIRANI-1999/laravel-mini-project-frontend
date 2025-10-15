// src/setupTests.js
import "@testing-library/jest-dom";

// ✅ Mock localStorage for all tests
beforeAll(() => {
    Object.defineProperty(global, "localStorage", {
        value: {
            getItem: jest.fn(() => null),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        },
        writable: true,
    });
});
// src/setupTests.js

// Mock window.location to avoid JSDOM navigation errors
delete window.location;
window.location = { href: '', assign: jest.fn() };

// Optional: suppress React Router warnings
const originalWarn = console.warn;
console.warn = (...args) => {
    if (args[0].includes('React Router Future Flag Warning')) return;
    originalWarn(...args);
};
