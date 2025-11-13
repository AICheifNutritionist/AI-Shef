interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramWebAppUser;
  receiver?: TelegramWebAppUser;
  chat?: {
    id: number;
    type: string;
    title: string;
    username?: string;
    photo_url?: string;
  };
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitData;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert: (message: string, callback?: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const isTelegramMiniApp = (): boolean => {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
};

export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (!isTelegramMiniApp()) {
    return null;
  }
  return window.Telegram!.WebApp;
};

export const getTelegramUser = (): TelegramWebAppUser | null => {
  const webApp = getTelegramWebApp();
  if (!webApp || !webApp.initDataUnsafe.user) {
    return null;
  }
  return webApp.initDataUnsafe.user;
};

export const getTelegramInitData = (): TelegramWebAppInitData | null => {
  const webApp = getTelegramWebApp();
  if (!webApp) {
    return null;
  }
  return webApp.initDataUnsafe;
};

export const getTelegramInitDataRaw = (): string | null => {
  const webApp = getTelegramWebApp();
  if (!webApp) {
    return null;
  }
  return webApp.initData;
};

export const initTelegramMiniApp = (): void => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.ready();
    webApp.expand();
  }
};

export type { TelegramWebAppUser, TelegramWebAppInitData, TelegramWebApp };
