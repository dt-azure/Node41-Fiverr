import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { GigModule } from './gig/gig.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';
import { JwtRefreshStrategy, JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true }), CategoryModule, SubcategoryModule, GigModule, OrderModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, JwtRefreshStrategy],
})
export class AppModule {}
