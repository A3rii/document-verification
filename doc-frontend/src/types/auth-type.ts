export interface UserState {
  id: string;
  owner_id: string;
  name: string;
  role: string;
  phone_number: string;
  avatar: string;
}

export interface AuthState {
  currentUser: UserState | null;
  userToken: string;
  loading: boolean;
  error: string | null;
  success: boolean;
}
export interface RegisterResponse {
  access_token: string;
  user: UserState;
}

export interface studentLogin {
  email: string;
  password: string;
}
