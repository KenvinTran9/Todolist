import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}


  async signup(username: string, password: string) {
    const exist = await this.userRepo.findOne({ where: { username } });
    if (exist) throw new UnauthorizedException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = this.userRepo.create({
      username,
      password: hashedPassword,
    });
    await this.userRepo.save(newUser);

    return {
      id: newUser.id,
      username: newUser.username,
    };
  }


  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
