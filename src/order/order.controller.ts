import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { checkUserRole } from 'src/util/util';
import { OrderFormType, OrderUpdateFormType } from './entities/order.entity';

@ApiTags("Order")
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllOrders(@Req() req: Request) {
    let decodedToken = req.user

    // Only allow users with admin privilege to access full data
    checkUserRole(decodedToken["data"].role)

    try {
      return this.orderService.getAllOrders()
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("user-order")
  getAllUserOrders(@Req() req: Request) {
    let user = req.user["data"]

    try {
      return this.orderService.getAllUserOrders(user)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("get-orders-with-query")
  getAllOrdersWithQuery(@Req() req: Request, @Query("pageIndex") pageIndex: number, @Query("pageSize") pageSize: number) {
    let params = { pageIndex: +pageIndex, pageSize: +pageSize }
    let decodedToken = req.user

    // Only allow users with admin privilege to access full data
    checkUserRole(decodedToken["data"].role)

    return this.orderService.getAllOrdersWithQuery(params)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/:id")
  getOrderById(@Req() req: Request, @Param("id") id: number) {
    let decodedToken = req.user

    // Only allow users with admin privilege to access
    checkUserRole(decodedToken["data"].role)

    try {
      return this.orderService.getOrderById(+id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  addOrder(@Req() req: Request, @Body() body: OrderFormType) {
    let user = req.user

    try {
      return this.orderService.addOrder(user, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put("/:id")
  updateOrder(@Req() req: Request, @Param("id") id: number, @Body() body: OrderUpdateFormType) {
    let decodedToken = req.user

    // Only allow users with admin privilege to access
    checkUserRole(decodedToken["data"].role)

    try {
      return this.orderService.updateOrder(+id, body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete("/:id")
  deleteOrder(@Req() req: Request, @Param("id") id: number) {
    // Any user can delete their own orders
    let user = req.user["data"]

    try {
      return this.orderService.deleteOrder(user, +id)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
