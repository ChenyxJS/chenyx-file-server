/*
 * @Description:
 * @version:
 * @Author: 周凯
 * @Date: 2020-07-09 18:41:09
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-07-01 12:21:06
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Logger } from '../utils/log.util'

/**
 * 捕捉所有异常
 */

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const logFormat = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Request original url: ${request.originalUrl}
      Method: ${request.method}
      IP: ${request.ip}
      Status code: ${status}
      Response: ${exception} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
      `
    Logger.error(logFormat)
    response.status(status).json({
      statusCode: status,
      msg: `Service Error: ${exception}`,
    })
  }
}
