import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        @InjectRepository(User) private readonly UserMapper: Repository<User>
    ) {
        super({
            //解析用户提交的header中的Bearer Token数据
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            //加密码的 secret
            secretOrKey: configService.get('TOKEN_SECRET')
        });
    }

    //验证通过后获取用户资料
    async validate({ sub: id }) {
        const user = await this.UserMapper.findOneBy({ userId: id })
        delete user.userPassword
        return user;
    }
}
