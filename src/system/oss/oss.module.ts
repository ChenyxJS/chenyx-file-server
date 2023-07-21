import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OssEntity } from './oss.entity';
import { OssService } from './oss.service';
import { OssController } from './oss.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import fse = require('fs-extra');

// 分片上传配置
const simpleChunkUpload = MulterModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory(config: ConfigService) {
        return {
            storage: diskStorage({
                //文件储存位置
                destination: (_, file, callback) => {
                    // 先将分片文件保存在临时目录中
                    const fname = file.originalname.split('.')[0];
                    const chunkDir = `${config.get('upload.location')}/${fname}`;
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
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory(config: ConfigService) {
        return {
            storage: diskStorage({
                //文件储存位置
                destination: (_, file, callback) => {
                    const fext = file.originalname.split('.')[1];
                    const uploadDir = `${config.get('upload.location')}/${fext}`;
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

@Module({
    imports: [
        TypeOrmModule.forFeature([OssEntity]),
        simpleChunkUpload,
        simpleUpload
    ],
    providers: [OssService],
    controllers: [OssController]
})
export class OssModule {}
