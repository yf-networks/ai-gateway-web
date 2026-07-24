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
                style="width: 100%;"
            >
                <div class="formBox">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <th>{{ $t('instancePool.ipAddress') }}</th>
                            <th>{{ $t('instancePool.port') }}</th>
                            <th>{{ $t('com.operation') }}</th>
                        </tr>
                        <tr v-for="(item, ind) in formData.instances" :key="ind">
                            <td>
                                <FormItem
                                    :prop="'instances.' + ind + '.ip'"
                                    :rules="instanceIpRules"
                                    :show-message="false"
                                    class="table-cell-form-item"
                                >
                                    <Input
                                        v-model="item.ip"
                                        type="text"
                                        :placeholder="
                                            $t('com.tipEnterX', { obj: $t('instancePool.ipAddress') })
                                        "
                                        @on-change="onInstanceIpChange(item, ind)"
                                        @on-blur="validateInstanceRow(ind)"
                                    />
                                </FormItem>
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
                                    <FormItem
                                        :prop="'instances.' + ind + '.ports.Default'"
                                        :rules="instancePortRules"
                                        :show-message="false"
                                        class="table-cell-form-item table-cell-form-item-port"
                                    >
                                        <InputNumber
                                            v-model="item.ports.Default"
                                            :max="65535"
                                            :min="1"
                                            class="poolInput"
                                            :placeholder="$t('instancePool.portValue')"
                                            style="width: 80px;"
                                            @on-change="onInstancePortChange(item.ports, 'Default', ind)"
                                            @on-blur="validateInstanceRow(ind)"
                                        ></InputNumber>
                                    </FormItem>
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
                <div v-if="instanceErrorMessage" class="instance-error-tip">
                    {{ instanceErrorMessage }}
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

function getInstanceAddressCandidates(instance) {
    const item = instance || {};
    return [
        item.hostname,
        item.ip,
        item.Name,
        item.Addr,
        item.Hostname,
        item.name,
        item.addr
    ]
        .map(value => String(value || '').trim())
        .filter(Boolean);
}

export function parseInstancePool(instancePool) {
    if (!instancePool) {
        return [];
    }
    if (Array.isArray(instancePool)) {
        return instancePool.map(item => normalizeInstance(item));
    }
    if (typeof instancePool === 'object') {
        if (Array.isArray(instancePool.instances)) {
            return instancePool.instances.map(item => normalizeInstance(item));
        }
        if (
            instancePool.Name
            || instancePool.Addr
            || instancePool.hostname
            || instancePool.ip
            || instancePool.Hostname
        ) {
            return [normalizeInstance(instancePool)];
        }
    }
    return [];
}

function extractRawInstanceList(instancePool) {
    if (!instancePool) {
        return [];
    }
    if (Array.isArray(instancePool)) {
        return instancePool;
    }
    if (typeof instancePool === 'object') {
        if (Array.isArray(instancePool.instances)) {
            return instancePool.instances;
        }
        if (
            instancePool.Name
            || instancePool.Addr
            || instancePool.hostname
            || instancePool.ip
            || instancePool.Hostname
        ) {
            return [instancePool];
        }
    }
    return [];
}

export function getClusterInstancePool(cluster) {
    if (!cluster || typeof cluster !== 'object') {
        return [];
    }
    if (cluster.instance_pool != null) {
        return cluster.instance_pool;
    }
    const subClusters = cluster.sub_clusters;
    if (Array.isArray(subClusters) && subClusters.length === 1 && subClusters[0].instance_pool != null) {
        return subClusters[0].instance_pool;
    }
    return [];
}

