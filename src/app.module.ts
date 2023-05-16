/*
 * @Author: chenyx
 * @Date: 2023-05-02 15:22:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-16 11:51:16
 * @FilePath: /chenyx-file-server/src/app.module.ts
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonController } from './common/common.controller';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        // 连接数据库
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '12345678',
            database: 'chenyx_file_server',
            // 是否同步实体
            synchronize: true,
            // 是否自动加载实体
            autoLoadEntities: true
        }),
        CommonModule,
        UserModule
    ],
    controllers: [AppController, CommonController],
    providers: [AppService]
})
export class AppModule {}
