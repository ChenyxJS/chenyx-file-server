export default () => ({
    app: {
        name: 'chenxy.site',
        isDev: process.env.NODE_ENV == 'development',
        // jwt
        token_secret: process.env.TOKEN_SECRET,
        // 微信小程序
        app_id: process.env.APP_ID,
        app_secret: process.env.APP_SECRET
    }
});
