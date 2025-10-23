import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('توكن الأدمن مطلوب');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // التحقق من أن التوكن من نوع admin
      if (payload.type !== 'admin' || payload.role !== 'ADMIN') {
        throw new UnauthorizedException('توكن غير صالح للأدمن');
      }

      // إضافة بيانات المستخدم للـ request
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('توكن الأدمن غير صالح');
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.admin_token;
  }
}
