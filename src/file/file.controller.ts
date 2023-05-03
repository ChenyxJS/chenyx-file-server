/*
 * @Author: chenyx
 * @Date: 2023-05-02 16:56:05
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-03 12:45:27
 * @FilePath: /chenyx-file-server/src/file/file.controller.ts
 */
import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import fse = require('fs-extra');

@Controller('file')
@ApiTags('文件管理接口')
export class FileController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file: Express.Multer.File) {
        return file;
    }
    @Post('merge')
    async merge(@Body() data: any) {
        const fileName = data.fileName;
        // 获取文件名
        const fname = fileName.split('.')[0];
        // 获取文件拓展名
        const fext = fileName.split('.')[1];
        // 按照拓展名分类文件
        if(!fse.existsSync(`static/${fext}`)){
            fse.mkdirsSync(`static/${fext}`);
        }
        const savePath = `static/${fext}/${fileName}`
        // 根据文件名获取对应文件夹下的分片列表
        const chunkDir = `uploads/${fname}`
        const chunks = await fse.readdir(chunkDir);
        // 安装index排序
        chunks
            .sort((a: any, b: any) => a - b)
            .map((chunkPath: string) => {
                // 将所有分片合并
                fse.appendFileSync(
                    savePath,
                    fse.readFileSync(`${chunkDir}/${chunkPath}`)
                );
            });
        // 删除零时文件夹
        fse.removeSync(chunkDir);
        return `http://localhost:7171/${savePath}`;
    }
}
