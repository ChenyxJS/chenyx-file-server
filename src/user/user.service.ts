import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JsonResult } from 'src/common/entities/JsonResult.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly UserMapper: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto) {
        const jsonResult = new JsonResult<CreateUserDto>();
        await this.UserMapper.save(createUserDto).then(result => {
            jsonResult.buildTureObject(result);
        });
        return jsonResult;
    }

    async findAll() {
        const jsonResult = new JsonResult();
        const result = await this.UserMapper.findAndCount();
        jsonResult.buildTrueRoot(result[0], result[1]);
        return jsonResult;
    }

    async findOne(id: number) {
        const jsonResult = new JsonResult();
        const result = await this.UserMapper.findOneBy({ id });
        jsonResult.buildTureObject(result);
        return jsonResult;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const jsonResult = new JsonResult();
        const result = await this.UserMapper.update(id,updateUserDto);
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
