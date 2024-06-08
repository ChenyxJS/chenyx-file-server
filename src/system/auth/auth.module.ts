import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/system/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/system/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthStrategy } from './auth.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    //设置加密使用的 secret
                    secret: config.get('JWT.secretKey'),
                    //过期时间
                    signOptions: { expiresIn: config.get('JWT.expiresIn') }
                };
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, AuthStrategy]
})
export class AuthModule {}
