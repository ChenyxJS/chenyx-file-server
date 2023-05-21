import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: '用户名', example: 'chenyx' })
    @IsNotEmpty({ message: '$property:用户名不能为空' })
    username: string;
    @ApiProperty({ description: '密码', example: '123456' })
    @IsNotEmpty({ message: '$property:密码不能为空' })
    password: string;
}
