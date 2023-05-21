import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    //设置加密使用的 secret
                    secret: config.get('app.token_secret'),
                    //过期时间
                    signOptions: { expiresIn: '300d' }
                };
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtStrategy]
})
export class AuthModule {}
