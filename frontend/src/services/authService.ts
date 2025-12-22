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

export interface LoginResponse {
  requiresTwoFactor: boolean;
  accessToken?: string;
  refreshToken?: string;
  temporaryToken?: string;
  role?: string;
  id?: string;
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
    const res = await api.post<LoginResponse>('/api/Auth/login', data);
    const { accessToken, refreshToken, id } = res.data;

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (id) localStorage.setItem('userId', id);

    return res.data;
  },

  changePassword: (data: ChangePasswordPayload) =>
    api.post<any>('/api/Auth/change-password', data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    api.post<any>('/api/Auth/forgot-password', data),

  resetPassword: (data: ResetPasswordPayload) =>
    api.post<any>('/api/Auth/reset-password', data),
};
