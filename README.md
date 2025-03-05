# Grok3 游乐场

### 作者：技术爬爬虾
[B站](https://space.bilibili.com/316183842)，[Youtube](https://www.youtube.com/@Tech_Shrimp)，抖音，公众号 全网同名。转载请注明作者。

视频教程：[https://www.bilibili.com/video/BV1Zc9vYqE5c/](https://www.bilibili.com/video/BV1Zc9vYqE5c/)

## 项目简介
#### Demo（服务器部署）: [https://grok.tech-shrimp.com/](https://grok.tech-shrimp.com/)
#### Demo（Deno部署）: [https://grok-play.deno.dev/](https://grok-play.deno.dev/)
#### Demo（Netlify部署）: [https://ubiquitous-lolly-397934.netlify.app/](https://ubiquitous-lolly-397934.netlify.app/)

10秒部署一个Grok3国内镜像网站，支持多账户聚合，单账户额度不够可秒换账号。
不限地区/网络环境，打开即用，适配手机端。
支持Netlify/Deno/Cloudflare Worker无服务器免费部署。
<b>建议用服务器部署，最近Grok加强了风控，使用IP干净的云服务部署最保险</b>
无服务器部署可能因为IP不干净被Cloudflare盾,（如果被盾，尝试刷新几次页面换个IP）

## 服务器部署[推荐]
0. 准备一台海外IP的云服务器，香港也可以
1. git clone https://github.com/tech-shrimp/grok-playground
2. (Ubuntu服务器需要先安装unzip:)<br> sudo apt-get install unzip -y
3. 安装Deno:<br> curl -fsSL https://deno.land/install.sh | sh （安装后需重启shell）
4. cd grok-playground
5. sh deno_start.sh
6. 默认使用服务器80端口，可以修改src/deno_index.ts改端口号
7. 使用Cloudflare配置网站DNS+HTTPS（也可以自己配置HTTPS）


## Netlify部署
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tech-shrimp/grok-playground)
点击部署按钮，登录Github账户即可
免费分配域名，国内可直连。

## Deno部署

1. [fork](https://github.com/tech-shrimp/grok-playground/fork)本项目
2. 登录/注册 https://dash.deno.com/
3. 创建项目 https://dash.deno.com/new_project
4. 选择此项目，填写项目名字（请仔细填写项目名字，关系到自动分配的域名）
5. Entrypoint 填写 `src/deno_index.ts` 其他字段留空 
   <details>
   <summary>如图</summary>
   ![image](/docs/images/1.png)
   </details>
6. 点击 <b>Deploy Project</b>
7. 部署成功后获得域名，点开即用。

## Cloudflare Worker 部署
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tech-shrimp/grok-playground)

1. 点击部署按钮
2. 登录Cloudflare账号
3. 填入Account ID，与API Token
4. Fork本项目，开启Github Action功能
5. 部署，打开dash.cloudflare.com，查看部署后的worker
6. 使用需要开魔法上网

## 打赏
#### 帮忙点点关注点点赞，谢谢啦~
B站：[https://space.bilibili.com/316183842](https://space.bilibili.com/316183842)<br>
Youtube: [https://www.youtube.com/@Tech_Shrimp](https://www.youtube.com/@Tech_Shrimp)

## 本地调试（Deno）

Windows 安装Deno:
> irm https://deno.land/install.ps1 | iex

Mac/Linux 安装Deno:
> curl -fsSL https://deno.land/install.sh | sh

启动项目：

>cd 项目目录 <br>
>deno run start


## 本地调试（Netlify）

1. 安装NodeJs
2. npm install -g netlify-cli
3. cd 项目根目录
4. netlify login
5. netlify dev

## API 使用方法

Grok Playground 现在支持 OpenAI 兼容的 API 格式，可以通过以下方式使用：

### 获取可用模型：

```bash
curl --location 'http://your.domain.com/v1/models' \
--header 'Authorization: Bearer YOUR-GROK-API-KEY'
```
