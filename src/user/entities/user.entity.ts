import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({ description: '用户名', example: 'chenyx' })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({ description: '密码', example: '123456' })
    @Column({ type: 'varchar', length: 255 })
    password: string;

    @ApiProperty({ description: '邮箱', example: '2412235462@qq.com' })
    @Column({ type: 'varchar', length: 255 })
    email: string;

    @ApiProperty({ description: '手机号', example: '18778925427' })
    @Column({ type: 'varchar', length: 255 })
    phone: string;

    @ApiProperty({ description: '创建时间', required: false })
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @ApiProperty({ description: '修改时间', required: false })
    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}
