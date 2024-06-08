import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const CurrentUser = createParamDecorator(
    (_data: never, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest<Request>();
        return req.user;
    }
);

export default CurrentUser;
