import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'super-secret-key', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
