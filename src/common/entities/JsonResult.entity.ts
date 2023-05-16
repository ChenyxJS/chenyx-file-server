import { ApiProperty } from '@nestjs/swagger';
import { RequestEnum } from '../enum/RequestEnum.enum';

export class JsonResult<T> {
    @ApiProperty({ description: '请求是否成功', example: 'chenyx' })
    success: boolean;

    @ApiProperty({ description: '错误码', required: false, example: '10001' })
    tip: RequestEnum;

    @ApiProperty({
        description: '维护人员看到的错误原因',
        required: false,
        example: '维护人员看到的错误原因'
    })
    failReason: string;

    @ApiProperty({
        description: '客户显示的错误原因',
        required: false,
        example: '客户显示的错误原因'
    })
    failReasonShow: string;

    @ApiProperty({
        description: '集合类型',
        required: false,
        example: [
            { name: 1, age: 13 },
            { name: 2, age: 12 }
        ]
    })
    root: T[];

    @ApiProperty({
        description: '返回的记录总数',
        required: false,
        example: 2
    })
    totalSize: number;

    @ApiProperty({
        description: '对象类型',
        required: false,
        example: { name: 1, age: 12 }
    })
    object: T;

    buildTure() {
        this.success = true;
    }
    buildTureObject(object: T) {
        this.success = true;
        this.object = object;
    }

    buildTrueRoot(root: T[], totalSize: number) {
        this.success = true;
        this.root = root;
        this.totalSize = totalSize;
    }
}
