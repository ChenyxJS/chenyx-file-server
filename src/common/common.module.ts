/*
 * @Author: chenyx
 * @Date: 2023-05-02 16:55:40
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-23 15:00:16
 * @FilePath: /chenyx-file-server/src/common/common.module.ts
 */

import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fse = require('fs-extra');
import { JwtModule } from '@nestjs/jwt';
import { WxLoginController } from './WxLogin.controller';
import { configController } from './config.controller';

import { WxUtils } from './utils/WxUtils';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOpenId } from './entities/UserOpenId.entity';
import { User } from 'src/user/entities/user.entity';

// 分片上传配置
const simpleChunkUpload = MulterModule.registerAsync({
    useFactory() {
        return {
            storage: diskStorage({
                //文件储存位置
                destination: (_, file, callback) => {
                    // 先将分片文件保存在临时目录中
                    const fname = file.originalname.split('.')[0];
                    const chunkDir = `uploads/${fname}`;
                    // 判断该文件夹是否存在
                    if (!fse.existsSync(chunkDir)) {
                        // 不存在则创建改目录
                        fse.mkdirsSync(chunkDir);
                    }
                    // 回调返回临时目录
                    callback(null, chunkDir);
                },
                //文件名定制
                filename: (_, file, callback) => {
                    const path = file.originalname.split('.')[1];
                    callback(null, path);
                }
            })
        };
    }
});

// 单文件上传配置
const simpleUpload = MulterModule.registerAsync({
    useFactory() {
        return {
            storage: diskStorage({
                //文件储存位置
                destination: (_, file, callback) => {
                    // 先将分片文件保存在临时目录中
                    const fext = file.originalname.split('.')[1];
                    const uploadDir = `static/${fext}`;
                    // 判断该文件夹是否存在
                    if (!fse.existsSync(uploadDir)) {
                        // 不存在则创建改目录
                        fse.mkdirsSync(uploadDir);
                    }
                    // 回调返回临时目录
                    callback(null, uploadDir);
                },
                //文件名定制
                filename: (_, file, callback) => {
                    const path = file.originalname;
                    callback(null, path);
                }
            })
        };
    }
});

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserOpenId]),
        HttpModule,
        JwtModule,
        simpleChunkUpload,
        simpleUpload
    ],
    controllers: [WxLoginController, configController],
    providers: [WxUtils],
    exports: [simpleChunkUpload, simpleUpload]
})
export class CommonModule {}
