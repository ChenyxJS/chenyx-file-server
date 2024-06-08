import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    Entity
} from 'typeorm';
import { Exclude, Transform, TransformFnParams } from 'class-transformer';

@Entity('oss')
export class OssEntity {
    @PrimaryGeneratedColumn()
    public ossId: number;

    @Column({ type: 'varchar', comment: '图片等url链接' })
    public ossUrl: string;

    @Column({ type: 'varchar', length: 100, comment: '原文件名称' })
    public ossOldName: string;

    @Column({ type: 'int', comment: '文件大小 size' })
    public ossSize: number;

    @Column({ type: 'varchar', length: 100, comment: '文件 mimetype 类型' })
    public ossType: string;

    @Exclude({ toPlainOnly: true }) // 输出屏蔽
    @Column({
        type: 'varchar',
        length: 100,
        comment: '文件存放位置，暂存本地服务器，不采用云 oss'
    })
    public ossLocation: string;

    @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
    ossCreateDate: Date;
}


