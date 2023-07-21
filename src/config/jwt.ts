/*
 * @Description:  
 * @version: 
 * @Author: 周凯
 * @Date: 2020-07-09 18:41:09
 * @LastEditors: 周凯
 * @LastEditTime: 2020-07-09 23:10:07
 */
import { registerAs } from '@nestjs/config'

export default registerAs('JWT', () => ({
  secretKey: process.env.JWT_SECRET_KEY || 'baishitong_kapok',
  expiresIn: process.env.JWT_EXPIRESIN || '24h'
}))
