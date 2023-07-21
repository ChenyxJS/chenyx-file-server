import { PickType } from '@nestjs/swagger';
import { User } from 'src/system/user/user.entity';

export class RegiseterDto extends PickType(User, [
    'userName',
    'userEmail',
    'userPassword'
]) {}
