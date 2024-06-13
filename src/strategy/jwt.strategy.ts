import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { DoneCallback } from 'passport';


// import { jwtSecretKey } from 'src/auth/auth.module';

const jwtService = new JwtService
const prisma = new PrismaClient()



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY,
        });

    }

    async validate(payload: any) {
        return payload
    }
}

// Strategy for refresh token
// Flow is: check for token -> if valid proceed with the endpoint
// If not -> call api/auth/refresh-token to check for refresh token -> if valid return new token to client
// Frontend will catch this and re-run the API call with new token
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET_KEY,
        });

    }

    async validate(payload: any) {
        return payload
    }
}