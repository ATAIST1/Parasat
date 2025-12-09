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

export const authService = {
  register: (data: RegisterPayload) =>
    api.post<TokenResponse | any>('/api/Auth/register', data),

  login: (data: LoginPayload) =>
    api.post<TokenResponse>('/api/Auth/login', data),

  changePassword: (data: ChangePasswordPayload) =>
    api.post<any>('/api/Auth/change-password', data),
};
