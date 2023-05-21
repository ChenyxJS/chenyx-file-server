import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class RegiseterDto extends PickType(User, [
    'userName',
    'userEmail',
    'userPassword'
]) {}
