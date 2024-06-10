import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserQueryType, UserType } from "./entities/user.entity";
import { Request } from "express";
import { AvatarUploadDto, UserAddDto } from "./dto/user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AuthGuard } from "@nestjs/passport";
import { checkUserRole } from "src/util/util";
import { ApiQueryDto } from "src/util/dto";

@ApiTags("User")
@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAllUsers(@Req() req: Request) {
        let decodedToken = req.user

        // Only allow users with admin privilege to access full data
        checkUserRole(decodedToken["data"].role)


        try {
            return this.userService.getAllUsers()
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }

    }

    @UseGuards(AuthGuard('jwt'))
    @ApiQuery({ name: "pageIndex", required: true })
    @ApiQuery({ name: "pageSize", required: true })
    @ApiQuery({ name: "keyword", required: false })
    @Get("get-users-with-query")
    getAllUsersWithQuery(@Req() req: Request, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyword") keyword: string) {
        let params: UserQueryType = { pageIndex: +pageIndex, pageSize: +pageSize, keyword: keyword ? keyword : "" }
        let decodedToken = req.user

        // Only allow users with admin privilege to access full data
        checkUserRole(decodedToken["data"].role)


        try {
            return this.userService.getAllUsersWithQuery(params)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }

    @Get("/:id")
    getUserById(@Param("id") id: number) {

        try {
            return this.userService.getUserById(+id)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBody({ type: UserAddDto })
    @Post()
    addUser(@Req() req: Request, @Body() body) {
        let decodedToken = req.user

        // Only allow users with admin privilege to make changes to the data
        checkUserRole(decodedToken["data"].role)

        try {
            return this.userService.addUser(body)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete("/:id")
    deleteUser(@Req() req: Request, @Param("id") id: number) {
        let decodedToken = req.user

        // Only allow users with admin privilege to make changes to the data
        checkUserRole(decodedToken["data"].role)

        try {
            return this.userService.deleteUser(+id)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBody({ type: UserAddDto })
    @Put("/:id")
    updateUser(@Req() req: Request, @Param("id") id: number, @Body() body) {
        let { email, role } = req.user["data"]

        try {
            return this.userService.updateUser(email, role, +id, body)
        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        type: AvatarUploadDto
    })
    // Store in backend directory, but ideally should be on an online storage

    @Post("upload-avatar")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: process.cwd() + "/public/avatar",
            filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname),
        })
    }))
    updateAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        // Allow a user to change their own avatar only
        let decodedToken = req.user

        try {
            return this.userService.updateAvatar(decodedToken["data"].email, file.path)

        } catch (exception) {
            throw new HttpException(exception.response, exception.status)
        }
    }
}