import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { QueryType } from 'src/util/types';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SubcategoryPhotoDto } from './dto/subcategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { checkUserRole } from 'src/util/util';
import { SubcategoryType, SubcategoryTypeWithList } from './entities/subcategory.entity';

@ApiTags("Subcategory")
@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) { }

  @Get()
  getAllSubcategory() {
    try {
      return this.subcategoryService.getAllSubcategory()
    } catch (exception) {
      throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
    }
  }

  @Get("get-subcategory-with-query")
  getSubcategoryWithQuery(@Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("keyword") keyword: string) {
    let params: QueryType = { pageIndex: +pageIndex, pageSize: +pageSize, keyword: keyword }

    return this.subcategoryService.getAllSubcategoryWithQuery(params)
  }


  @Get("/:id")
  getSubcategoryById(@Param("id") id: number) {
    try {
      return this.subcategoryService.getSubcategoryById(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  addSubcatogery(@Req() req: Request, @Body() body: SubcategoryType) {
    let decodedToken = req.user

    // Only ADMIN can make changes
    checkUserRole(decodedToken["data"].role)

    try {
      return this.subcategoryService.addSubcatogery(body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put("/:id")
  updateSubcategory(@Req() req: Request, @Body() body: SubcategoryTypeWithList, @Param("id") id: number) {
    let decodedToken = req.user

    // Only ADMIN can make changes
    checkUserRole(decodedToken["data"].role)

    try {
      return this.subcategoryService.updateSubcategory(+id, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("add-subcategory-items/:id")
  addSubcategoryItems(@Req() req: Request, @Body() body, @Param("id") id: number) {
    let decodedToken = req.user

    // Only ADMIN can make changes
    checkUserRole(decodedToken["data"].role)

    try {
      return this.subcategoryService.addSubcategoryItems(+id, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete("/:id")
  deleteSubcategory(@Req() req: Request, @Param("id") id: number) {
    let decodedToken = req.user

    // Only ADMIN can make changes
    checkUserRole(decodedToken["data"].role)

    try {
      return this.subcategoryService.deleteSubcategory(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: SubcategoryPhotoDto
  })
  @Post("update-photo/:id")
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/subcategoryImg",
      filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname)
    })
  }))
  updateSubcategoryPhoto(@Req() req: Request, @UploadedFile() file: Express.Multer.File, @Param("id") id: number) {
    let decodedToken = req.user

    // Only ADMIN can make changes
    checkUserRole(decodedToken["data"].role)

    try {
      return this.subcategoryService.updateSubcategoryPhoto(+id, file.path)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
