import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OrderFormType, OrderUpdateFormType } from './entities/order.entity';
import { UserQueryType } from 'src/user/entities/user.entity';

function exclude(user, keys) {
    return Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key))
    );
}

@Injectable()
export class OrderService {
    prisma = new PrismaClient()

    async getAllOrders() {
        // Also include removed orders
        try {
            let data = await this.prisma.gig_order.findMany({})


            let totalSize = await this.prisma.gig_order.count({})

            return { orderList: data, totalSize }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }

    }

    async getAllUserOrders(user) {
        // Only returns order made by the user

        let userData = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        try {
            let data = await this.prisma.gig_order.findMany({
                where: {
                    removed: false,
                    buyer_id: userData.user_id
                }
            })

            let orderList = []
            data.map((item) => { orderList.push(exclude(item, "removed")) })

            let totalSize = await this.prisma.gig_order.count({
                where: {
                    removed: false,
                    buyer_id: userData.user_id
                }
            })

            return { orderList, totalSize }
        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }

    }

    async getAllOrdersWithQuery(params) {
        let { pageIndex, pageSize } = params

        let data = await this.prisma.gig_order.findMany({
            take: pageSize,
            skip: (pageIndex - 1) * pageSize,
        })

        let orderList = []
        data.map((item) => { orderList.push(exclude(item, "removed")) })

        let totalSize = await this.prisma.gig_order.count({
            where: {
                removed: false,
            }
        })


        return { orderList, totalSize }
    }

    async getOrderById(id: number) {
        let data = await this.prisma.gig_order.findFirst({
            where: {
                id: id,
            }
        })


        if (data) {
            return data
        } else {
            throw new HttpException("Order does not exist.", HttpStatus.BAD_REQUEST)
        }

    }

    async addOrder(user, body: OrderFormType) {
        // Check for invalid gig ID
        let gig = await this.prisma.gig.findFirst({
            where: {
                gig_id: body.gig_id
            }
        })

        if (!gig) {
            throw new HttpException("Gig does not exist.", HttpStatus.BAD_REQUEST)
        }

        // Get buyer ID through token
        let buyer = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        // Add order if all checks pass
        // Status = false => order not finished

        try {
            await this.prisma.gig_order.create({
                // data: { ...body, buyer_id: +buyer.user_id, status: false }
                // Date will be decided by backend
                data: {
                    gig_id: +body.gig_id,
                    buyer_id: +buyer.user_id,
                    order_date: new Date(),
                    status: false,
                }
            })

            return { message: "Order created successfully.", status: HttpStatus.CREATED }

        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async updateOrder(id: number, body: OrderUpdateFormType) {
        // Check for invalid order ID
        let order = await this.prisma.gig_order.findFirst({
            where: {
                id: id,
            }
        })

        if (!order) {
            throw new HttpException("Order does not exist.", HttpStatus.BAD_REQUEST)
        }

        // Update order if all checks pass, only allow changes to status and removed columns
        // Status = false => order not finished

        try {
            await this.prisma.gig_order.update({
                where: {
                    id: id
                },
                data: {
                    ...body
                }
            })

            return { message: "Order updated successfully.", status: HttpStatus.CREATED }

        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }

    async deleteOrder(user, id: number) {
        // Check for invalid order ID and if the order is not already removed
        let order = await this.prisma.gig_order.findFirst({
            where: {
                id: id,
                removed: false
            }
        })

        if (!order) {
            throw new HttpException("Order does not exist.", HttpStatus.BAD_REQUEST)
        }

        // Check if it's the user order
        let userData = await this.prisma.user.findFirst({
            where: {
                email: user.email
            }
        })

        if (order.buyer_id !== userData.user_id) {
            throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
        }

        // Delete order if all checks pass
        // Status = false => order not finished

        try {
            await this.prisma.gig_order.update({
                where: {
                    id: id
                },
                data: {
                    removed: true
                }
            })

            return { message: "Order deleted successfully.", status: HttpStatus.CREATED }

        } catch (err) {
            throw new HttpException("An error has occurred.", HttpStatus.BAD_REQUEST)
        }
    }
}
