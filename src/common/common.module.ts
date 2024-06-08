/*
 * @Author: chenyx
 * @Date: 2023-05-02 16:55:40
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-07-21 16:11:03
 * @FilePath: /chenyx-file-server/src/common/common.module.ts
 */

import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WxLoginController } from './WxLogin.controller';
import { configController } from './config.controller';

import { WxUtils } from './utils/WxUtils';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOpenId } from './entities/UserOpenId.entity';
import { User } from 'src/system/user/user.entity';
import { JuejinUtils } from './utils/JuejinUtils';
import { JuejinController } from './Juejin.controller';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserOpenId]),
        HttpModule,
        JwtModule,
    ],
    controllers: [WxLoginController, configController,JuejinController],
    providers: [WxUtils, JuejinUtils]
})
export class CommonModule {}
