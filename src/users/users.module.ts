import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '@/auth/entities/role.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
