import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import keycloak from '../config/keycloak';
import tokenStorage from '../utils/tokenStorage';
import { getUserFromToken } from '../utils/tokenDecoder';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    name?: string;
    email?: string;
    username?: string;
    picture?: string;
  } | null;
  token: string | null;
  logout: () => void;
  login: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [token, setToken] = useState<string | null>(null);
  const initialized = useRef(false);

  const logout = useCallback(() => {
    tokenStorage.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    keycloak.logout();
  }, []);

  const login = useCallback(() => {
    keycloak.login();
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          checkLoginIframe: false,
          pkceMethod: 'S256',
          responseMode: 'fragment',
        });

        if (authenticated && keycloak.token) {
          tokenStorage.setToken(keycloak.token, keycloak.refreshToken);
          setIsAuthenticated(true);
          setToken(keycloak.token);

          const userData = getUserFromToken(keycloak.token);
          if (userData) {
            setUser({
              name: userData.name,
              email: userData.email,
              username: userData.username,
              picture: userData.picture,
            });
          }
        } else {
          keycloak.login();
        }
      } catch (error) {
        console.error('Keycloak initialization failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();

    const tokenRefreshInterval = setInterval(async () => {
      if (keycloak.authenticated) {
        try {
          const refreshed = await keycloak.updateToken(30);
          if (refreshed && keycloak.token) {
            tokenStorage.setToken(keycloak.token, keycloak.refreshToken);
            setToken(keycloak.token);
          }
        } catch (error) {
          console.error('Failed to refresh token', error);
          logout();
        }
      }
    }, 300000);

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        token,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
