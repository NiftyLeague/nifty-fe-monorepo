/**
 * Password validator for login pages
 */
import type { NumbColorFunc, StringBoolFunc, StringNumFunc } from '@/types';

// has number
const hasNumber: StringBoolFunc = number => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
const hasMixed: StringBoolFunc = number => new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

// has special chars
const hasSpecial: StringBoolFunc = number => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

// set color based on password strength
export const strengthColor: NumbColorFunc = (count, theme) => {
  if (count < 2) return { label: 'Poor', color: 'var(--color-error)' };
  if (count < 3) return { label: 'Weak', color: 'var(--color-orange-400)' };
  if (count < 4) return { label: 'Normal', color: 'var(--color-warning)' };
  if (count < 5) return { label: 'Good', color: 'var(--color-success-dark)' };
  if (count < 6) return { label: 'Strong', color: 'var(--color-success)' };
  return { label: 'Poor', color: 'var(--color-error)' };
};

// password strength indicator
export const strengthIndicator: StringNumFunc = number => {
  let strengths = 0;
  if (number.length > 5) strengths += 1;
  if (number.length > 7) strengths += 1;
  if (hasNumber(number)) strengths += 1;
  if (hasSpecial(number)) strengths += 1;
  if (hasMixed(number)) strengths += 1;
  return strengths;
};
