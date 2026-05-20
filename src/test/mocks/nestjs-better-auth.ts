import {
  CanActivate,
  DynamicModule,
  ExecutionContext,
  Injectable,
  Module,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

export const AllowAnonymous = () => SetMetadata('allow-anonymous', true);
export const OptionalAuth = () => SetMetadata('optional-auth', true);
export const Public = AllowAnonymous;
export const Roles = (...roles: string[]) => SetMetadata('ROLES', roles);

export const Session = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().session,
);

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
    };
  }
}

export class AuthService {}
