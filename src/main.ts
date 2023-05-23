/*
 * @Author: chenyx
 * @Date: 2023-05-02 15:22:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-23 18:22:47
 * @FilePath: /chenyx-file-server/src/main.ts
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // 配置swagger接口文档
    const options = new DocumentBuilder()
        .setTitle('chenyx-file-server')
        .setDescription('chenyx-file-server-api')
        .setVersion('1')
        .setExternalDoc('api-json', 'http://localhost:7171/api-doc-json')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'jwt'
        )
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api-doc', app, document);

    // 表单验证
    app.useGlobalPipes(new ValidationPipe());

    //静态资源访问
    app.useStaticAssets('static', { prefix: '/static' });

    // 监听端口
    await app.listen(8080);
}
bootstrap();
