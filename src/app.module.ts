/*
 * @Author: chenyx
 * @Date: 2023-05-02 15:22:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-23 19:04:02
 * @FilePath: /chenyx-file-server/src/app.module.ts
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './common/upload.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SoftModule } from './soft/soft.module';
import config from './config/index.config';

@Module({
    imports: [
        // 连接数据库
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '112.74.62.177',
            port: 3306,
            username: 'file-server',
            password: '12345678',
            database: 'file-server',
            // 是否同步实体
            synchronize: true,
            // 是否自动加载实体
            autoLoadEntities: true
        }),
        ConfigModule.forRoot({
            //全局模块
            isGlobal: true,
            load: config
        }),
        CommonModule,
        UserModule,
        AuthModule,
        SoftModule,
    ],
    controllers: [AppController, UploadController],
    providers: [AppService]
})
export class AppModule {}
