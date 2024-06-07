import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoryService {
    prisma = new PrismaClient().gig_category
    prisma_sub = new PrismaClient().gig_subcategory

    async getAllCategory() {
        let data = await this.prisma.findMany()

        return data
    }

    async getCategoryById(id) {
        let category = await this.prisma.findFirst({
            where: {
                id: id
            }
        })

        if (category) {
            return category
        } else {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }
    }

    async addCategory(body) {
        let data = await this.prisma.findFirst({
            where: {
                category_name: body.category_name
            }
        })

        if (data) {
            throw new HttpException("Category already exists.", HttpStatus.BAD_REQUEST)
        }

        try {
            await this.prisma.create({
                data: {
                    category_name: body.category_name
                }
            })

            return { message: "Category added successfully.", status: HttpStatus.OK }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateCategory(id, body) {
        let category = await this.prisma.findFirst({
            where: {
                id: id
            }
        })

        // Check if ID exists
        if (!category) {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }

        // Check if new already name exists
        let categoryNameCheck = await this.prisma.findFirst({
            where: {
                category_name: body.category_name
            }
        })

        if (categoryNameCheck) {
            throw new HttpException("Category already exists. Please use a new name.", HttpStatus.BAD_REQUEST)
        }

        try {
            await this.prisma.update({
                where: {
                    id: id
                },
                data: {
                    category_name: body.category_name
                }
            })

            return {
                message: "Category updated successfully.", details: {
                    id: id,
                    category_name: body.category_name
                }, status: HttpStatus.OK
            }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async deleteCategory(id) {
        let category = await this.prisma.findFirst({
            where: {
                id: id
            }
        })

        // Check if ID is valid or not
        if (!category) {
            throw new HttpException("Invalid ID.", HttpStatus.BAD_REQUEST)
        }

        let subcategory = await this.prisma_sub.findFirst({
            where: {
                category_id: id
            }
        })

        //   Prevent deleting any category that still has subcategories
        if (subcategory) {
            throw new HttpException("Cannot delete any category with subcategories assigned. Please remove all assigned subcategories first.", HttpStatus.BAD_REQUEST)
        }

        try {
            await this.prisma.delete({
                where: {
                    id: id
                }
            })

            return {
                message: "Category deleted successfully.", status: HttpStatus.OK
            }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }
}
