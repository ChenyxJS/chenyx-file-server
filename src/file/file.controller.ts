/*
 * @Author: chenyx
 * @Date: 2023-05-06 16:00:46
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-11 10:29:18
 * @FilePath: /chenyx-file-server/src/file/file.controller.ts
 */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import fse = require('fs-extra');
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
@ApiTags('文件管理接口')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @ApiOperation({ summary: '查找全部用户', description: '创建文件记录' })
  create(@Body() createFileDto: CreateFileDto) {
    return this.fileService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }

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
