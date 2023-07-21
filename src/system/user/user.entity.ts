import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserOpenId } from 'src/common/entities/UserOpenId.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    userId: number;

    @ApiProperty({ description: '用户名', example: 'chenyx' })
    @IsNotEmpty({ message: '$property:用户名不能为空' })
    @Column({ type: 'varchar', length: 255, nullable: true })
    userName: string;

    @ApiProperty({ description: '邮箱', example: '2412235462@qq.com' })
    @IsNotEmpty({ message: '用户名不能为空' })
    @IsEmail({}, { message: '用户名必须是邮箱' })
    @Column({ type: 'varchar', length: 255, nullable: true })
    userEmail: string;

    @ApiPropertyOptional({
        description: '头像',
        example: 'http://file.chenyx.site/1682096696584Chenyx.jpg'
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    userAvatar: string;

    @ApiPropertyOptional({
        description: '手机号',
        example: '18778925427'
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    userPhone: string;

    @ApiProperty({ description: '密码', example: '123456' })
    @Column({ type: 'varchar', length: 255, nullable: true })
    userPassword: string;

    @ApiPropertyOptional({ description: '创建时间' })
    @CreateDateColumn({ type: 'datetime' })
    userCreatedTime: Date;

    @ApiPropertyOptional({ description: '修改时间' })
    @UpdateDateColumn({ type: 'datetime' })
    userUpdatedTime: Date;

    @OneToMany(() => UserOpenId, userOpenId => userOpenId.usop.userId)
    openId: UserOpenId[];
}
