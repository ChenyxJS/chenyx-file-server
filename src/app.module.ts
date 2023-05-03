/*
 * @Author: chenyx
 * @Date: 2023-05-02 15:22:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-03 03:48:10
 * @FilePath: /chenyx-file-server/src/app.module.ts
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { FileController } from './file/file.controller';

@Module({
  imports: [CommonModule],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule {}
