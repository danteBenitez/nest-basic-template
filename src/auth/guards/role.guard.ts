import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { ROLE_KEY } from "../decorators/role.decorator";

export class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        const roles = user?.roles;
        const requiredRole = Reflect.getMetadata(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!user || !requiredRole) return true;
        return roles?.some(role => role.name === requiredRole) ?? false;
    }
}