export function detectInstanceMode(instances) {
    const list = instances || [];
    if (list.length !== 1) {
        return {
            mode: 'ip',
            domain: ''
        };
    }

    const domain = getInstanceAddressCandidates(list[0]).find(isDomainAddress);
    if (domain) {
        return {
            mode: 'domain',
            domain
        };
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

export function applyHostnameFromIp(instance) {
    const item = normalizeInstance(instance);
    const ip = String(item.ip || '').trim();
    item.hostname = ip;
    return item;
}

export function formatInstanceForApi(instance) {
    const item = normalizeInstance(instance);
    const addressCandidates = getInstanceAddressCandidates(item);
    const domain = addressCandidates.find(isDomainAddress);
    const ip = String(item.ip || item.Addr || '').trim();
    const hostname = domain || ip;
    const port = parseInt(item.ports.Default, 10);
    const weight = item.weight != null ? parseInt(item.weight, 10) : 1;

    return {
        Name: hostname,
        Addr: ip,
        hostname,
        ip,
        Port: port,
        weight: weight,
        Weight: weight,
        ports: {
            Default: port
        },
        Ports: {
            Default: port
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
        Name: value,
        Addr: value,
        hostname: value,
        ip: value,
        Port: DOMAIN_PORT,
        ports: { Default: DOMAIN_PORT },
        tags: { key: 'value' },
        weight: 1
    });
}

export default {
    name: 'cluster-instance-pool',

    props: {
        instancePoolData: {
            type: [Array, Object],
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
        'formData.instanceMode'(newVal, oldVal) {
            if (this.isApplyingPoolData || newVal === oldVal) {
                return;
            }
            if (newVal === 'domain') {
                this.formData.instances = [];
                this.deleteAble = false;
                return;
            }
            this.formData.domainName = '';
            if (!this.formData.instances || this.formData.instances.length === 0) {
                this.formData.instances = [createEmptyInstance()];
            }
            this.deleteAble = this.formData.instances.length > 1;
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
            }
            return rules;
        },
        instanceIpRules() {
            return [
                {
                    validator: (rule, value, callback) => {
                        this.validateInstanceIp(rule, value, callback);
                    },
                    trigger: 'blur'
                },
                {
                    validator: (rule, value, callback) => {
                        this.validateInstanceIp(rule, value, callback);
                    },
                    trigger: 'change'
                }
            ];
        },
        instancePortRules() {
            return [
                {
                    validator: (rule, value, callback) => {
                        this.validateInstancePort(rule, value, callback);
                    },
                    trigger: 'change'
                },
                {
                    validator: (rule, value, callback) => {
                        this.validateInstancePort(rule, value, callback);
                    },
                    trigger: 'blur'
                }
            ];
        }
    },

    data() {
        return {
            deleteAble: false,
            isApplyingPoolData: false,
            instanceErrorMessage: '',
            formData: {
                instanceMode: 'ip',
                domainName: '',
                instances: [createEmptyInstance()]
            }
        };
    },

    methods: {
        applyInstancePoolData(data) {
            this.isApplyingPoolData = true;
            const rawInstances = extractRawInstanceList(data);
            const instances = parseInstancePool(data);
            const { mode, domain } = detectInstanceMode(
                rawInstances.length ? rawInstances : instances
            );
            if (mode === 'domain') {
                this.formData.instanceMode = 'domain';
                this.formData.domainName = domain;
                this.formData.instances = [];
                this.deleteAble = false;
            } else {
                this.formData.instanceMode = 'ip';
                this.formData.domainName = '';
                if (instances.length > 0) {
                    this.formData.instances = instances.map(item => applyHostnameFromIp(item));
                } else {
                    this.formData.instances = [createEmptyInstance()];
                }
                this.deleteAble = this.formData.instances.length > 1;
            }
            this.$nextTick(() => {
                this.isApplyingPoolData = false;
                this.instanceErrorMessage = '';
            });
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
        getInstanceFieldIndex(fieldPath) {
            const match = String(fieldPath || '').match(/^instances\.(\d+)\./);
            return match ? parseInt(match[1], 10) : -1;
        },
        syncInstanceHostname(item) {
            applyHostnameFromIp(item);
        },
        onInstanceIpChange(item, index) {
            this.syncInstanceHostname(item);
            this.validateInstanceRow(index);
        },
        onInstancePortChange(item, key, index) {
            this.$nextTick(() => {
                if (item[key] !== null) {
                    this.$set(item, key, parseInt(item[key], 10));
                }
                this.validateInstanceRow(index);
            });
        },
        validateDomainField() {
            if (this.$refs.formData) {
                this.$refs.formData.validateField('domainName');
            }
        },
        validateInstancesField() {
            if (!this.$refs.formData || this.formData.instanceMode !== 'ip') {
                return;
            }
            if (!this.formData.instances.length) {
                this.instanceErrorMessage = this.$t('cluster.tipAtLeastoneInstance');
                return;
            }

            const props = [];
            this.formData.instances.forEach((_, index) => {
                props.push(`instances.${index}.ip`, `instances.${index}.ports.Default`);
            });

            let pending = props.length;
            props.forEach(prop => {
                this.$refs.formData.validateField(prop, () => {
                    pending -= 1;
                    if (pending === 0) {
                        this.updateInstanceErrorMessage();
                    }
                });
            });
        },
        validateInstanceRow() {
            this.validateInstancesField();
        },
        updateInstanceErrorMessage() {
            if (!this.$refs.formData || this.formData.instanceMode !== 'ip') {
                this.instanceErrorMessage = '';
                return;
            }
            if (!this.formData.instances.length) {
                this.instanceErrorMessage = this.$t('cluster.tipAtLeastoneInstance');
                return;
            }

            this.$nextTick(() => {
                const form = this.$refs.formData;
                if (!form || !form.fields) {
                    this.instanceErrorMessage = '';
                    return;
                }

                let firstError = '';
                form.fields.some(field => {
                    if (
                        field.validateState === 'error'
                        && field.validateMessage
                        && /^instances\.\d+\.(ip|ports\.Default)$/.test(field.prop)
                    ) {
                        firstError = field.validateMessage;
                        return true;
                    }
                    return false;
                });
                this.instanceErrorMessage = firstError;
            });
        },
        validateInstanceIp(rule, value, callback) {
            const index = this.getInstanceFieldIndex(rule.field);
            const ip = String(value || '').trim();

            if (!ip) {
                callback(new Error(this.$t('com.tipEnterX', {
                    obj: this.$t('instancePool.ipAddress')
                })));
                return;
            }
            if (!isIP(ip, 4) && !isIP(ip, 6)) {
                callback(new Error(this.$t('com.tipEnterX', {
                    obj: this.$t('instancePool.ipAddress')
                })));
                return;
            }

            const duplicateError = this.getDuplicateIpPortError(index);
            if (duplicateError) {
                callback(new Error(duplicateError));
                return;
            }
            callback();
        },
        validateInstancePort(rule, value, callback) {
            const index = this.getInstanceFieldIndex(rule.field);
            if (value == null || value === '' || value < 1 || value > 65535) {
                callback(new Error(this.$t('instancePool.tipPortRang')));
                return;
            }

            const duplicateError = this.getDuplicateIpPortError(index);
            if (duplicateError) {
                callback(new Error(duplicateError));
                return;
            }
            callback();
        },
        getDuplicateIpPortError(index) {
            if (index < 0) {
                return '';
            }
            const current = normalizeInstance(this.formData.instances[index]);
            const ip = String(current.ip || '').trim();
            const port = current.ports && current.ports.Default;
            if (!ip || port == null || port === '') {
                return '';
            }

            const ipPort = `${ip}:${port}`;
            const hasDuplicate = this.formData.instances.some((item, itemIndex) => {
                if (itemIndex === index) {
                    return false;
                }
                const other = normalizeInstance(item);
                const otherIp = String(other.ip || '').trim();
                const otherPort = other.ports && other.ports.Default;
                return otherIp && otherPort != null && `${otherIp}:${otherPort}` === ipPort;
            });
            if (!hasDuplicate) {
                return '';
            }
            return this.$t('instancePool.tipDuplicateIpPort', { ipPort });
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
                this.updateInstanceErrorMessage();
                if (!valid) {
                    return;
                }
                if (this.formData.instanceMode === 'domain') {
                    const domain = String(this.formData.domainName || '').trim();
                    this.emitSubmitData([buildDomainInstance(domain)]);
                    return;
                }
                this.emitSubmitData(
                    cloneDeep(this.formData.instances).map(item => applyHostnameFromIp(item))
                );
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

.table-cell-form-item {
    margin-bottom: 0;

    /deep/ .ivu-form-item-content {
        margin-left: 0 !important;
        line-height: normal;
    }
}

.table-cell-form-item-port {
    display: inline-block;
    vertical-align: middle;
}

.instance-error-tip {
    color: #ed4014;
    font-size: 12px;
    line-height: 1.5;
    margin: 4px 0 8px;
}
</style>
