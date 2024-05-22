import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@/auth/decorators/role.decorator';
import { ROLES } from '@/auth/consts';
import { RoleGuard } from '@/auth/guards/role.guard';

@Controller('/users')
@UseGuards(RoleGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Role(ROLES.ADMIN)
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }
}
