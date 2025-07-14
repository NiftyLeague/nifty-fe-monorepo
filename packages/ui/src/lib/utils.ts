import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumberToDisplay = (num?: number, digits = 2): string =>
  num ? num.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : '0';
