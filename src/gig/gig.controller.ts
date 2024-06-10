import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GigService } from './gig.service';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QueryType } from 'src/util/types';
import { Request } from 'express';
import { checkUserRole } from 'src/util/util';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SubcategoryPhotoDto } from 'src/subcategory/dto/subcategory.dto';
import { GigAddDto, GigUpdateAdminDto, GigUpdateDto } from './dto/gig.dto';

@ApiTags("Gig")
@Controller('api/gig')
export class GigController {
  constructor(private readonly gigService: GigService) { }

  @Get("")
  getAllGigs() {

    try {
      return this.gigService.getAllGigs()
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @Get("/get-gig-with-query")
  @ApiQuery({ name: "pageIndex", required: true })
  @ApiQuery({ name: "pageSize", required: true })
  @ApiQuery({ name: "keyword", required: false })
  getAllUsersWithQuery(@Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyword") keyword: string) {
    let params: QueryType = { pageIndex: +pageIndex, pageSize: +pageSize, keyword: keyword }

    try {
      return this.gigService.getAllGigsWithQuery(params)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @Get("/:id")
  getGigById(@Param("id") id: number) {
    try {
      return this.gigService.getGigById(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: GigAddDto })
  @Post()
  addGig(@Req() req: Request, @Body() body) {
    // Requires token, and restriction will be handled by frontend
    let email = req.user["data"].email

    try {
      return this.gigService.addGig(email, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: GigUpdateDto })
  @Put("/:id")
  updateGig(@Req() req: Request, @Param("id") id: number, @Body() body) {
    let email = req.user["data"].email

    try {
      return this.gigService.updateGig(+id, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: GigUpdateAdminDto })
  @Put("admin-update/:id")
  updateGigWithAdminPrivilege(@Req() req: Request, @Param("id") id: number, @Body() body) {
    let decodedToken = req.user

    // Only allow access to ADMINS
    checkUserRole(decodedToken["data"].role)



    try {
      return this.gigService.updateGigWithAdminPrivilege(+id, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete("/:id")
  deleteGig(@Req() req: Request, @Param("id") id: number) {
    let user = req.user["data"]

    try {
      return this.gigService.deleteGig(user, +id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }



  @UseGuards(AuthGuard('jwt'))
  // Reuse subcategory photo DTO
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: SubcategoryPhotoDto
  })
  // Store in backend directory, but ideally should be on an online storage

  @Post("/update-gig-photo/:id")
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/gigImg",
      filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname),
    })
  }))
  updateGigPhoto(@Req() req: Request, @UploadedFile() file: Express.Multer.File, @Param("id") id: number) {
    let user = req.user["data"]

    try {
      return this.gigService.updateGigPhoto(user, +id, file.path)

    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
