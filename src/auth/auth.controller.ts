import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserSignUpType } from './entities/auth.entity';
import { UserDto, UserSignUpDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags("Authentication")
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiBody({ type: UserDto })
    @Post("/log-in")
    logIn(@Body() body) {
        try {
            return this.authService.logIn(body)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }

    @ApiBody({ type: UserSignUpDto })
    @Post("/sign-up")
    signUp(@Body() body: UserSignUpType) {
        try {
            return this.authService.signUp(body)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Get("/refresh-token")
    refreshToken(@Req() req: Request) {
        const refreshToken = req.headers['authorization'].split(' ')[1]
        const email = req.user['data'].email


        try {
            return this.authService.refreshToken(refreshToken, email)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get("/log-out")
    logOut(@Req() req: Request) {
        const email = req.user['data'].email


        try {
            return this.authService.logOut(email)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }
}
