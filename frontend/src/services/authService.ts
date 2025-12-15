import api from '../lib/api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export const authService = {
  register: (data: RegisterPayload) =>
    api.post<TokenResponse | any>('/api/Auth/register', data),

  login: async (data: LoginPayload) => {
    const res = await api.post<TokenResponse>('/api/Auth/login', data);
    const { accessToken, refreshToken } = res.data;

localStorage.setItem('accessToken', res.data.accessToken);
localStorage.setItem('refreshToken', res.data.refreshToken);

    return res.data;
  },

  changePassword: (data: ChangePasswordPayload) =>
    api.post<any>('/api/Auth/change-password', data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    api.post<any>('/api/Auth/forgot-password', data),

  resetPassword: (data: ResetPasswordPayload) =>
    api.post<any>('/api/Auth/reset-password', data),
};
