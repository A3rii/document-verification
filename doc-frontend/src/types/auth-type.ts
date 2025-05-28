export interface UserState {
  _id: string;
  owner_id: string;
  name: string;
  email: string;
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

// Login Student Type
export interface studentLogin {
  email: string;
  password: string;
}

// Register Student Types
export interface StudentRegisterProps {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;
}
