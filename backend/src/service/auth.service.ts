import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private users = [
    { id: 1, username: 'admin', password: '$2a$12$P6wUQb0RKIi4M.m4hVv37.vkcAUFIkgC0zoBEETwm4siXkyIeR0Wu' }, // 1234
    { id: 2, username: 'admin1', password: '$2a$12$HadHxEYPE2SNbTHthbzzGe5zijKLaTS0njZZ0tvXJRuNpaWdj/QgO' }, // 12345
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
    const payload: JwtPayload = { username: user.username, sub: user.id, role: user.username === 'admin' ? 'admin' : 'user' };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: { id: user.id, username: user.username, role: user.username === 'admin' ? 'admin' : 'user' },
    };
  }
} 
