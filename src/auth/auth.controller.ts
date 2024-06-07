import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserSignUpType } from './entities/auth.entity';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/log-in")
    logIn(@Body() body) {
        try {
            return this.authService.logIn(body)
        } catch (exception) {
            throw new HttpException(exception.response ,exception.status)
        }
    }

    @Post("/sign-up")
    signUp(@Body() body: UserSignUpType) {
        try {
            return this.authService.signUp(body)
        } catch (exception) {
            throw new HttpException(exception.response ,exception.status)
        }
    }
}
