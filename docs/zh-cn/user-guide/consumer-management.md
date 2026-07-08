# 消费者管理

消费者管理模块提供对API访问凭证和实体管理的功能，包括API Key管理和Entity管理。

## 功能概述

在左侧菜单的"消费者管理"分类下，可以访问以下功能：

- **API Key 管理**：管理API访问密钥，控制调用身份、模型访问范围、IP网段、Token配额与请求速率
- **Entity 管理**：组织和管理消费者实体单元，实现层级化的模型访问控制、配额与限流管理

## API Key 管理

API Key是访问AI网关API服务的身份凭证。通过API Key可以控制：

- **调用身份**：唯一标识API调用者
- **模型访问范围**：限制可访问的模型列表
- **IP网段**：限制允许访问的客户端IP范围
- **Token配额**：控制Token使用总量和重置周期
- **请求速率**：控制TPM（每分钟Token数）和RPM（每分钟请求数）

API Key可选挂载到一个Entity，挂载后将同时受Entity及其祖先链上的策略约束。

详细说明请参考 [API Key管理](consumer-management/api-key.md)。

## Entity 管理

Entity是用于组织和管理消费者的实体单元，可以是部门、团队、个人等组织单位。

**核心功能**：
- **Entity类型管理**：定义Entity的类型与层级（1-5级）
- **Entity组织管理**：创建和管理具体的Entity实例
- **层级策略继承**：挂载到Entity的API Key会同时受该Entity及其所有祖先Entity的策略约束
- **模型访问控制**：支持允许模型和禁止模型的黑白名单机制

详细说明请参考 [Entity管理](consumer-management/entity.md)。
