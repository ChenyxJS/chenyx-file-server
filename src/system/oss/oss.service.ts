import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { OssEntity } from './oss.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOssDto } from './dto/create-oss.dto';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { JsonResult } from 'src/common/entities/JsonResult.entity';
import { RequestCodeEnum } from 'src/common/enum/RequestCodeEnum.enum';
import { RequestMessageEnum } from 'src/common/enum/RequestMessageEnum.enum';

@Injectable()
export class OssService {
    constructor(
        @InjectRepository(OssEntity)
        private readonly ossRepository: Repository<OssEntity>,
        private readonly config: ConfigService
    ) {}
    // 将上传文件的信息入库
    async create(files: Express.Multer.File[]) {
        const jsonResult = new JsonResult();
        const ossList = files.map((file: { originalname: string; filename: any; mimetype: any; path: any; size: any; }) => {
            // 重命名， multer 上传的文件没有后缀名，在这重命名加上后缀名
            const originalnameArr = file.originalname.split('.');
            const url = `${this.config.get('upload.www')}/${originalnameArr[originalnameArr.length - 1]}/${file.filename}`;
            return new CreateOssDto(
                url,
                file.mimetype,
                file.path,
                file.size,
                file.originalname
            );
        });
        const result = await this.ossRepository.save(ossList);
        if (!result) {
            return jsonResult.buildFail(
                RequestCodeEnum.REQUEST_ERROR_LOGIN_ACCOUNT_EMPTY,
                RequestMessageEnum.REQUEST_ERROR_LOGIN_ACCOUNT_EMPTY,
                '上传失败'
            );
        }
        const data = result.map((v: { ossUrl: any; }) => v.ossUrl);
        return jsonResult.buildTureObject(files.length > 1 ? data : data[0]);
    }

    // 删除文件并删除库
    async delete(id: number) {
        const jsonResult = new JsonResult();
        const file = await this.ossRepository.findOneBy({ ossId: id });
        console.log(file['ossLocation']);
        try {
            fs.unlinkSync(file['ossLocation']);
        } catch (error) {
            return { statusCode: 500, message: '删除失败' };
        }
        // 删除文件
        const result = await this.ossRepository.delete({ ossId: id });
        if (!result)
            return jsonResult.buildFail(
                RequestCodeEnum.REQUEST_ERROR_LOGIN_ACCOUNT_EMPTY,
                RequestMessageEnum.REQUEST_ERROR_LOGIN_ACCOUNT_EMPTY,
                '删除失败'
            );
        return jsonResult.buildTure();
    }

    async findList(pageSize: number, pageNum: number, ossOldName: string) {
        const jsonResult = new JsonResult();
        const where = ossOldName ? { ossOldName: Like(`%${ossOldName}%`) } : {};
        const files = await this.ossRepository
            .createQueryBuilder('oss')
            .where(where)
            .orderBy({
                'oss.ossId': 'DESC',
                'oss.ossCreateDate': 'DESC'
            })
            .skip(pageSize * (pageNum - 1))
            .take(pageSize)
            .getManyAndCount();
        return jsonResult.buildTrueList(files[0], files[1]);
    }
}
