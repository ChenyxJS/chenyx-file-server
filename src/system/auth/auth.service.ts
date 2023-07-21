import { Injectable } from '@nestjs/common';
import { RegiseterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { JsonResult } from 'src/common/entities/JsonResult.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/system/user/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RequestCodeEnum } from 'src/common/enum/RequestCodeEnum.enum';
import { RequestMessageEnum } from 'src/common/enum/RequestMessageEnum.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly UserRepository: Repository<User>,
        private readonly jwt: JwtService
    ) {}

    /**
     * @description: 获取令牌
     * @param {users} user
     * @return {*}
     */
    async token(user: User): Promise<Record<string,string>> {
        return {
            token: await this.jwt.signAsync({
                username: user.userEmail,
                sub: user.userId
            })
        };
    }

    /**
     * @description: 注册
     * @param {RegiseterDto} regiseterDto
     * @return {*}
     */
    async register(regiseterDto: RegiseterDto): Promise<JsonResult<User>> {
        const jsonResult = new JsonResult<User>();

        //加密用户密码
        const password = await argon2.hash(regiseterDto.userPassword);
        const user = await this.UserRepository.save({
            userName: regiseterDto.userName,
            userEmail: regiseterDto.userEmail,
            userPassword: password
        } as User);
        //返回的数据不显示密码
        delete user.userPassword;

        jsonResult.buildTureObject(user);
        return jsonResult;
    }

    /**
     * @description : 登录
     * @param {LoginDto} loginDto
     * @return {*}
     */
    async login(loginDto: LoginDto): Promise<JsonResult<any>> {
        const jsonResult = new JsonResult();

        const user = await this.UserRepository.findOneBy({
            userName: loginDto.username
        });
        if (!user) {
            jsonResult.buildFail(
                RequestCodeEnum.REQUEST_ERROR_LOGIN_INFO,
                RequestMessageEnum.REQUEST_ERROR_LOGIN_INFO,
                '无用户信息'
            );
            return jsonResult;
        }

        const psMatch = await argon2.verify(
            user.userPassword,
            loginDto.password
        );

        if (!psMatch) {
            jsonResult.buildFail(
                RequestCodeEnum.REQUEST_ERROR_LOGIN_PASSWORD,
                RequestMessageEnum.REQUEST_ERROR_LOGIN_PASSWORD,
                '登录密码错误'
            );
            return jsonResult;
        }
        //返回的数据不显示密码
        delete user.userPassword;

        const token = (await this.token(user)).token;
        jsonResult.buildTureObject({ token, userInfo: user });
        return jsonResult;
    }
}
