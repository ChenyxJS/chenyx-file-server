import { ApiPropertyOptional } from '@nestjs/swagger';

export class IPageQuery<T> {
    @ApiPropertyOptional({ description: '要查询的页数', example: 1 })
    page: number;
    @ApiPropertyOptional({ description: '查询条数', example: 10 })
    limit: number;
    // @ApiPropertyOptional({
    //     description: '查询条件model',
    //     example: { name: 'chenyx', age: 19 }
    // })
    // model: T;
}
