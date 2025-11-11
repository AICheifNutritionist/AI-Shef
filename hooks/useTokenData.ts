import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserFromToken } from '../utils/tokenDecoder';

export const useTokenData = () => {
  const { token, isAuthenticated } = useAuth();

  const userData = useMemo(() => {
    if (!token || !isAuthenticated) return null;
    return getUserFromToken(token);
  }, [token, isAuthenticated]);

  return {
    data: userData,
    isLoading: false,
    error: null,
  };
};
