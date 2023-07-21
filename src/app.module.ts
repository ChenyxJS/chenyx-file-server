/*
 * @Author: chenyx
 * @Date: 2023-05-02 15:22:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-07-18 11:44:30
 * @FilePath: /chenyx-file-server/src/app.module.ts
 */
import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './common/upload.controller';
import { UserModule } from './system/user/user.module';
import { AuthModule } from './system/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/index';
import { OssModule } from './system/oss/oss.module';


// 环境变量加载
const envFilePath = ['.env.development'];
if (process.env.NODE_ENV) {
    envFilePath.unshift(`.env.${process.env.NODE_ENV}`);
}

@Module({
    imports: [
        ConfigModule.forRoot({
            //全局模块
            isGlobal: true,
            load: config,
            envFilePath
        }),
        // 数据库
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => config.get('database'),
            inject: [ConfigService]
        }),
        CommonModule,
        UserModule,
        AuthModule,
        OssModule
    ],
    controllers: [UploadController]
})
export class AppModule {}
