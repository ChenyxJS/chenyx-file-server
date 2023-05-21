import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // console.log('context==>', context);
        // const roles = this.reflector.get<string[]>(
        //     'roles',
        //     context.getHandler()
        // );
        // if (!roles) {
        //     return true;
        // }
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user; // it's undefined
        // const hasRole = () =>
        //     user.roles.some(role => !!roles.find(item => item === role));
        // return user && user.roles && hasRole;
        return !!user;
    }
}
