import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  private users = [
    {
      id: 1,
      username: 'admin',
      // password: 1234
      password: '$2a$12$P6wUQb0RKIi4M.m4hVv37.vkcAUFIkgC0zoBEETwm4siXkyIeR0Wu',
    },
    {
      id: 2,
      username: 'admin1',
      // password: 12345
      password: '$2a$12$HadHxEYPE2SNbTHthbzzGe5zijKLaTS0njZZ0tvXJRuNpaWdj/QgO',
    }
  ];

  async validateUser(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (!user) throw new UnauthorizedException('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload: JwtPayload = { username: user.username, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
