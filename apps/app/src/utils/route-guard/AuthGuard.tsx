'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { GuardProps } from '@/types';
import useAuth from '@/hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }: GuardProps) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/');
  }, [isLoggedIn, router]);

  return children;
};

export default AuthGuard;
