import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Put,
    UseGuards,
    Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JsonResult } from 'src/common/entities/JsonResult.entity';
import { JwtAuthGuard } from 'src/system/auth/auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('用户管理接口')
@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: '创建用户' })
    @ApiBody({ type: CreateUserDto, description: '用户DTO类' })
    @ApiResponse({ status: 201, type: JsonResult })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: '分页查找用户' })
    @ApiResponse({ status: 200, type: JsonResult })
    @Get('page')
    findPage(@Query() query: { page: 1; limit: 1 }) {
        return this.userService.findPage(query);
    }

    @ApiOperation({ summary: '查找所有用户' })
    @ApiResponse({ status: 200, type: JsonResult })
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: '根据id查找用户' })
    @ApiResponse({ status: 200, type: JsonResult })
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @ApiOperation({ summary: '根据id修改用户' })
    @ApiResponse({ status: 200, type: JsonResult })
    @Put(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: '根据id修改用户手机号' })
    @ApiResponse({ status: 200, type: JsonResult })
    @Patch(':id')
    updatePhone(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: '根据id删除用户' })
    @ApiResponse({ status: 200, type: JsonResult })
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}
