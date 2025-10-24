import { Controller, Post, Body, UseGuards, UnauthorizedException, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Response, Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'تسجيل مستخدم جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المستخدم بنجاح' })
  @ApiResponse({ status: 400, description: 'بيانات غير صحيحة' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'تسجيل الدخول' })
  @ApiResponse({ status: 200, description: 'تم تسجيل الدخول بنجاح' })
  @ApiResponse({ status: 401, description: 'بيانات الدخول غير صحيحة' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }
    
    const loginResult = await this.authService.login(user);
    
    // إعداد HTTP-only cookie للمرضى والأطباء
    res.cookie('auth_token', loginResult.access_token, {
      httpOnly: true,
      secure: false, // false في التطوير
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
      path: '/',
      domain: 'localhost'
    });
    
    return loginResult;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على بيانات المستخدم الحالي' })
  @ApiResponse({ status: 200, description: 'بيانات المستخدم' })
  @ApiResponse({ status: 401, description: 'غير مصرح' })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'تسجيل دخول الأدمن' })
  @ApiResponse({ status: 200, description: 'تم تسجيل الدخول بنجاح' })
  @ApiResponse({ status: 401, description: 'بيانات الدخول غير صحيحة أو غير مصرح للأدمن' })
  async adminLogin(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    console.log('Admin login attempt:', loginDto.email);
    
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      console.log('Admin login failed: Invalid credentials for', loginDto.email);
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }
    
    // التحقق من أن المستخدم أدمن
    if (user.role !== 'ADMIN') {
      console.log('Admin login failed: User is not admin, role:', user.role);
      throw new UnauthorizedException('غير مصرح - هذه الصفحة مخصصة للأدمن فقط');
    }
    
    console.log('Admin login successful for:', user.email);

    const token = await this.authService.generateAdminToken(user);
    
    // إعداد HTTP-only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: false, // false في التطوير
      sameSite: 'lax', // تغيير من strict إلى lax
      maxAge: 24 * 60 * 60 * 1000, // 24 ساعة
      path: '/'
    });

    return {
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : undefined,
      }
    };
  }

  @Get('admin/verify')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'التحقق من صحة جلسة الأدمن' })
  @ApiResponse({ status: 200, description: 'جلسة صحيحة' })
  @ApiResponse({ status: 401, description: 'جلسة غير صحيحة' })
  async verifyAdminSession(@CurrentUser() user: any) {
    console.log('Admin session verification for:', user.email);
    return {
      user: {
        id: user.sub,
        email: user.email,
        role: user.role,
      }
    };
  }

  @Post('admin/logout')
  @ApiOperation({ summary: 'تسجيل خروج الأدمن' })
  @ApiResponse({ status: 200, description: 'تم تسجيل الخروج بنجاح' })
  async adminLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/'
    });
    
    return { message: 'تم تسجيل الخروج بنجاح' };
  }
}
