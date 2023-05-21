/*
 * @Author: chenyx
 * @Date: 2023-05-06 16:00:46
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-21 21:31:05
 * @FilePath: /chenyx-file-server/src/common/upload.controller.ts
 */
import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    Res
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import fse = require('fs-extra');
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('upload')
@ApiTags('文件上传模块接口')
export class UploadController {

    @Post('simpleChunck')
    @ApiOperation({ summary: '单文件分片上传' })
    @ApiParam({ name: 'file', type: '__file' })
    @UseInterceptors(FileInterceptor('file'))
    simpleChunck(@UploadedFile() file: Express.Multer.File) {
        return file;
    }

    @Post('simpleUpload')
    @ApiOperation({ summary: '单文件分片上传' })
    @ApiParam({ name: 'file', type: '__file' })
    @UseInterceptors(FileInterceptor('file'))
    simpleUpload(@UploadedFile() file: Express.Multer.File) {
        const savePath = file.path
        return `http://localhost:7171/${savePath}`;
    }

    @Post('merge')
    @ApiOperation({ summary: '分片文件合并' })
    @ApiBody({})
    async merge(@Body() data: any) {
        const fileName = data.fileName;
        // 获取文件名
        const fname = fileName.split('.')[0];
        // 获取文件拓展名
        const fext = fileName.split('.')[1];
        // 按照拓展名分类文件
        if (!fse.existsSync(`static/${fext}`)) {
            fse.mkdirsSync(`static/${fext}`);
        }
        const savePath = `static/${fext}/${fileName}`;
        // 根据文件名获取对应文件夹下的分片列表
        const chunkDir = `uploads/${fname}`;
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
