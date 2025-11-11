import { jwtDecode } from 'jwt-decode';

interface KeycloakTokenPayload {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  picture?: string;
  avatar?: string;
  profile_picture?: string;
  image?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<string, { roles?: string[] }>;
  [key: string]: any;
}

export const decodeKeycloakToken = (token: string): KeycloakTokenPayload | null => {
  try {
    const decoded = jwtDecode<KeycloakTokenPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};

const generateGravatarUrl = (email?: string): string | undefined => {
  if (!email) return undefined;
  
  const hash = email.toLowerCase().trim();
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};

export const getUserFromToken = (token: string) => {
  const decoded = decodeKeycloakToken(token);
  
  if (!decoded) return null;

  const picture = decoded.picture || 
                  decoded.avatar || 
                  decoded.profile_picture || 
                  decoded.image ||
                  generateGravatarUrl(decoded.email);

  return {
    id: decoded.sub,
    username: decoded.preferred_username,
    email: decoded.email,
    name: decoded.name || `${decoded.given_name || ''} ${decoded.family_name || ''}`.trim(),
    emailVerified: decoded.email_verified,
    roles: decoded.realm_access?.roles || [],
    picture,
  };
};
