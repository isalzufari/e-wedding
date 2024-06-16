import api from './api';

const loginAction = async ({ email, password }) => {
  const token = await api.login({ email, password });
  const { accessToken, refreshToken } = token;

  api.putAccessToken(accessToken);
  api.putRefreshToken(refreshToken);

  const authUser = await api.getOwnProfile();
  const { data } = authUser;
  return data;
}

const logoutAction = () => {
  api.deleteToken();
}

const registerAction = async ({ name, email, password }) => {
  const data = await api.register({ name, email, password });
  return data;
}

export {
  loginAction,
  logoutAction,
  registerAction,
}
