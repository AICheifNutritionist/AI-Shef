import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import keycloak from '../config/keycloak';
import tokenStorage from '../utils/tokenStorage';
import { getUserFromToken } from '../utils/tokenDecoder';
import { isTelegramMiniApp, getTelegramUser, initTelegramMiniApp } from '../utils/telegram';
import { authenticateWithTelegram, refreshTelegramToken } from '../services/telegramAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isTelegramAuth: boolean;
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
  const [isTelegramAuth, setIsTelegramAuth] = useState(false);
  const initialized = useRef(false);

  const logout = useCallback(() => {
    tokenStorage.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);

    if (!isTelegramAuth) {
      // Only use keycloak logout for web users
      keycloak.logout();
    }
    // For Telegram users, just clear local state (no keycloak redirect)
  }, [isTelegramAuth]);

  const login = useCallback(() => {
    if (!isTelegramAuth && keycloak) {
      keycloak.login();
    }
  }, [isTelegramAuth]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      const telegramUser = getTelegramUser();

      if (isTelegramMiniApp() && telegramUser) {
        initTelegramMiniApp();

        try {
          const authResponse = await authenticateWithTelegram();
          tokenStorage.setToken(authResponse.access_token, authResponse.refresh_token);
          setToken(authResponse.access_token);

          // Don't set keycloak properties - we're not using keycloak's internal methods for Telegram auth
          // Token is in tokenStorage and will be used by apiClient
        } catch (error) {
          console.error('Telegram authentication failed', error);
          const telegramToken = `tg_${telegramUser.id}_${Date.now()}`;
          tokenStorage.setToken(telegramToken);
          setToken(telegramToken);
        }

        setIsAuthenticated(true);
        setIsTelegramAuth(true);
        setUser({
          name: `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`,
          username: telegramUser.username || telegramUser.id.toString(),
          picture: telegramUser.photo_url,
        });

        setIsLoading(false);
        return;
      }

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
            setIsTelegramAuth(false);

            const userData = getUserFromToken(keycloak.token);
            if (userData) {
              setUser({
                name: userData.name,
                email: userData.email,
                username: userData.username,
                picture: userData.picture,
              });
            }
          }
        } catch (error) {
          console.error('Keycloak initialization failed', error);
        } finally {
          setIsLoading(false);
        }
      };

      await initKeycloak();
    };

    initAuth();

    const tokenRefreshInterval = setInterval(async () => {
      if (isTelegramAuth) {
        const storedRefreshToken = tokenStorage.getRefreshToken();
        if (storedRefreshToken) {
          try {
            const authResponse = await refreshTelegramToken(storedRefreshToken);
            if (authResponse.access_token) {
              tokenStorage.setToken(authResponse.access_token, authResponse.refresh_token);
              setToken(authResponse.access_token);
              // No need to update keycloak instance for Telegram auth
            }
          } catch (error) {
            console.error('Failed to refresh Telegram token', error);
            logout();
          }
        }
      } else if (keycloak.authenticated) {
        try {
          const refreshed = await keycloak.updateToken(30);
          if (refreshed && keycloak.token) {
            tokenStorage.setToken(keycloak.token, keycloak.refreshToken);
            setToken(keycloak.token);
          }
        } catch (error) {
          console.error('Failed to refresh Keycloak token', error);
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
        isTelegramAuth,
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
