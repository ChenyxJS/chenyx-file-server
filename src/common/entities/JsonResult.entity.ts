import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestCodeEnum } from '../enum/RequestCodeEnum.enum';
import { RequestMessageEnum } from '../enum/RequestMessageEnum.enum';
export class JsonResult<T> {
    @ApiProperty({ description: '请求是否成功', example: true })
    success: boolean;

    @ApiPropertyOptional({
        enum: RequestCodeEnum,
        description: '错误码',
        example: RequestCodeEnum.REQUEST_ERROR_NO_LOGIN
    })
    code: RequestCodeEnum;

    @ApiPropertyOptional({
        description: '返回的消息',
        example: '这是一个成功的消息！'
    })
    message: string;

    @ApiPropertyOptional({
        enum: RequestMessageEnum,
        description: '维护人员看到的错误原因',
        example: RequestMessageEnum.REQUEST_ERROR_NO_LOGIN
    })
    failReason: RequestMessageEnum;

    @ApiPropertyOptional({
        description: '列表类型',
    })
    data: T[];

    @ApiPropertyOptional({
        description: '返回的记录总数',
        example: 2
    })
    totalSize: number;

    @ApiPropertyOptional({
        description: '对象类型',
        example: { name: 1, age: 12 }
    })
    object: T;

    buildTure() {
        this.success = true;
        return this;
    }
    buildTureObject(object: T) {
        this.success = true;
        this.object = object;
        return this;
    }

    buildTrueList(data: T[], totalSize: number) {
        this.success = true;
        this.data = data;
        this.totalSize = totalSize;
        return this;
    }

    buildFail(
        code: RequestCodeEnum,
        failReason: RequestMessageEnum,
        message: string
    ) {
        this.success = false;
        this.message = message;
        this.code = code;
        this.failReason = failReason;
        return this;
    }
}
