import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOpenId } from '../entities/UserOpenId.entity';
import { User } from 'src/user/entities/user.entity';
import * as argon2 from 'argon2';
import { Platform } from '../enum/Platform.enum';

@Injectable()
export class WxUtils {
    constructor(
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
        @InjectRepository(UserOpenId)
        private readonly UserOpenIdRepository: Repository<UserOpenId>,
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
        private readonly jwt: JwtService
    ) {}
    async genToken(js_code: string, userName?: string, userAvatar?: string) {
        // openid是用户在同一个小程序下的唯一表示,
        // 即同一个用户在不同的小程序下的openid是不同的
        // 所以当你的appid变化之后,用户的openid就会发生变化,只变AppSecret时 openid是不会变的。
        const params: any = {
            appid: this.config.get('app.app_id'), // 管理员在微信公众平台获取
            secret: this.config.get('app.app_secret'), // 管理员在微信公众平台获取
            grant_type: 'authorization_code', // 写死
            js_code
        };
        // 请求微信服务端接口 返回session_key和openid
        const res = await firstValueFrom(
            this.httpService
                .get('https://api.weixin.qq.com/sns/jscode2session', { params })
                .pipe(map(response => response.data))
        );

        const { openid, session_key, errcode } = res;
        // 如果微信服务端抛出错误，则将错误直接返回给前端
        if (errcode) {
            // https://betheme.net/news/txtlist_i90049v.html?action=onClick
            throw new HttpException(
                { ...res },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        } else {
            // 查找数据库是否存在该用户的opneid
            // 若已存在则获取返回用户信息
            // 根据用户信息生成token并返回
            const userOpenId = await this.UserOpenIdRepository.findOne({
                where: {
                    usopOpenId: openid
                },
                relations: ['usop']
            });
            let newUser = {} as User;
            let token = '';
            if (userOpenId) {
                // 若已存在则获取返回用户信息
                newUser = userOpenId.usop;
                // 使用用户信息生成jwt令牌
                token = await this.jwt.signAsync(
                    {
                        username: newUser.userName,
                        sub: newUser.userId
                    },
                    {
                        secret: this.config.get('app.token_secret')
                    }
                );
            } else {
                // 未查到则注册新用户并绑定openid
                // 初始化密码123456
                if (!!userName && !!userAvatar) {
                    const initPassword = await argon2.hash('123456');
                    const createUser = await this.UserRepository.save({
                        userName: userName,
                        userAvatar: userAvatar,
                        userPassword: initPassword
                    });
                    const userOpenId = await this.UserOpenIdRepository.save({
                        usopOpenId: openid,
                        usopPlatform: Platform.WX_MP,
                        usopAppId: this.config.get('app.app_id'),
                        usop: createUser
                    } as UserOpenId);
                    createUser.openId = [userOpenId];
                    token = await this.jwt.signAsync(
                        {
                            username: createUser.userName,
                            sub: createUser.userId
                        },
                        {
                            secret: this.config.get('app.token_secret')
                        }
                    );
                } else {
                    token = '';
                }
            }

            return token;
        }
    }

    async getWxUserInfo(params: { code: string; openId: string }) {
        // 请求微信服务端接口 返回用户信息
        const wxUserInfoParams = {
            access_token: params.code,
            openid: params.openId,
            lang: 'zh_CN'
        };
        const wxUserInfo = await firstValueFrom(
            this.httpService
                .get(
                    'https://api.weixin.qq.com/wxa/getpluginopenpid?access_token=ACCESS_TOKEN',
                    {
                        params: wxUserInfoParams
                    }
                )
                .pipe(map(response => response.data))
        );
        console.log(wxUserInfo);
    }
}
