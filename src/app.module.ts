import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { GigModule } from './gig/gig.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true}), CategoryModule, SubcategoryModule, GigModule, OrderModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
