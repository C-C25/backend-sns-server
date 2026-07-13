import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.auth.dto';
import { LoginUserDto } from './dto/login.auth.dto';
import { JwtRefreshGuard } from './guard/jwt-refresh.auth.guard';
import type { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from '../users/decorator/user.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Post('token/access')
  async rotateAccessToken(@User() user: JwtPayload) {
    const currentUser = await this.usersService.findByUserId(user.sub);

    const token = await this.authService.accessSignToken({
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    });

    return {
      accessToken: token,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('token/refresh')
  async rotateRefreshToken(@User() user: JwtPayload) {
    const currentUser = await this.usersService.findByUserId(user.sub);

    const token = await this.authService.refreshSignToken({
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    });

    return {
      refreshToken: token,
    };
  }

  @Post('register/email')
  postRegisterUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerWithEmail(dto);
  }

  @Post('login/email')
  postLoginUser(@Body() dto: LoginUserDto) {
    return this.authService.loginWithEmail(dto);
  }
}
