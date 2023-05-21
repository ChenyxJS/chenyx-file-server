import { ApiProperty } from '@nestjs/swagger';

export class WxInfoQuery {
    @ApiProperty({ description: 'code', example: 'oR1fL4ose-a0KnCpNDR40j8zDasQ' })
    code: string;
    @ApiProperty({
        description: '用户openId',
        example: 'oR1fL4ose-a0KnCpNDR40j8zDasQ'
    })
    openId: string;
}
