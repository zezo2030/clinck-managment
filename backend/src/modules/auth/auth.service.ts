import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : undefined,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.formatUserWithFullName(user);
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findOne(userId);
    return this.formatUserWithFullName(user);
  }

  async generateAdminToken(user: any): Promise<string> {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      type: 'admin' // تمييز توكن الأدمن
    };
    return this.jwtService.sign(payload);
  }

  private formatUserWithFullName(user: any) {
    if (!user) return null;
    return {
      ...user,
      name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : undefined,
    };
  }
}
