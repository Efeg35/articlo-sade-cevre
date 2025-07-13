import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function addIntersectionObserver(
  element: HTMLElement,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => callback(entry));
  }, options);

  observer.observe(element);
  return () => observer.disconnect();
}

export function smoothScrollTo(element: HTMLElement) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
