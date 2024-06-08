import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WxUtils } from './utils/WxUtils';
import { JsonResult } from './entities/JsonResult.entity';
import { RequestCodeEnum } from './enum/RequestCodeEnum.enum';
import { RequestMessageEnum } from './enum/RequestMessageEnum.enum';

@Controller('wx')
@ApiTags('微信接口')
export class WxLoginController {
    constructor(private readonly wxUtils: WxUtils) {}

    @Post('login')
    @ApiOperation({ summary: '微信登录', description: '微信授权登录' })
    @ApiBody({ type: 'string', required: true, description: '前端获取的code' })
    @ApiBearerAuth('jwt')
    async login(
        @Body() data: { code: string; userName?: string; userAvatar?: string }
    ) {
        const jsonResult = new JsonResult();
        const token = await this.wxUtils.genToken(
            data.code,
            data.userName,
            data.userAvatar
        );
        if (!!token) {
            jsonResult.buildTureObject({
                token
            });
        } else {
            jsonResult.buildFail(
                RequestCodeEnum.REQUEST_ERROR_LOGIN_INFO,
                RequestMessageEnum.REQUEST_ERROR_LOGIN_INFO,
                '未授权'
            );
        }
        return jsonResult;
    }
}
