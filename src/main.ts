/*
 * @Author: chenyx
 * @Date: 2023-05-02 15:22:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-03 13:21:56
 * @FilePath: /chenyx-file-server/src/main.ts
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // 配置swagger接口文档
    const options = new DocumentBuilder()
        .setTitle('chenyx-file-server')
        .setDescription('文件上传接口')
        .setVersion('1')
        .build();
    const swagger = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api-doc', app, swagger);

    //静态资源访问
    app.useStaticAssets('static', { prefix: '/static' });

    // 监听端口
    await app.listen(7171);
}
bootstrap();
