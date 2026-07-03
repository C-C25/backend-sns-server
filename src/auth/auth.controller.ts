import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.auth.dto';
import { LoginUserDto } from './dto/login.auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/email')
  postRegisterUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerWithEmail(dto);
  }

  @Post('login/email')
  postLoginUSer(@Body() dto: LoginUserDto) {
    return this.authService.loginWithEmail(dto);
  }
}
