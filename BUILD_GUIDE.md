# Build Guide (开发与编译)

## 前置条件

- Node.js / npm：用于本地开发与构建（版本要求以 `package.json#engines` 为准；如依赖安装有兼容性问题，建议使用较新的 Node LTS）。
- 后端依赖：AI Gateway API
  - 前端请求默认会走 `/open-api/v1/` 前缀（详见 `src/utils/request.js`）。

## 安装依赖

```bash
npm install
```

说明：仓库自带的一键脚本 `build.sh` 会使用淘宝镜像安装依赖（见下文）。

## 本地开发

### 1) 配置后端 API（开发代理）

修改 `configs/devProxy.js` 中的 `proxy.option.target` 指向你的 API Server，例如：

- `target: 'http://127.0.0.1:8183'`

开发服务器会将 `/open-api/v1` 相关请求转发到该 `target`。

### 2) 启动开发服务器

```bash
npm start
```

- 默认端口：`8083`（见 `configs/config.js` 的 `dev.port`），也可通过环境变量 `PORT` 覆盖。
- 启动后默认会打开：`http://localhost:<port>/?em`
  - `?em`：启用 mock 数据
  - 去掉 `?em`：关闭 mock 数据（以 `configs/dev-server.js` 的行为为准）

## 生产构建

### 方式一：本地构建

```bash
npm run build
```

构建产物默认输出到 `noahv/` 目录（由 `configs/config.js` 决定），典型结构：

- `noahv/index.html`
- `noahv/static/`

### 方式二：一键打包（用于发布）

```bash
sh build.sh
```

脚本行为摘要：

- 读取 `version.txt`，并把版本号写入 `index.html` 与 `src/main.js` 中的 `_VERSION_` 占位符
- 安装依赖并执行生产构建
- 将 `noahv/` 重命名后打包为 `output/ai-gateway-web_<version>.tar.gz`
- 生成 `*_checksums.txt`
- 同时会把 `docs/` 与 `README.md` 复制进构建产物目录（发布包内自带文档）

注意：`build.sh` 默认使用 `https://registry.npm.taobao.org` 安装依赖；如你的网络环境不适用，可改回官方 registry 或在命令行里显式指定。

## 测试与代码检查

```bash
npm test
npm run lint
```

## 更多文档

- 开发指南：`docs/zh-cn/develop.md`
- 部署指南：`docs/zh-cn/deploy.md`
