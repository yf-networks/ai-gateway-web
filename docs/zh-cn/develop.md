# 本文描述如何快速开发

## 目录结构说明

```
.
├── build.sh                // 打包脚本
├── configs                 // 开发和编译配置
│   ├── build.js
│   ├── config.js           // 本地开发时端口号设置
│   ├── dev-client.js
│   ├── devProxy.js         // 本地开发时API Server端口号设置
├── docs                    // 项目文档
│   ├── images              // 文档截图
│   └── zh-cn               // 中文文档
├── index.html
└── src
    ├── main.js
    ├── router              // 路由设置
    │   └── router.js
    ├── modules             // 业务模块
    │   ├── AIRouteRules    // 路由规则
    │   ├── APIKey          // API Key管理
    │   ├── AIClusters     // AI网关集群
    │   ├── AIInstancePool // AI网关实例池
    │   ├── Clusters        // AI业务集群
    │   ├── Domains         // 域名管理
    │   ├── Entity          // Entity管理
    │   ├── GslbConfigs     // 子集群负载
    │   ├── InstancePool    // AI业务实例池
    │   ├── Login           // 登录模块
    │   ├── Routes          // 默认转发规则
    │   ├── SubClusters     // 子集群管理
    │   └── User            // 用户管理
    ├── layout              // 布局逻辑
    │   ├── 404.vue
    │   ├── layout.vue
    │   └── sidebar
    ├── assets              // 静态资源
    │   ├── css
    │   ├── favicon.ico
    │   ├── font
    │   └── img
    ├── i18n                // 语言包
    │   ├── en.js
    │   └── zh.js
    ├── components          // 通用组件
    │   ├── CustomModal
    │   ├── Expression
    │   └── table
    └── utils               // 公共工具
```

## 二次开发步骤

二次开发步骤包括：

- 基础开发环境搭建：nodejs 开发环境搭建本文不展开描述
- 启动项目：修改 configs配置后执行 `npm run start` 即可启动项目
  - API Server 必须先启动
  - API Server 端口号配置在 configs/devProxy.js 的 `proxy.option.target`
  - 开发端口号配置在 configs/config.js 的 `dev.ports`
