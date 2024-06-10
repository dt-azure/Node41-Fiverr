import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { checkUserRole } from 'src/util/util';
import { Request } from 'express';
import { CommentFormType } from './entities/comment.entity';
import { CommentAddDto, CommentQueryType, CommentUpdateAdminDto, CommentUpdateDto } from './dto/comment.dto';

@ApiTags("Comments")
@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllComments(@Req() req: Request) {
    let decodedToken = req.user

    // Only allow users with admin privilege to access full data
    // Mainly used for admin page
    checkUserRole(decodedToken["data"].role)

    return this.commentService.getAllComments()
  }


  @ApiQuery({ name: "pageIndex", required: true })
  @ApiQuery({ name: "pageSize", required: true })
  @ApiQuery({ name: "email", required: false })
  @Get("get-comments-with-query")
  getAllUsersWithQuery(@Req() req: Request, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number, @Query("email") email: string) {
    let params: CommentQueryType = { pageIndex: +pageIndex, pageSize: +pageSize, email: email ? email : "" }

    try {
      return this.commentService.getAllCommentsWithQuery(params)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }


  @Get("/:id")
  getAllCommentsByGigId(@Param("id") id: number) {

    try {
      return this.commentService.getAllCommentsByGigId(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: CommentAddDto })
  @Post()
  addComment(@Req() req: Request, @Body() body: CommentFormType) {
    let user = req.user["data"]

    try {
      return this.commentService.addComment(user, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: CommentUpdateDto })
  @Put("/:id")
  updateComment(@Req() req: Request, @Param("id") id: number, @Body() body: CommentFormType) {
    let user = req.user["data"]

    try {
      return this.commentService.updateComment(user, +id, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: CommentUpdateAdminDto })
  @Put("update-admin/:id")
  updateCommentAsAdmin(@Req() req: Request, @Param("id") id: number, @Body() body: CommentFormType) {
    let user = req.user["data"]

    checkUserRole(user.role)

    try {
      return this.commentService.updateCommentAsAdmin(user, +id, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete("/:id")
  deleteComment(@Req() req: Request, @Param("id") id: number) {
    let user = req.user["data"]

    try {
      return this.commentService.deleteComment(user, +id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
