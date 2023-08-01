/*
 * @Author: chenyx
 * @Date: 2023-05-02 15:22:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-08-01 22:43:20
 * @FilePath: /chenyx-file-server/src/main.ts
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionsFilter } from './common/exception/http-exceptions.filer';
import * as express from 'express';
import { AllExceptionsFilter } from './common/exception/any-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { logger } from './common/middleware/logger.middleware';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule,{ cors: true });

    // 表单验证
    app.useGlobalPipes(new ValidationPipe());

    // 静态资源访问
    app.useStaticAssets('/www/oss', { prefix: '/static' });

    // 访问频率限制
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15分钟
            max: 1000 // 限制15分钟内最多只能访问1000次
        })
    );

    // 设置所有 api 访问前缀
    app.setGlobalPrefix('/api');

    // 防止跨站请求伪造
    // 设置 csrf 保存 csrfToken
    // app.use(csurf())

    // web 漏洞,
    app.use(helmet());

    // 日志
    app.use(express.json()); // For parsing application/json
    app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
    app.use(logger);

    // 使用全局拦截器打印出参
    app.useGlobalInterceptors(new TransformInterceptor());
    // 所有异常
    app.useGlobalFilters(new AllExceptionsFilter());
    // http 异常
    app.useGlobalFilters(new HttpExceptionsFilter());

    // 配置swagger接口文档
    const options = new DocumentBuilder()
        .setTitle('chenyx-file-server')
        .setDescription('chenyx-file-server-api')
        .setVersion('1.1.0')
        .setExternalDoc('api-json', 'http://localhost:7171/api-doc-json')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'jwt'
        )
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api-doc', app, document);

    // 监听端口
    const PORT = process.env.PORT || 8080;
    await app.listen(PORT, () => {
        Logger.log(`http://localhost:${PORT}`, '服务启动成功');
    });
}
bootstrap();
