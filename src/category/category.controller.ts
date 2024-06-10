import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { checkUserRole } from 'src/util/util';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CategoryAddDto } from './dto/category.dto';

@ApiTags("Category")
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  getAllCategory() {
    try {
      return this.categoryService.getAllCategory()
    } catch (exception) {
      throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
    }
  }

  @Get("/:id")
  getCategoryById(@Param("id") id: number) {
    try {
      return this.categoryService.getCategoryById(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @ApiBody({ type: CategoryAddDto })
  @Post()
  addCategory(@Req() req: Request, @Body() body) {
    let decodedToken = req.user

    // Only ADMIN can make changes
    checkUserRole(decodedToken["data"].role)

    try {
      return this.categoryService.addCategory(body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @ApiBody({ type: CategoryAddDto })
  @Put("/:id")
  updateCategory(@Req() req: Request, @Param("id") id: number, @Body() body) {
    let decodedToken = req.user

    // Only ADMIN can make changes
    checkUserRole(decodedToken["data"].role)

    try {
      return this.categoryService.updateCategory(+id, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("/:id")
  deleteCategory(@Req() req: Request, @Param("id") id: number) {
    let decodedToken = req.user

    // Only ADMIN can make changes
    checkUserRole(decodedToken["data"].role)

    try {
      return this.categoryService.deleteCategory(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
