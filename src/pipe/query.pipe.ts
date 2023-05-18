import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { UserQuery } from 'src/user/query/user.query';

export class QueryPipe implements PipeTransform {
    transform(value: UserQuery, metadata: ArgumentMetadata) {
        const userQuery = value;
        return userQuery;
    }
}
