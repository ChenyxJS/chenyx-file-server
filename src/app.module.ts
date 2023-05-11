/*
 * @Author: chenyx
 * @Date: 2023-05-02 15:22:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-05 21:59:23
 * @FilePath: /chenyx-file-server/src/app.module.ts
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';

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
            entities: [],
            synchronize: true
        }),
        CommonModule,
        FileModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
