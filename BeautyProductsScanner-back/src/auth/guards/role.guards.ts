import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());

    if (!requiredRole) {
      // If the role is not defined for the controller or method, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming you have implemented authentication and set the user object on the request

    // Check if the user's role matches the required role
    if (user && user.role === requiredRole) {
      return true;
    }

    // User's role does not match the required role, deny access
    return false;
  }
}
