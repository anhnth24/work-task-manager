import clsx from 'clsx';
import type { ClassValue } from 'clsx';

/**
 * Combines multiple class names using clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Basic HTML sanitizer - allows only safe tags and attributes
 * For a production app, consider using DOMPurify library
 */
export function sanitizeHTML(html: string): string {
  // Allowlist of safe tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'code', 'ul', 'ol', 'li', 'p', 'br'];
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Recursively check and filter elements
  const sanitize = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      if (!allowedTags.includes(tagName)) {
        // If tag not allowed, return its text content
        return document.createTextNode(element.textContent || '');
      }

      // Create new element with only safe attributes
      const newElement = document.createElement(tagName);
      
      // Recursively sanitize children
      Array.from(element.childNodes).forEach((child) => {
        const sanitizedChild = sanitize(child);
        if (sanitizedChild) {
          newElement.appendChild(sanitizedChild);
        }
      });

      return newElement;
    }

    return null;
  };

  const result = document.createElement('div');
  Array.from(temp.childNodes).forEach((child) => {
    const sanitizedChild = sanitize(child);
    if (sanitizedChild) {
      result.appendChild(sanitizedChild);
    }
  });

  return result.innerHTML;
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a random color from a predefined palette
 */
export function getRandomColor(): string {
  const colors = [
    '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#ec4899',
    '#f59e0b', '#06b6d4', '#6366f1', '#14b8a6', '#f97316',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a unique ID using crypto.randomUUID
 */
export function generateId(): string {
  return crypto.randomUUID();
}
