import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from 'typeorm';
import { Platform } from '../enum/Platform.enum';

@Entity()
export class UserOpenId {
    @PrimaryGeneratedColumn('increment')
    usopId: number;

    @ApiProperty({ type: 'enum', description: '平台', example: Platform.WX_MP })
    @Column({ type: 'int', nullable: true })
    usopPlatform: number;

    @ApiProperty({ description: 'appId', example: 'wxcff54dc2887adqwe' })
    @Column({ type: 'varchar', length: 255, nullable: true })
    usopAppId: string;

    @ApiPropertyOptional({
        description: 'openId',
        example: 'wxcff54dc2887adqwe'
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    usopOpenId: string;

    @ApiPropertyOptional({ description: '创建时间' })
    @CreateDateColumn({ type: 'datetime' })
    usopCreatedTime: Date;

    @ApiPropertyOptional({ description: '修改时间' })
    @UpdateDateColumn({ type: 'datetime' })
    usopUpdatedTime: Date;

    @ApiProperty({ description: '用户ID', example: '12' })
    @ManyToOne(() => User, user => user.userId)
    usop: User;
}
