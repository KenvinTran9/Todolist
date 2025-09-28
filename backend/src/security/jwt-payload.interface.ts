import { Role } from "./role.enums";

export interface JwtPayload {
  sub: number;
  username: string;
  role: Role;
}
