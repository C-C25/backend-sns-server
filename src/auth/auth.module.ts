import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtAccessStrategy } from './strategy/jwt-strategy-access.auth';
import { JwtRefreshStrategy } from './strategy/jwt-strategy-refresh.auth';
import { PassportModule } from '@nestjs/passport';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [PassportModule, JwtModule.register({}), UsersModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
