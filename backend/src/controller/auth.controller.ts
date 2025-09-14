import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    console.log(' Received body:', body);
    return this.authService.login(body.username, body.password);
  }
}
