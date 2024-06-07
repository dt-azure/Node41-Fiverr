import { Body, Controller, Get, HttpException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { checkUserRole } from 'src/util/util';
import { Request } from 'express';
import { CommentFormType } from './entities/comment.entity';

@ApiTags("Comments")
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllComments(@Req() req: Request) {
    let decodedToken = req.user

    // Only allow users with admin privilege to access full data
    checkUserRole(decodedToken["data"].role)

    return this.commentService.getAllComments()
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
  @Post()
  addComment(@Req() req: Request, @Body() body: CommentFormType) {
    let user = req.user["data"]

    try {
      return this.commentService.addComment(user, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
