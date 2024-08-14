import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@/auth/decorators/role.decorator';
import { ROLES } from '@/auth/consts';
import { RoleGuard } from '@/auth/guards/role.guard';
import { ProjectsService } from '@/projects/projects.service';
import { Request } from 'express';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';

@Controller('/users')
@UseGuards(JwtAuthGuard)
@UseGuards(RoleGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly projectService: ProjectsService
    ) {}

    @Role(ROLES.ADMIN)
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get("/projects")
    async findProjects(
        @Req() req: Request
    ) {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException("Usuario no autenticado");
        }
        return this.projectService.findByAuthor(user);
    }
}
