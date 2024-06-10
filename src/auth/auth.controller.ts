import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserSignUpType } from './entities/auth.entity';
import { UserDto, UserSignUpDto } from './dto/auth.dto';

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
}
