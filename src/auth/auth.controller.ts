import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegiseterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JsonResult } from 'src/common/entities/JsonResult.entity';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import CurrentUser from './decorator/CurrentUser.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('登录授权接口')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    

    @ApiOperation({ summary: '注册',description:'邮箱/密码注册' })
    @ApiResponse({ status: 201, type: JsonResult<User> })
    @Post('register')
    register(@Body() regiseterDto: RegiseterDto) {
        return this.authService.register(regiseterDto);
    }

    @ApiOperation({ summary: '登录',description:'邮箱/密码登录' })
    @ApiResponse({ status: 201, type: JsonResult<User> })
    @ApiBearerAuth('jwt')
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: '获取登录用户信息',description:'从jwt中获取' })
    @ApiResponse({ status: 200, type: JsonResult<User> })
    @Get('loginUser')
    @UseGuards(AuthGuard('jwt'))
    getLoginUser(@CurrentUser() user) {
        const jsonResult = new   JsonResult()
        jsonResult.buildTureObject({...user})
        return jsonResult;
    }
}
