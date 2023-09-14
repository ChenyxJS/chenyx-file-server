import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    Get,
    Query,
    Param,
    Delete,
    HttpCode,
    UseGuards,
    Body
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';
import fse = require('fs-extra');
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('文件管理') 
@Controller('oss')
// @UseGuards(AuthGuard('jwt'))
export class OssController {
    constructor(
        private readonly ossService: OssService,
        private readonly config: ConfigService
    ) {}

    @Post('upload')
    @HttpCode(200)
    @ApiOperation({ summary: '文件上传，接收 multipart/form-data 的数据' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        console.log("🚀 ~ file: oss.controller.ts:37 ~ OssController ~ uploadFile ~ file:", file)
        const fileName = file.filename;
        // 获取文件名
        const fname = fileName.split('.')[0];
        // 获取文件拓展名
        const fext = fileName.split('.')[1];
        const location = this.config.get('upload.location')
        // 按照拓展名分类文件
        if (!fse.existsSync(`${location}/${fext}`)) {
            fse.mkdirsSync(`${location}/${fext}`);
        }
        const savePath = `${location}/${fext}/${fileName}`;
        // 根据文件名获取对应文件夹下的分片列表
        const chunkDir = file.destination;
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
        // create a new Express.Multer.File
        const saveFile = {
            filename: fileName,
            originalname: fileName,
            encoding: '',
            mimetype: '',
            buffer: fse.readFileSync(savePath),
            size: fse.statSync(savePath).size,
            path: savePath
        } as Express.Multer.File;
        return this.ossService.create([saveFile]);
    }

    @Post('upload/chunk')
    @HttpCode(200)
    @ApiOperation({ summary: '文件上传，接收 multipart/form-data 的数据' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadChunkFile(@UploadedFile() file) {
        return file;
    }

    @Post('upload/mult')
    @HttpCode(200)
    @ApiOperation({ summary: '文件上传，接收 multipart/form-data 的数据' })
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(@UploadedFiles() files) {
        return this.ossService.create(files);
    }

    @Get('list')
    @ApiOperation({ summary: '查询文件列表' })
    async findList(@Query() query) {
        return this.ossService.findList(
            query.limit || 10,
            query.page || 1,
            query.ossOldName || null
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除文件' })
    async deleteFile(@Param('id') id: number) {
        return this.ossService.delete(id);
    }

    @Post('merge')
    @ApiOperation({ summary: '分片文件合并' })
    async merge(@Body() data: any) {
        const fileName = data.fileName;
        // 获取文件名
        const fname = fileName.split('.')[0];
        // 获取文件拓展名
        const fext = fileName.split('.')[1];
        const location = this.config.get('upload.location')
        // 按照拓展名分类文件
        if (!fse.existsSync(`${location}/${fext}`)) {
            fse.mkdirsSync(`${location}/${fext}`);
        }
        // 拼接分片文件保存的路径
        const savePath = `${location}/${fext}/${fileName}`;
        // 根据文件名获取对应文件夹下的分片列表
        const chunkDir = `${location}/${fname}`;
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
        // create a new Express.Multer.File
        const file = {
            filename: fileName,
            originalname: fileName,
            encoding: '',
            mimetype: '',
            buffer: fse.readFileSync(savePath),
            size: fse.statSync(savePath).size,
            path: savePath
        } as Express.Multer.File;
        return this.ossService.create([file]);
    }
}
