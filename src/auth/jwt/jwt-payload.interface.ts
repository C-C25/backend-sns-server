import { RolesEnum } from '../../users/const/roles.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: RolesEnum;
  token: string;
}
