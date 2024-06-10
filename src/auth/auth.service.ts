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
        }, { expiresIn: "1w", algorithm: "HS256" })

        return {
            message: "Login successful.",
            status: HttpStatus.OK,
            token
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
}
