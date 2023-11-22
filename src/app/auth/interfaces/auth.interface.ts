export interface LoginResponse {
  user: User;
  token: string;
}

export interface User {
  id_usuario: string;
  us_isActive: boolean;
  us_user: string;
  us_role: string;
}

export interface CheckTokenResponse {
  user: User;
  token: string;
}
