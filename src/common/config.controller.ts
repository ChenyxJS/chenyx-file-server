import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JsonResult } from './entities/JsonResult.entity';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Controller('config')
@ApiTags('系统配置接口')
@UseGuards(AuthGuard('jwt'))
export class configController {
    constructor(private readonly config: ConfigService,) {}

    @Get()
    @ApiOperation({
        summary: '获取系统配置',

    })
    @ApiBearerAuth('jwt')
    async getConfig() {
        const jsonResult = new JsonResult();
        jsonResult.buildTureObject({
            appid: this.config.get('app.app_id'), // 管理员在微信公众平台获取
            secret: this.config.get('app.app_secret'), // 管理员在微信公众平台获取
        });
        return jsonResult;
    }
}
