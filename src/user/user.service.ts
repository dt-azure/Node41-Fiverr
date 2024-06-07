import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { UserQueryType, UserType } from "./entities/user.entity";


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
        let { email } = body

        // Throw an error if email is already in use
        if (this.prisma.user.findFirst({
            where: {
                email: email
            }
        })) {
            throw new HttpException("Email is already in use.", HttpStatus.BAD_REQUEST)
        }


        try {
            await this.prisma.user.create({
                data: { ...body, skill: formatArrToStr(body.skill), certification: formatArrToStr(body.certification), avatar: "" }
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
        // let { email } = body
        const user = await this.prisma.user.findFirst({
            where: {
                user_id: id * 1
            }
        })

        // Throw an error if id is not valid
        if (!user) {
            throw new HttpException("User does not exist.", HttpStatus.NOT_FOUND)
        }

        // Only only users to change their own info
        if (email !== user.email) {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        try {
            // Only admin can change email, restriction should be done on Front End
            
            await this.prisma.user.update({
                where: {
                    user_id: id * 1
                },
                data: { ...body, email: role == "ADMIN" ? body.email : user.email , skill: formatArrToStr(body.skill), certification: formatArrToStr(body.certification) }
            })

            return { message: "User updated successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
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