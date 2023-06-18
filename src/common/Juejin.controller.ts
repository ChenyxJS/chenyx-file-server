import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JsonResult } from './entities/JsonResult.entity';
import { JuejinUtils } from './utils/JuejinUtils';

@Controller('juejin')
@ApiTags('掘金热点接口')
export class JuejinController {
    constructor(private readonly juejinUtils: JuejinUtils) {}

    @Get('getJuejinData')
    @ApiOperation({ summary: '获取掘金前端热点信息' })
    async getJuejinData() {
        const jsonResult = new JsonResult();
        jsonResult.buildTureObject(await this.juejinUtils.getJuejinData())
        return jsonResult;
    }
}
