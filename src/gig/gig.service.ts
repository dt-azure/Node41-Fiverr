import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { QueryType } from 'src/util/types';

function exclude(item, keys) {
    return Object.fromEntries(
        Object.entries(item).filter(([key]) => !keys.includes(key))
    );
}

@Injectable()
export class GigService {
    prisma = new PrismaClient()

    async getAllGigs() {
        // Only return non-removed items
        let data = await this.prisma.gig.findMany({
            where: {
                removed: false,
            },
        })

        let totalSize = await this.prisma.gig.count({
            where: {
                removed: false,
            }
        })

        let gigList = []
        data.map((item) => { gigList.push(exclude(item, "removed")) })

        return { gigList, totalSize }
    }

    async getAllGigsWithQuery(params: QueryType) {
        let { pageIndex, pageSize, keyword } = params

        let data = await this.prisma.gig.findMany({
            take: pageSize,
            skip: (pageIndex - 1) * pageSize,
            where: {
                gig_name: {
                    contains: keyword
                },
                removed: false,
            }
        })

        let totalSize: number = await this.prisma.gig.count({
            where: {
                gig_name: {
                    contains: keyword
                },
                removed: false,
            }
        })

        let gigList = []
        data.map((item) => { gigList.push(exclude(item, "removed")) })

        return { gigList, totalSize }
    }

    async getGigById(id: number) {
        // Check if id is valid
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: id
            }
        })

        if (gig) {
            if (gig.removed) {
                throw new HttpException("Item does not exist.", HttpStatus.NOT_FOUND)
            } else {
                return exclude(gig, "removed")
            }
        } else {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }
    }

    async addGig(email, body) {
        let seller = await this.prisma.user.findFirst({
            where: {
                email: email
            }
        })


        // Check if subcategory ID is valid
        let subcategory = await this.prisma.gig_subcategory.findFirst({
            where: {
                id: body.subcategory
            }
        })

        if (!subcategory) {
            throw new HttpException("Invalid subcategory ID.", HttpStatus.BAD_REQUEST)
        }

        // Add gig if all checks pass
        try {
            await this.prisma.gig.create({
                data: {
                    ...body,
                    reviews: 0,
                    seller_id: seller.user_id
                }
            })

            return { message: "Gig added successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateGig(id: number, body) {
        // Check if ID is valid and it's not removed
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: id,
                removed: false,
            }
        })

        if (!gig) {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }

        // Check if subcategory ID is valid
        let subcategory = await this.prisma.gig_subcategory.findFirst({
            where: {
                id: body.subcategory
            }
        })

        if (!subcategory) {
            throw new HttpException("Invalid subcategory ID.", HttpStatus.BAD_REQUEST)
        }

        // Update gig if all checks pass
        // User cannot change reviews and rating
        try {
            await this.prisma.gig.update({
                where: {
                    gig_id: id
                },
                data: { ...body }
            })

            return { message: "Gig updated successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateGigWithAdminPrivilege(id: number, body) {
        // Check if ID is valid and it's not removed
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: id,
                removed: false
            }
        })

        if (!gig) {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }

        // Check if subcategory ID is valid
        let subcategory = await this.prisma.gig_subcategory.findFirst({
            where: {
                id: body.subcategory
            }
        })

        if (!subcategory) {
            throw new HttpException("Invalid subcategory ID.", HttpStatus.BAD_REQUEST)
        }

        // Update gig if all checks pass
        try {
            await this.prisma.gig.update({
                where: {
                    gig_id: id
                },
                data: { ...body }
            })

            return { message: "Gig updated successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async deleteGig(user, id: number) {
        // Check if ID is valid and it's not already removed
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: id,
                removed: false,
            }
        })

        if (!gig) {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }

        // Only ADMINS can delete all gigs, USERS can only their own created gigs
        let userCheck = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        if (user.role !== "ADMIN" && userCheck.user_id !== id) {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        // Delete gig if all check pass
        try {
            await this.prisma.gig.update({
                where: {
                    gig_id: id
                },
                data: { removed: true }
            })

            return { message: "Gig deleted successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateGigPhoto(user, id: number, path: string) {
        // Check if ID is valid and it's not already removed
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: id,
                removed: false,
            }
        })

        if (!gig) {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }

        // Only ADMINS can make changes to all gigs, USERS can only change their own created gigs
        let userCheck = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        if (user.role !== "ADMIN" && userCheck.user_id !== id) {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        // Update photo if all checks pass
        try {
            await this.prisma.gig.update({
                where: {
                    gig_id: id
                },
                data: { photo: path }
            })

            return { message: "Gig photo updated successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }
}
