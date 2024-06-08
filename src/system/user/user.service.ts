import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JsonResult } from 'src/common/entities/JsonResult.entity';
import { Logger } from 'src/common/utils/log.util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly UserMapper: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto) {
        const jsonResult = new JsonResult<CreateUserDto>();
        const result = await this.UserMapper.save(createUserDto);
        jsonResult.buildTureObject(result);
        return jsonResult;
    }

    async findPage(query: { page: number; limit: number }) {
        const jsonResult = new JsonResult();
        const result = await this.UserMapper.findAndCount({
            skip: (query.page - 1) * query.limit,
            take: query.limit
        });
        jsonResult.buildTrueList(result[0], result[1]);
        return jsonResult;
    }

    async findAll() {
        const jsonResult = new JsonResult();
        const result = await this.UserMapper.findAndCount();
        console.log("🚀 ~ file: user.service.ts:36 ~ UserService ~ findAll ~ result:", result)
        if (result) jsonResult.buildTrueList(result[0], result[1]);
        return jsonResult;
    }

    async findOne(id: number) {
        const jsonResult = new JsonResult();
        const result = await this.UserMapper.findOneBy({ userId: id });
        delete result.userPassword;
        jsonResult.buildTureObject(result);
        return jsonResult;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const jsonResult = new JsonResult();
        const result = await this.UserMapper.update(id, updateUserDto);
        jsonResult.buildTureObject(result);
        return jsonResult;
    }

    async remove(id: number) {
        const jsonResult = new JsonResult();
        const result = await this.UserMapper.delete(id);
        jsonResult.buildTureObject(result);
        return jsonResult;
    }
}
