import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/role.decorator";
import { Role } from "../enum/role.enum";


export class RolesGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        const { user } = context.switchToHttp().getRequest()
        console.log(user);

        const hasRequiredRole = requiredRole.some(role => user.role === role)
        if (!hasRequiredRole) {
            throw new UnauthorizedException("You don't have permission!!")
        }

        return true
    }
}