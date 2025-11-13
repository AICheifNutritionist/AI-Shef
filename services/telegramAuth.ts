import axios from 'axios';
import { getTelegramInitData } from '../utils/telegram';

interface TelegramAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

const getKeycloakTokenUrl = () => {
  const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://keycloak.ismit.ru';
  const realm = import.meta.env.VITE_KEYCLOAK_REALM || 'AIChef';
  return `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;
};

const requestToken = async (
  params: Record<string, string>,
  errorContext: string
): Promise<TelegramAuthResponse> => {
  try {
    const formData = new URLSearchParams({ client_id: 'ai-chef', ...params });
    const response = await axios.post<TelegramAuthResponse>(getKeycloakTokenUrl(), formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.error_description || error.message
      : 'Unknown error';
    throw new Error(`${errorContext}: ${message}`);
  }
};

export const authenticateWithTelegram = async (): Promise<TelegramAuthResponse> => {
  const initData = getTelegramInitData();
  if (!initData?.user) throw new Error('Telegram user data not available');

  const { user, auth_date, hash } = initData;
  const params: Record<string, string> = {
    grant_type: 'password',
    username: user.username || user.id.toString(),
    id: user.id.toString(),
    first_name: user.first_name,
    auth_date: auth_date.toString(),
    hash,
  };

  if (user.last_name) params.last_name = user.last_name;
  if (user.photo_url) params.photo_url = user.photo_url;

  return requestToken(params, 'Telegram authentication failed');
};

export const refreshTelegramToken = async (refreshToken: string): Promise<TelegramAuthResponse> => {
  return requestToken(
    { grant_type: 'refresh_token', refresh_token: refreshToken },
    'Token refresh failed'
  );
};
