import { User } from '../entities/user.entity';

export interface PayloadJwt {
  id: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
