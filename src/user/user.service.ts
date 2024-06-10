import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { UserQueryType, UserType } from "./entities/user.entity";
import * as bcrypt from 'bcrypt'

const formatStrToArr = (str: string) => {
    if (!str || str == "") {
        return []
    }

    return str.split(',')
}

const formatArrToStr = (arr: string[]) => {

    if (arr.length == 0) {
        return ""
    }

    let output = ""
    arr.map((item) => {
        output += item + ", "
    })

    return output.slice(0, -2)
}

function exclude(user, keys) {
    return Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key))
    );
}

@Injectable()
export class UserService {
    constructor(private configService: ConfigService) { }

    prisma = new PrismaClient()

    async getAllUsers(): Promise<{ userList: UserType[], totalSize: number }> {
        let data = await this.prisma.user.findMany({})

        let userList = []
        let totalSize: number = await this.prisma.user.count()

        data.map((item) => {
            let newUser = exclude(item, "password")
            userList.push({ ...newUser, skill: formatStrToArr(item.skill), certification: formatStrToArr(item.certification) })
        })

        return { userList, totalSize }
    }

    async getAllUsersWithQuery(params: UserQueryType): Promise<{ userList: UserType[], totalSize: number }> {
        let { pageIndex, pageSize, keyword } = params

        let data = await this.prisma.user.findMany({
            take: pageSize,
            skip: (pageIndex - 1) * pageSize,
            where: {
                full_name: {
                    contains: keyword
                }
            }
        })

        let totalSize: number = await this.prisma.user.count({
            where: {
                full_name: {
                    contains: keyword
                }
            }
        })

        let userList = []
        data.map((item) => {
            let newUser = exclude(item, "password")
            userList.push({ ...newUser, skill: formatStrToArr(item.skill), certification: formatStrToArr(item.certification) })
        })


        return { userList, totalSize }
    }

    async getUserById(id: number) {
        let data = await this.prisma.user.findUnique({
            where: {
                user_id: id
            },
        })

        if (data) {
            return data
        } else {
            throw new HttpException("User does not exist.", HttpStatus.NOT_FOUND)
        }

    }

    async addUser(body: any) {
        let { email, birthday, gender, role } = body

        // Throw an error if email is already in use
        let userData = await this.prisma.user.findFirst({
            where: {
                email: email
            }
        })
        console.log(userData);
        if (userData) {
            throw new HttpException("Email is already in use.", HttpStatus.BAD_REQUEST)
        }

        // Validation: for now only checks for birthday, gender and role
        // Birthday: only check if it's a valid date, the format should be handled on the front end
        let dateCheck = new Date(birthday).toString()

        if (dateCheck == "Invalid Date") {
            throw new HttpException("Invalid birthday.", HttpStatus.BAD_REQUEST)
        }

        if (!["MALE", "FEMALE", "NONBINARY"].includes(gender)) {
            throw new HttpException("Invalid gender input.", HttpStatus.BAD_REQUEST)
        }

        if (!["USER", "ADMIN"].includes(role)) {
            throw new HttpException("Invalid role input.", HttpStatus.BAD_REQUEST)
        }

        // Add user if all checks pass

        // Hash password
        let hashedPassword = bcrypt.hashSync(body.password, 10)

        try {
            await this.prisma.user.create({
                data: { ...body, password: hashedPassword, skill: formatArrToStr(body.skill), certification: formatArrToStr(body.certification), avatar: "" }
            })

            return { message: "User created successfully.", status: HttpStatus.CREATED }

        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }

    }

    async deleteUser(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: id
            }
        })

        if (!user) {
            throw new HttpException("User does not exist.", HttpStatus.NOT_FOUND)
        }

        try {
            await this.prisma.user.delete({
                where: {
                    user_id: id
                }
            })

            return { message: "User deleted successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateUser(email: string, role: string, id: number, body: any) {

        const idCheck = await this.prisma.user.findFirst({
            where: {
                user_id: id
            }
        })

        // Throw an error if ID is not valid
        if (!idCheck) {
            throw new HttpException("User does not exist.", HttpStatus.NOT_FOUND)
        }

        // Users can only change their own info
        const user = await this.prisma.user.findFirst({
            where: {
                user_id: id
            }
        })

        if (email !== user.email && user.role !== "ADMIN") {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        // Validation: for now only checks for birthday, gender and role
        // Birthday: only check if it's a valid date, the format should be handled on the front end
        let dateCheck = new Date(body.birthday).toString()

        if (dateCheck == "Invalid Date") {
            throw new HttpException("Invalid birthday.", HttpStatus.BAD_REQUEST)
        }

        if (!["MALE", "FEMALE", "NONBINARY"].includes(body.gender)) {
            throw new HttpException("Invalid gender input.", HttpStatus.BAD_REQUEST)
        }

        // Only ADMINS can change role, so user input has to be handled by frontend
        if (!["USER", "ADMIN"].includes(role)) {
            throw new HttpException("Invalid role input.", HttpStatus.BAD_REQUEST)
        }

        // Update user info if all checks pass

        if (role === "ADMIN") {
            try {
                // ADMINS can edit everything, although there should be different tiers of ADMINS with different authority
                // Email should not be changed in any case for identification purposes
                // But it's allowed for now

                // Check if new email is already in use
                let emailCheck = await this.prisma.user.findFirst({
                    where: {
                        email: body.email
                    }
                })

                if (emailCheck) {
                    throw new HttpException("Email is already in use.", HttpStatus.BAD_REQUEST)
                }

                // Hash password
                let hashedPassword = bcrypt.hashSync(body.password, 10)

                await this.prisma.user.update({
                    where: {
                        user_id: id * 1
                    },
                    data: { ...body, email: body.email, password: hashedPassword, skill: formatArrToStr(body.skill), certification: formatArrToStr(body.certification) }
                })

                return { message: "User updated successfully.", status: HttpStatus.OK }
            } catch (err) {
                throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
            }
        } else {
            try {
                // Users cannot change email and role


                // Hash password
                let hashedPassword = bcrypt.hashSync(body.password, 10)

                await this.prisma.user.update({
                    where: {
                        user_id: id * 1
                    },
                    // Prevent changes to role column by assigning its existing value
                    data: { ...body, password: hashedPassword, role: user.role, skill: formatArrToStr(body.skill), certification: formatArrToStr(body.certification) }
                })

                return { message: "User updated successfully.", status: HttpStatus.OK }
            } catch (err) {
                throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
            }
        }

    }

    async updateAvatar(email: string, path: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        })

        try {
            await this.prisma.user.update({
                where: {
                    user_id: user.user_id
                },
                data: {
                    avatar: path
                }
            })

            return { message: "Avatar updated successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }
}