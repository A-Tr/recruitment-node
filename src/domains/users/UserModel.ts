export interface User {
  id: number;
  email: string;
}

export interface UserDB {
  id: number;
  email: string;
  password: string;
  created_at: number;
  updated_at: number;
}
