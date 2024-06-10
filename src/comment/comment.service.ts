import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentFormType } from './entities/comment.entity';
import { CommentQueryType } from './dto/comment.dto';

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
        let data = await this.prisma.comments.findMany({
            where: {
                removed: false
            }
        })
        let totalSize = await this.prisma.comments.count({
            where: {
                removed: false
            }
        })

        let commentsList = []
        data.map((item) => {
            commentsList.push(exclude(item, ["id", "removed", "backup"]))
        })

        return { commentsList, totalSize }
    }

    async getAllCommentsByGigId(id) {
        // Check if gig ID is valid and comment is not deleted
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: id,
                removed: false
            }
        })

        if (!gig) {
            throw new HttpException("Gig does not exist.", HttpStatus.BAD_REQUEST)
        }

        let commentsList = []

        let data = await this.prisma.comments.findMany({
            where: {
                gig_id: id,
                removed: false
            }
        })

        data.map((item) => { commentsList.push(exclude(item, ["id", "removed", "backup"])) })

        let totalSize = await this.prisma.comments.count({
            where: {
                gig_id: id,
                removed: false
            }
        })

        return { commentsList, totalSize }
    }

    async getAllCommentsWithQuery(params: CommentQueryType) {
        let { pageIndex, pageSize, email } = params

        // Get user ID if email is passed as parameter
        let userData: any
        if (email) {
            userData = await this.prisma.user.findFirst({
                where: {
                    email: {
                        contains: email
                    }
                }
            })
        }

        let data: any
        if (userData) {
            data = await this.prisma.comments.findMany({
                take: pageSize,
                skip: (pageIndex - 1) * pageSize,
                where: {
                    commenter_id: userData.user_id,
                    removed: false
                }
            })
        } else {
            // Return no result if cannot find any matching email
            return { commentsList: [], totalSize: 0 }
        }


        let totalSize: number = await this.prisma.comments.count({
            where: {
                commenter_id: email ? userData.user_id : null,
                removed: false
            }
        })


        let commentsList = []
        data.map((item) => {
            commentsList.push(exclude(item, ["id", "removed", "backup"]))
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

    async updateComment(user, id: number, body) {
        // Check if comment ID is valid and comment is not deleted
        let comment = await this.prisma.comments.findFirst({
            where: {
                id: id,
                removed: false
            }
        })

        if (!comment) {
            throw new HttpException("Comment does not exist.", HttpStatus.BAD_REQUEST)
        }

        // Get commenter's ID and check if it matches the user's ID
        // Only allow user to edit their own comments
        // Allow ADMINS to edit comments for now, although it might lead to transparency issues

        let userData = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })


        if (comment.commenter_id !== userData.user_id && userData.role !== "ADMIN") {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        // Update comment if all checks pass
        // Overwrite comment_date with new one, although it might cause some tracking issues
        try {
            await this.prisma.comments.update({
                where: {
                    id: id
                },
                data: {
                    content: body.content,
                    rating: +body.rating,
                    comment_date: new Date()
                }
            })

            return { message: "Comment updated successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateCommentAsAdmin(user, id: number, body) {
        // Check if comment ID is valid and comment is not deleted
        let comment = await this.prisma.comments.findFirst({
            where: {
                id: id,
                removed: false
            }
        })

        if (!comment) {
            throw new HttpException("Comment does not exist.", HttpStatus.BAD_REQUEST)
        }

        // ADMINS can also change the removed status

        // Update comment if all checks pass
        // Overwrite comment_date with new one, although it might cause some tracking issues
        console.log(body.removed);
        try {
            await this.prisma.comments.update({
                where: {
                    id: id
                },
                data: {
                    content: body.content,
                    rating: +body.rating,
                    comment_date: new Date(),
                    removed: body.removed
                }
            })

            return { message: "Comment updated successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }


    async deleteComment(user, id: number) {
        // Check if comment ID is valid and comment is not deleted
        let comment = await this.prisma.comments.findFirst({
            where: {
                id: id,
                removed: false
            }
        })

        if (!comment) {
            throw new HttpException("Comment does not exist.", HttpStatus.BAD_REQUEST)
        }

        // Get commenter's ID and check if it matches the user's ID
        // Only allow user to delete their own comments
        // Allow ADMINS to delete comments for now, although it might lead to transparency issues

        let userData = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })


        if (comment.commenter_id !== userData.user_id && userData.role !== "ADMIN") {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        // Delete comment if all checks pass
        // For now we just set removed to true and filter it out
        // Another approach is to set removed to true, change the content to "Removed by user" / "Removed by Admin"
        // and copy the old comment to backup column for backup purposes
        // and we still show all comments, removed ones will just appear as "Removed by user"

        try {
            await this.prisma.comments.update({
                where: {
                    id: id
                },
                data: {
                    removed: true,
                }
            })

            return { message: "Comment deleted successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }
}
