import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidatePipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        //前台提交的表单数据没有类型，使用 plainToClass 转为有类型的对象用于验证
        const object = plainToInstance(metatype, value);

        //根据 DTO 中的装饰器进行验证
        const errors = await validate(object);
        if (errors.length) {
            throw new BadRequestException('表单数据错误');
        }
        return value;
    }
}
