const createTokenStorage = () => {
  let token: string | null = null;
  let refreshToken: string | null = null;

  return {
    setToken: (newToken: string, newRefreshToken?: string | null) => {
      token = newToken;
      if (newRefreshToken) {
        refreshToken = newRefreshToken;
      }
    },

    getToken: () => token,

    getRefreshToken: () => refreshToken,

    removeToken: () => {
      token = null;
      refreshToken = null;
    },
  };
};

export default createTokenStorage();
