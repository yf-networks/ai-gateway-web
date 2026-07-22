/**
* Copyright(c) 2026 Beijing Yingfei Networks Technology Co.Ltd.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http: //www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Copyright (c) 2021 The BFE Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
<template>
    <div>
        <Form ref="formData" :model="formData" :rules="formRules" label-position="top">
            <FormItem
                :label="$t('instancePool.instanceMode')"
                prop="instanceMode"
                style="width: 100%;"
            >
                <Select
                    v-model="formData.instanceMode"
                    style="width: 240px;"
                    @on-change="handleInstanceModeChange"
                >
                    <Option value="ip">{{ $t('instancePool.modeIp') }}</Option>
                    <Option value="domain">{{ $t('instancePool.modeDomain') }}</Option>
                </Select>
            </FormItem>

            <FormItem
                v-if="formData.instanceMode === 'domain'"
                :label="$t('instancePool.domain')"
                prop="domainName"
                style="width: 100%;"
            >
                <Input
                    v-model="formData.domainName"
                    type="text"
                    :placeholder="$t('instancePool.domainPlaceholder')"
                    style="max-width: 480px;"
                    @on-blur="validateDomainField"
                />
            </FormItem>

            <FormItem
                v-else
                :label="$t('instancePool.list')"
                prop="instances"
                style="width: 100%;"
            >
                <div class="formBox">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <th>{{ $t('instancePool.machineName') }}</th>
                            <th>{{ $t('instancePool.ipAddress') }}</th>
                            <th>{{ $t('instancePool.port') }}</th>
                            <th>{{ $t('com.operation') }}</th>
                        </tr>
                        <tr v-for="(item, ind) in formData.instances" :key="ind">
                            <td>
                                <Input
                                    v-model="item.hostname"
                                    type="text"
                                    :placeholder="
                                        $t('com.tipEnterX', { obj: $t('instancePool.machineName') })
                                    "
                                />
                            </td>
                            <td>
                                <Input
                                    v-model="item.ip"
                                    type="text"
                                    :placeholder="
                                        $t('com.tipEnterX', { obj: $t('instancePool.ipAddress') })
                                    "
                                />
                            </td>
                            <td>
                                <div v-for="(info, index) in item.ports" :key="index">
                                    <Input
                                        value="Default"
                                        class="poolInput"
                                        type="text"
                                        :placeholder="$t('instancePool.portName')"
                                        style="width: 80px;"
                                        disabled
                                    />：
                                    <InputNumber
                                        v-model="item.ports.Default"
                                        :max="65535"
                                        :min="1"
                                        class="poolInput"
                                        :placeholder="$t('instancePool.portValue')"
                                        style="width: 80px;"
                                        @on-change="handleNumber(item.ports, 'Default')"
                                    ></InputNumber>
                                </div>
                            </td>
                            <td>
                                <Button
                                    size="small"
                                    type="error"
                                    :disabled="!deleteAble"
                                    @click="handleRemove(ind)"
                                >{{ $t('com.del') }}</Button>
                            </td>
                        </tr>
                    </table>
                </div>
                <Button plain size="small" type="primary" @click="handleAdd">
                    + {{ $t('com.create') }}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { isIP, isFQDN } from 'validator';

const DOMAIN_PORT = 443;

function createEmptyInstance() {
    return {
        hostname: '',
        ports: { Default: 80 },
        tags: { key: 'value' },
        ip: '',
        weight: 1
    };
}

function isDomainAddress(value) {
    const addr = String(value || '').trim();
    return addr && !isIP(addr, 4) && !isIP(addr, 6) && isFQDN(addr);
}

export function getDomainValidationError(value) {
    const domain = String(value || '').trim();
    if (!domain) {
        return 'empty';
    }
    if (isIP(domain, 4) || isIP(domain, 6)) {
        return 'invalid';
    }
    if (/^\d+$/.test(domain)) {
        return 'invalid';
    }
    if (!isFQDN(domain, { require_tld: true, allow_underscores: false })) {
        return 'invalid';
    }
    return null;
}

export function validateDomainName(value) {
    return getDomainValidationError(value) === null;
}

export function parseInstancePool(instancePool) {
    if (!instancePool) {
        return [];
    }
    let list = [];
    if (Array.isArray(instancePool)) {
        list = instancePool;
    } else if (Array.isArray(instancePool.instances)) {
        list = instancePool.instances;
    }
    return list.map(item => normalizeInstance(item));
}

export function detectInstanceMode(instances) {
    const list = (instances || []).map(item => normalizeInstance(item));
    if (list.length === 1) {
        const item = list[0];
        const ip = String(item.ip || '').trim();
        const hostname = String(item.hostname || '').trim();
        if (isDomainAddress(ip) || isDomainAddress(hostname)) {
            return {
                mode: 'domain',
                domain: isDomainAddress(hostname) ? hostname : ip
            };
        }
    }
    return {
        mode: 'ip',
        domain: ''
    };
}

export function normalizeInstance(instance) {
    const item = cloneDeep(instance || {});
    if (item.Name && !item.hostname) {
        item.hostname = item.Name;
    }
    if (item.Addr && !item.ip) {
        item.ip = item.Addr;
    }
    if (item.Hostname && !item.hostname) {
        item.hostname = item.Hostname;
    }
    if (item.Ports && typeof item.Ports === 'object') {
        item.ports = {
            Default: item.Ports.Default != null ? item.Ports.Default : item.Ports.default
        };
    }
    if (item.Port != null && (!item.ports || item.ports.Default == null)) {
        item.ports = { Default: item.Port };
    }
    if (!item.ports || typeof item.ports !== 'object') {
        item.ports = { Default: 80 };
    } else if (item.ports.Default == null || item.ports.Default === '') {
        item.ports.Default = item.ports.default != null ? item.ports.default : 80;
    }
    if (item.Weight != null && item.weight == null) {
        item.weight = item.Weight;
    }
    if (!item.tags) {
        item.tags = { key: 'value' };
    }
    if (item.weight == null) {
        item.weight = 1;
    }
    if (item.hostname == null) {
        item.hostname = '';
    }
    if (item.ip == null) {
        item.ip = '';
    }
    return item;
}

export function formatInstanceForApi(instance) {
    const item = normalizeInstance(instance);
    return {
        hostname: String(item.hostname || '').trim(),
        ip: String(item.ip || '').trim(),
        weight: item.weight != null ? parseInt(item.weight, 10) : 1,
        ports: {
            Default: parseInt(item.ports.Default, 10)
        },
        tags: item.tags || { key: 'value' }
    };
}

export function formatInstancePoolForApi(instances) {
    return (instances || []).map(item => formatInstanceForApi(item));
}

function buildDomainInstance(domain) {
    const value = String(domain || '').trim();
    return normalizeInstance({
        hostname: value,
        ip: value,
        ports: { Default: DOMAIN_PORT },
        tags: { key: 'value' },
        weight: 1
    });
}

export default {
    name: 'cluster-instance-pool',

    props: {
        instancePoolData: {
            type: Array,
            default() {
                return [];
            }
        },
        reportFlag: {
            type: Boolean
        }
    },

    watch: {
        instancePoolData: {
            handler(data) {
                this.applyInstancePoolData(data);
            },
            immediate: true,
            deep: true
        },
        reportFlag: {
            handler() {
                this.handleSubmit();
            }
        },
        'formData.instanceMode'() {
            this.$nextTick(() => {
                this.clearFormValidation();
            });
        }
    },

    computed: {
        formRules() {
            const rules = {
                instanceMode: [
                    {
                        required: true,
                        message: this.$t('com.tipNotEmptyX', { obj: this.$t('instancePool.instanceMode') }),
                        trigger: 'change'
                    }
                ]
            };
            if (this.formData.instanceMode === 'domain') {
                rules.domainName = [
                    {
                        required: true,
                        message: this.$t('instancePool.domainRequired'),
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            const error = getDomainValidationError(value);
                            if (error === 'invalid') {
                                callback(new Error(this.$t('instancePool.invalidDomain')));
                                return;
                            }
                            callback();
                        },
                        trigger: 'blur'
                    }
                ];
            } else {
                rules.instances = [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            this.validateInstancesRule(value, callback);
                        },
                        trigger: 'change'
                    }
                ];
            }
            return rules;
        }
    },

    data() {
        return {
            deleteAble: false,
            formData: {
                instanceMode: 'ip',
                domainName: '',
                instances: [createEmptyInstance()]
            }
        };
    },

    methods: {
        applyInstancePoolData(data) {
            const instances = parseInstancePool(data);
            const { mode, domain } = detectInstanceMode(instances);
            this.formData.instanceMode = mode;
            if (mode === 'domain') {
                this.formData.domainName = domain;
                this.formData.instances = [];
                this.deleteAble = false;
                return;
            }
            this.formData.domainName = '';
            if (instances.length > 0) {
                this.formData.instances = instances.map(item => normalizeInstance(item));
            } else {
                this.formData.instances = [createEmptyInstance()];
            }
            this.deleteAble = this.formData.instances.length > 1;
        },
        handleInstanceModeChange(mode) {
            if (mode === 'domain') {
                this.formData.domainName = '';
                this.formData.instances = [];
                this.deleteAble = false;
                return;
            }
            this.formData.domainName = '';
            if (!this.formData.instances || this.formData.instances.length === 0) {
                this.formData.instances = [createEmptyInstance()];
            }
            this.deleteAble = this.formData.instances.length > 1;
        },
        handleRemove(index) {
            if (this.formData.instances.length === 2) {
                this.deleteAble = false;
            }
            this.formData.instances.splice(index, 1);
            this.validateInstancesField();
        },
        handleAdd() {
            this.deleteAble = true;
            this.formData.instances.push(createEmptyInstance());
            this.validateInstancesField();
        },
        handleNumber(item, key) {
            this.$nextTick(() => {
                if (item[key] !== null) {
                    this.$set(item, key, parseInt(item[key], 10));
                }
            });
        },
        clearFormValidation() {
            if (this.$refs.formData) {
                this.$refs.formData.clearValidate();
            }
        },
        validateDomainField() {
            if (this.$refs.formData) {
                this.$refs.formData.validateField('domainName');
            }
        },
        validateInstancesField() {
            if (this.$refs.formData && this.formData.instanceMode === 'ip') {
                this.$refs.formData.validateField('instances');
            }
        },
        validateInstancesRule(value, callback) {
            const instances = value || [];
            if (!instances.length) {
                callback(new Error(this.$t('cluster.tipAtLeastoneInstance')));
                return;
            }

            const ipPortSet = new Set();
            for (const ele of instances) {
                const normalized = normalizeInstance(ele);

                if (!normalized.hostname) {
                    callback(new Error(this.$t('com.tipEnterX', {
                        obj: this.$t('instancePool.machineName')
                    })));
                    return;
                }
                if (!normalized.ip) {
                    callback(new Error(this.$t('com.tipEnterX', {
                        obj: this.$t('instancePool.ipAddress')
                    })));
                    return;
                }
                if (!isIP(normalized.ip, 4) && !isIP(normalized.ip, 6)) {
                    callback(new Error(this.$t('com.tipEnterX', {
                        obj: this.$t('instancePool.ipAddress')
                    })));
                    return;
                }

                const port = normalized.ports && normalized.ports.Default;
                if (port == null || port === '' || port < 1 || port > 65535) {
                    callback(new Error(this.$t('instancePool.tipPortRang')));
                    return;
                }

                const ipPort = `${String(normalized.ip).trim()}:${port}`;
                if (ipPortSet.has(ipPort)) {
                    callback(new Error(this.$t('instancePool.tipDuplicateIpPort', { ipPort })));
                    return;
                }
                ipPortSet.add(ipPort);
            }
            callback();
        },
        emitSubmitData(instances) {
            this.$emit('submitData', {
                topic: 'instancePoolData',
                data: instances.map(item => normalizeInstance(item))
            });
        },
        handleSubmit() {
            if (!this.$refs.formData) {
                return;
            }
            this.$refs.formData.validate(valid => {
                if (!valid) {
                    return;
                }
                if (this.formData.instanceMode === 'domain') {
                    const domain = String(this.formData.domainName || '').trim();
                    this.emitSubmitData([buildDomainInstance(domain)]);
                    return;
                }
                this.emitSubmitData(cloneDeep(this.formData.instances));
            });
        }
    }
};
</script>

<style lang="less" scoped>
.formBox {
    display: inline-block;
    width: 100%;
    table {
        margin: 10px 0;
        width: 100%;
        border-right: 1px solid #d9dbe3;
        border-bottom: 1px solid #d9dbe3;
        th {
            border-left: 1px solid #d9dbe3;
            border-top: 1px solid #d9dbe3;
        }
        td {
            padding: 5px 10px;
            border-left: 1px solid #d9dbe3;
            border-top: 1px solid #d9dbe3;
        }
    }
    .poolInput {
        width: 100px;
        display: inline-block;
    }
    .InputNumber {
        width: 100px;
    }
}
</style>
