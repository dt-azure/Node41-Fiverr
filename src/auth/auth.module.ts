import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

// export const jwtSecretKey = "SECRET_KEY"

@Module({
  imports: [JwtModule.register({ global: true, secret: process.env.JWT_SECRET_KEY })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
