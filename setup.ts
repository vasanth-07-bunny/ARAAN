import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

Object.assign(navigator, {
  clipboard: { writeText: async () => undefined },
});

if (!URL.createObjectURL) {
  URL.createObjectURL = () => "blob:vitest";
}

if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => undefined;
}

HTMLAnchorElement.prototype.click = vi.fn();
