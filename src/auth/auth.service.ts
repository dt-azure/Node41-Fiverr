import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UserSignUpType } from './entities/auth.entity';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    prisma = new PrismaClient().user

    async logIn(body) {
        let { email, password } = body
        let user = await this.prisma.findFirst({
            where: {
                email: email,
            }
        })

        // Check for email
        if (!user) {
            throw new HttpException("Email or password is incorrect.", HttpStatus.BAD_REQUEST)
        }

        // Check for password
        let passwordCheck = bcrypt.compareSync(password, user.password)

        if (!passwordCheck) {
            throw new HttpException("Email or password is incorrect.", HttpStatus.BAD_REQUEST)
        }

        let token = this.jwtService.sign({
            data: {
                email: email,
                role: user.role
            }
        }, { expiresIn: "15m", algorithm: "HS256", secret: process.env.JWT_SECRET_KEY })

        let refreshToken = this.jwtService.sign({
            data: {
                email: email,
                role: user.role
            }
        }, { expiresIn: "1w", algorithm: "HS256", secret: process.env.JWT_REFRESH_SECRET_KEY })

        // Add refresh token to database
        await this.prisma.update({
            where: {
                user_id: user.user_id
            },
            data: {
                refresh_token: refreshToken
            }
        })

        return {
            message: "Login successful.",
            status: HttpStatus.OK,
            token,
            refreshToken
        }
    }

    async signUp(body: UserSignUpType) {
        let user = await this.prisma.findFirst({
            where: {
                email: body.email
            }
        })

        // Throw an error if email is already used
        if (user) {
            throw new HttpException(`Email is already in use. - ${user}`, HttpStatus.BAD_REQUEST)
        }

        // Hashing password
        let hashedPassword = bcrypt.hashSync(body.password, 10)


        try {
            await this.prisma.create({
                data: {
                    ...body,
                    password: hashedPassword,
                    role: "USER"
                }
            })

            return { message: "Sign up successful.", userDetails: { full_name: body.full_name, email: body.email, birthday: body.birthday, phone: body.phone, role: "USER" }, status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async refreshToken(token: string, email: string) {
        // Check if user exists and if refresh token exists in db for this user
        let user = await this.prisma.findFirst({
            where: {
                email: email
            }
        })

        if (!user || user.refresh_token == "NULL") {
            throw new HttpException("Refresh token does not exist.", HttpStatus.FORBIDDEN)
        }

        // Validate refresh token in db

        try {
            await this.jwtService.verifyAsync(user.refresh_token, { secret: process.env.JWT_REFRESH_SECRET_KEY })
        } catch (err) {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        // Check if both tokens match
        if (token != user.refresh_token) {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        // If all checks pass, give out new token and refresh tokens
        // Then update db with new refresh token
        let newToken = this.jwtService.sign({
            data: {
                email: user.email,
                role: user.role
            }
        }, { expiresIn: "15m", algorithm: "HS256", secret: process.env.JWT_SECRET_KEY })

        let newRefreshToken = this.jwtService.sign({
            data: {
                email: user.email,
                role: user.role
            }
        }, { expiresIn: "1w", algorithm: "HS256", secret: process.env.JWT_REFRESH_SECRET_KEY })

        // Doesn't really need await but just in case
        await this.prisma.update({
            where: {
                user_id: user.user_id
            },
            data: {
                refresh_token: newRefreshToken
            }
        })

        return { token: newToken, refreshToken: newRefreshToken, status: HttpStatus.OK }
    }

    async logOut(email: string) {
        let user = await this.prisma.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new HttpException("User does not exist.", HttpStatus.BAD_REQUEST)
        }

        try {
            await this.prisma.update({
                where: {
                    user_id: user.user_id
                },
                data: {
                    refresh_token: null
                }
            })

            return { message: "Logged out successfully.", status: HttpStatus.OK}
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }
}
