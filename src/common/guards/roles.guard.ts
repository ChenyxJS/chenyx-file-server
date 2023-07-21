/*
 * @Description:
 * @version:
 * @Author: 周凯
 * @Date: 2020-07-09 18:41:09
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-07-19 16:54:37
 */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    // constructor(private readonly reflector: Reflector, @Inject('PermService') private readonly permSerivce: PermService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return true;
    }
}
