import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JuejinUtils {
    constructor(private readonly httpService: HttpService) {}
    async getJuejinData() {
        const data = JSON.stringify({
            id_type: 2,
            sort_type: 200,
            cate_id: '6809637767543259144',
            cursor: '0',
            limit: 20
        });
        const config = {
            headers: {
                // authority: 'api.juejin.cn',
                // 'x-secsdk-csrf-token':
                    // '0001000000012bbdd230516ab66c95c9ef521a552dc569c69aa9ac535ec092bbd6e288dd64e21769cc1b5664db13',
                // Cookie: '__tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227143944531808896527%2522%252C%2522user_unique_id%2522%253A%25227143944531808896527%2522%252C%2522timestamp%2522%253A1663329214621%257D; _ga=GA1.2.592982355.1663329215; _tea_utm_cache_2608={%22utm_source%22:%22web10%22%2C%22utm_medium%22:%22feed%22%2C%22utm_campaign%22:%22yyplan04%22}; csrf_session_id=45fbef75667f20e30bb21fff0c10bd5c; msToken=LQFGQvnAN9mPP8C_olXjKX22xAE9IIpS-MjMw0WC4mLCJ28prOIm3bZg-ocBlp7fjqSB92WQCs2-FVgCm3TaOibwirzSF9uqF5w5QqGWGiA8BY7WtQv9lmTcHhktcHnF',
                // 'User-Agent': 'Apifox/1.0.0 (https://www.apifox.cn)',
                'content-type': 'application/json',
                // Accept: '*/*',
                // Host: 'api.juejin.cn',
                // Connection: 'keep-alive'
            }
        };
        const res = await firstValueFrom(
            this.httpService
                .post(
                    'https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed',
                    // `https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed?aid=2608&uuid=7143944531808896527&spider=0`,
                    data,
                    config
                )
                .pipe(map(response => response.data))
        );
        return res;
    }
}
