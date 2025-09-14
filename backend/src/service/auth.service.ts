import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  private users = [
    {
      id: 1,
      username: 'admin',
      // password: 1234 
      password: '$2b$10$Vh7sK6Fq3nnAh4FnbDQUl.WP03znbNLU52gzCKkL18rOZtZyo69aG',
    },
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
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
