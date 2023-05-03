/*
 * @Author: chenyx
 * @Date: 2023-05-02 16:55:40
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-03 12:04:03
 * @FilePath: /chenyx-file-server/src/common/common.module.ts
 */

import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fse = require('fs-extra');

// 上传配置
const upload = MulterModule.registerAsync({
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

@Global()
@Module({
    imports: [upload],
    controllers: [],
    exports: [upload]
})
export class CommonModule {}
