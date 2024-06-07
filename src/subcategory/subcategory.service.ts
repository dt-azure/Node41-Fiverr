import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { QueryType } from 'src/util/types';
import { SubcategoryType, SubcategoryTypeWithList } from './entities/subcategory.entity';
import { formatArrToStr, formatStrToArr } from 'src/util/util';

@Injectable()
export class SubcategoryService {
    prisma = new PrismaClient().gig_category
    prisma_sub = new PrismaClient().gig_subcategory

    async getAllSubcategory() {
        let data = await this.prisma_sub.findMany()

        return data
    }

    async getSubcategoryById(id) {
        let data = await this.prisma_sub.findFirst({
            where: {
                id: id
            },
            include: {
                gig_category: true
            }
        })

        if (data) {
            return data
        } else {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }
    }

    async getAllSubcategoryWithQuery(params: QueryType) {
        let { pageIndex, pageSize, keyword } = params

        let data = await this.prisma_sub.findMany({
            take: pageSize,
            skip: (pageIndex - 1) * pageSize,
            where: {
                subcategory_name: {
                    contains: keyword
                }
            }
        })

        let totalSize: number = await this.prisma_sub.count({
            where: {
                subcategory_name: {
                    contains: keyword
                }
            }
        })


        return { subcategoryList: data, totalSize }
    }

    async addSubcatogery(body: SubcategoryType) {
        // Check if category ID is valid
        let category = await this.prisma.findFirst({
            where: {
                id: body.category_id
            }
        })

        if (!category) {
            throw new HttpException("Category does not exist.", HttpStatus.BAD_REQUEST)
        }

        // Check if subcategory already exists
        let subcategory = await this.prisma_sub.findFirst({
            where: {
                subcategory_name: body.subcategory_name
            }
        })

        if (subcategory) {
            throw new HttpException("Subcategory already exists.", HttpStatus.BAD_REQUEST)
        }

        // Add subcategory if all checks pass
        try {
            await this.prisma_sub.create({
                data: {
                    subcategory_name: body.subcategory_name,
                    category_id: +body.category_id
                }
            })

            return { message: "Subcategory added successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateSubcategory(id: number, body: SubcategoryTypeWithList) {
        // Check if category ID is valid
        let category = await this.prisma.findFirst({
            where: {
                id: body.category_id
            }
        })

        if (!category) {
            throw new HttpException("Category does not exist.", HttpStatus.BAD_REQUEST)
        }


        // Update subcategory if all checks pass
        try {
            await this.prisma_sub.update({
                where: {
                    id: id
                },
                data: {
                    ...body,
                    subcategory_items: formatArrToStr(body.subcategory_items)
                }
            })

            return { message: "Subcategory updated successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async addSubcategoryItems(id: number, body) {
        // This endpoint only adds new, if need to update use the update subcategory one
        // Check if subcategory ID is valid
        let subcategory = await this.prisma_sub.findFirst({
            where: {
                id: id
            }
        })

        if (!subcategory) {
            throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST)
        }


        // Update subcategory if all checks pass
        let itemList = formatStrToArr(subcategory.subcategory_items)

        body.subcategory_items.map((item: string) => {
            // Check if item already exists

            if (!itemList.includes(item)) {
                itemList.push(item)
            }

        })



        try {
            await this.prisma_sub.update({
                where: {
                    id: id
                },
                data: {
                    subcategory_items: formatArrToStr(itemList)
                }
            })

            return { message: "Subcategory items updated successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async deleteSubcategory(id: number) {
        // Check if ID exists
        let subcategory = await this.prisma_sub.findFirst({
            where: {
                id: id
            }
        })

        if (!subcategory) {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }

        // Delete if all checks pass
        try {
            await this.prisma_sub.delete({
                where: {
                    id: id
                },
            })

            return { message: "Subcategory deleted successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateSubcategoryPhoto(id: number, path: string) {
        // Check if ID exists
        let subcategory = await this.prisma_sub.findFirst({
            where: {
                id: id
            }
        })

        if (!subcategory) {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }

        // Update photo if all checks pass
        try {
            await this.prisma_sub.update({
                where: {
                    id: id
                },
                data: {
                    subcategory_photo: path
                }
            })

            return { message: "Subcategory photo updated successfully", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }
}
