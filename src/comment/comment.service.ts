import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentFormType } from './entities/comment.entity';

function exclude(item, keys) {
    return Object.fromEntries(
        Object.entries(item).filter(([key]) => !keys.includes(key))
    );
}


@Injectable()
export class CommentService {
    prisma = new PrismaClient()

    async getAllComments() {
        // Also include removed comments
        let data = await this.prisma.comments.findMany()
        let totalSize = await this.prisma.comments.count()

        return { commentsList: data, totalSize }
    }

    async getAllCommentsByGigId(id) {
        // Check if gig ID is valid
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: id
            }
        })

        if (!gig) {
            throw new HttpException("Gig does not exist.", HttpStatus.BAD_REQUEST)
        }

        let commentsList = []

        let data = await this.prisma.comments.findMany({
            where: {
                gig_id: id
            }
        })

        data.map((item) => { commentsList.push(exclude(item, ["id", "removed", "backup"])) })

        let totalSize = await this.prisma.comments.count({
            where: {
                gig_id: id
            }
        })

        return { commentsList, totalSize }
    }


    async addComment(user, body) {
        // Check if gig ID is valid
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: +body.gig_id
            }
        })

        if (!gig) {
            throw new HttpException("Gig does not exist.", HttpStatus.BAD_REQUEST)
        }

        // Get commenter ID
        let userData = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        // Add comment if all checks pass
        try {
            await this.prisma.comments.create({
                data: {
                    ...body,
                    commenter_id: +userData.user_id,
                    comment_date: new Date()
                }
            })

            return { message: "Comment added successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }
}
