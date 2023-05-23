FROM node:16.17.0
# 创建工作目录
RUN mkdir -p /nest
# 指定工作目录
WORKDIR /nest
# 复制当前文件到工作目录
COPY . ./
# npm 安装依赖
RUN npm install 
# 打包
RUN npm run build
# 启动服务
CMD npm run start:prod
# 暴露端口