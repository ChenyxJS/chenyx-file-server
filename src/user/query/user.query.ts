import { IPageQuery } from 'src/common/interface/PageQuery.interface';
import { User } from '../entities/user.entity';

export class UserQuery extends IPageQuery<User> {}
