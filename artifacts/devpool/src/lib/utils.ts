import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodedRedirect(type: 'error' | 'success' | 'message', path: string, msg: string) {
  const params = new URLSearchParams({ [type]: msg });
  return `${path}?${params.toString()}`;
}
