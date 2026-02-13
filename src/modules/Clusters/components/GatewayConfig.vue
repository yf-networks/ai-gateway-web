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
<template>
    <div>
        <Form
            label-position="top"
            ref="formData"
            :model="formData"
            :rules="ruleValidate"
            @submit.native.prevent
        >
            <div>
                <FormItem :label="$t('gatewayConfig.serviceName')" prop="service_name">
                    <Input v-model="formData.service_name" />
                </FormItem>
                <FormItem :label="$t('gatewayConfig.group')" prop="group">
                    <Input v-model="formData.group" />
                </FormItem>
                <FormItem :label="$t('gatewayConfig.modelServiceProvider')" prop="provider_type">
                    <Select v-model="formData.provider_type">
                        <Option v-for="item in providers" :value="item.id" :key="item.id">
                            {{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('gatewayConfig.modelListEndpoint')" prop="model_endpoint">
                    <div class="flex">
                        <Select class="item" v-model="formData.model_endpoint.schema">
                            <Option value="http">http</Option>
                            <Option value="https">https</Option>
                        </Select>
                        <Input class="item" v-model="ipStr" type="textarea" readonly :rows="4" />
                        <Input class="item" v-model="formData.model_endpoint.uri" />
                    </div>
                    <Button
                        type="primary"
                        style="margin-left: 14px; margin-bottom: 14px;"
                        @click="addHeader"
                        size="small"
                        >+{{ $t('com.createX', { obj: 'Header' }) }}</Button
                    >
                    <div class="header-controls">
                        <div v-for="(header, index) in headerList" :key="index" class="header-pair">
                            <Input
                                class="header-input"
                                v-model="header.key"
                                placeholder="Header Key"
                            />
                            <span class="header-separator">:</span>
                            <Input
                                class="header-input"
                                v-model="header.value"
                                placeholder="Header Value"
                            />
                            <Button type="error" @click="removeHeader(index)" size="small"
                                >-</Button
                            >
                        </div>
                    </div>
                </FormItem>
                <FormItem :label="$t('apiKey.models')" prop="models">
                    <el-select
                        v-model="formData.models"
                        style="width: 487px;"
                        multiple
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="item in modelsList"
                            :value="item.id"
                            :key="item.id"
                            :label="item.id"
                        >
                        </el-option>
                    </el-select>
                    <Button
                        type="primary"
                        :disabled="!ipStr || !formData.provider_type"
                        :loading="btnLoading"
                        @click="queryModels"
                        >{{ $t('gatewayConfig.get') }}
                    </Button>
                </FormItem>
                <FormItem :label="$t('gatewayConfig.modelRedirect')" prop="model_mappings">
                    <table>
                        <thead>
                            <tr>
                                <th>{{ $t('gatewayConfig.originalModelName') }}</th>
                                <th>{{ $t('gatewayConfig.backendModelName') }}</th>
                                <th>{{ $t('com.operation') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(model, index) in formData.model_mappings" :key="index">
                                <td>
                                    <Input
                                        :value="model.key"
                                        @on-change="e => changeMappingKey(index, e.target.value)"
                                        :placeholder="$t('gatewayConfig.enterOriginalModelName')"
                                    />
                                </td>
                                <td>
                                    <Select
                                        v-model="model.value"
                                        :placeholder="$t('gatewayConfig.selectTargetModel')"
                                        @on-change="value => changeMappingValue(index, value)"
                                    >
                                        <Option
                                            v-for="(item, idx) in formData.models"
                                            :value="item"
                                            :key="idx"
                                        >
                                            {{ item }}
                                        </Option>
                                    </Select>
                                </td>
                                <td>
                                    <Button
                                        type="error"
                                        size="small"
                                        @click="removeModelMapping(index)"
                                        >{{ $t('com.del') }}</Button
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Button class="mt20" size="small" type="primary" @click="addModelRedirect">{{
                        $t('gatewayConfig.add')
                    }}</Button>
                </FormItem>
                <FormItem :label="$t('gatewayConfig.serviceAuthKey')" prop="key">
                    <Input v-model="formData.key" />
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
import { cloneDeep, isEmpty } from 'lodash';
import { CommonNameCheck } from '@/utils/const';
export default {
    components: {},
    props: {
        subClustersData: {
            type: Array,
            default() {
                return [];
            }
        },
        subClusterProductList: {
            type: Array,
            default() {
                return [];
            }
        },
        reportFlag: {
            type: Boolean,
            default: false
        },
        llmConfigData: {
            type: Object,
            default() {
                return {};
            }
        },
        isAdd: {
            type: Boolean,
            default: false
        },
        stepsCurrentState: {
            type: Number,
            default: 0
        }
    },
    data() {
        const validServiceName = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('gatewayConfig.serviceNameRequired')));
                return;
            }

            if (!CommonNameCheck(value)) {
                callback(new Error(this.$t('gatewayConfig.formatInvalid')));
                return;
            }

            callback();
        };

        const validEndpoint = (rule, value, callback) => {
            if (!value.schema ) {
                callback(new Error(this.$t('gatewayConfig.schemaRequired')));
                return;
            }
            if (!value.uri) {
                callback(new Error(this.$t('gatewayConfig.uriRequired')));
                return;
            }

            if (!value.uri.startsWith('/')) {
                callback(new Error(this.$t('gatewayConfig.uriMustStartWithSlash')));
                return;
            }

            const uriPattern = /^[\/a-zA-Z0-9\-_\.~!$&'()*+,;=:@]*$/;
            if (!uriPattern.test(value.uri)) {
                callback(new Error(this.$t('gatewayConfig.uriContainsIllegalChars')));
                return;
            }

            if (value.uri.includes('//') && value.uri !== '//') {
                callback(new Error(this.$t('gatewayConfig.uriCannotConsecutiveSlash')));
                return;
            }

            if (value.uri.length > 1 && value.uri.endsWith('/')) {
                callback(new Error(this.$t('gatewayConfig.uriCannotEndWithSlash')));
                return;
            }

            callback();
        };

        const validKey = (rule, value, callback) => {
            if (value && (value.length < 20 || value.length > 200)) {
                callback(new Error(this.$t('gatewayConfig.formatInvalid')));
                return;
            }

            callback();
        };

        const validModelMappings = (rule, value, callback) => {
            if (!value || !Array.isArray(value) || value.length === 0) {
                callback();
                return;
            }

            const keys = value.map(item => item.key).filter(key => key !== '');

            const uniqueKeys = [...new Set(keys)];

            if (keys.length !== uniqueKeys.length) {
                callback(new Error(this.$t('gatewayConfig.duplicateModelName')));
                return;
            }

            callback();
        };
        return {
            ruleValidate: {
                service_name: [
                    {
                        required: true,
                        validator: validServiceName
                    }
                ],
                provider_type: [
                    {
                        required: true,
                        message: this.$t('com.tipSelectX', {
                            obj: this.$t('gatewayConfig.modelServiceProvider')
                        })
                    }
                ],
                model_endpoint: [
                    {
                        required: true,
                        validator: validEndpoint
                    }
                ],
                model_mappings: [
                    {
                        required: false,
                        validator: validModelMappings
                    }
                ],
                models: [
                    {
                        required: true,
                        message: this.$t('gatewayConfig.modelsRequired')
                    }
                ],
                key: [
                    {
                        required: false,
                        validator: validKey
                    }
                ]
            },
            selectData: [],
            ipStr: '',
            formData: {
                enable: true,
                service_name: '',
                group: 'default',
                provider_type: '',
                model_endpoint: {
                    schema: 'http',
                    uri: '/v1/models',
                    headers: {}
                },
                models: [],
                model_mappings: [
                    {
                        key: '',
                        value: ''
                    }
                ],
                key: ''
            },
            headerList: [],
            modelsList: [],
            providers: [],

            btnLoading: false
        };
    },
    watch: {
        subClustersData: {
            handler(v) {
                this.ipStr = '';

                const filteredClusters = this.subClusterProductList.filter(cluster =>
                    v.includes(cluster.name)
                );
                const ipPortList = [];
                filteredClusters.forEach(cluster => {
                    if (cluster.instances && Array.isArray(cluster.instances)) {
                        cluster.instances.forEach(instance => {
                            // 添加 ip:port 格式
                            ipPortList.push(`${instance.Addr}:${instance.Port}`);
                        });
                    }
                });

                const uniqueIpPortList = [...new Set(ipPortList)];

                this.ipStr = uniqueIpPortList.join('\n');
            },
            immediate: true
        },
        reportFlag: {
            handler(v) {
                this.handleSubmit('formData');
            }
        },
        llmConfigData: {
            handler(data) {
                if (!this.isAdd) {
                    if (!data || Object.keys(data).length === 0) {
                        this.formData = {
                            enable: true,
                            service_name: '',
                            group: 'default',
                            model_endpoint: {
                                schema: '',
                                uri: '/v1/models',
                                headers: {}
                            },
                            models: [],
                            model_mappings: [
                                {
                                    key: '',
                                    value: ''
                                }
                            ],
                            key: ''
                        };
                    }
                    if (data && !isEmpty(data)) {
                        this.formData = cloneDeep(data);
                        this.initHeaders();
                        if (!this.formData.model_endpoint) {
                            this.$set(this.formData, 'model_endpoint', {
                                schema: 'http',
                                uri: '/v1/models',
                                headers: {}
                            });
                        }

                        if (!this.formData.models) {
                            this.$set(this.formData, 'models', []);
                        }

                        if (!this.formData.model_mappings) {
                            this.$set(this.formData, 'model_mappings', [
                                {
                                    key: '',
                                    value: ''
                                }
                            ]);
                        }
                    }
                }
            },
            immediate: true,
            deep: true
        },
        stepsCurrentState: {
            handler(val) {
                const endpoint = this.formData && this.formData.model_endpoint;
                const hasEndpoint = endpoint && endpoint.schema && endpoint.uri;

                if (hasEndpoint && val === 4) {
                    this.getProviders();
                    if (this.formData.provider_type) {
                        this.getModels();
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        initHeaders() {
            if (this.formData.model_endpoint && this.formData.model_endpoint.headers) {
                this.headerList = Object.keys(this.formData.model_endpoint.headers).map(key => ({
                    key: key,
                    value: this.formData.model_endpoint.headers[key]
                }));
            } else {
                this.headerList = [];
            }
        },
        addHeader() {
            this.headerList.push({
                key: '',
                value: ''
            });
        },
        removeHeader(index) {
            this.headerList.splice(index, 1);
        },
        prepareHeadersForSubmit() {
            const headers = {};
            this.headerList.forEach(header => {
                if (header.key && header.key.trim() !== '') {
                    headers[header.key] = header.value;
                }
            });
            return headers;
        },
        addModelRedirect() {
            this.formData.model_mappings.push({
                key: '',
                value: ''
            });
        },

        removeModelMapping(index) {
            this.formData.model_mappings.splice(index, 1);

            this.$nextTick(() => {
                this.$refs.formData.validateField('model_mappings');
            });
        },

        changeMappingKey(index, newKey) {
            if (this.formData.model_mappings && this.formData.model_mappings[index]) {
                this.$set(this.formData.model_mappings[index], 'key', newKey);

                this.$nextTick(() => {
                    this.$refs.formData.validateField('model_mappings');
                });
            }
        },
        changeMappingValue(index, newValue) {
            if (this.formData.model_mappings && this.formData.model_mappings[index]) {
                this.$set(this.formData.model_mappings[index], 'value', newValue);
            }
        },
        queryModels() {
            this.getModels('query');
        },
        getModels(val) {
            const ipPort = this.ipStr.split('\n');
            this.modelsList = [];
            this.btnLoading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/models'),
                method: 'post',
                data: {
                    schema: this.formData.model_endpoint.schema,
                    uri: this.formData.model_endpoint.uri,
                    hosts: ipPort,
                    headers: this.prepareHeadersForSubmit(),
                    provider_type: this.formData.provider_type
                },
                openapi: true
            })
                .then(data => {
                    if (data.status === 200) {
                        this.modelsList = data.data.Data || [];
                        if (val) {
                            this.$Message.success({
                                content: this.$t('gatewayConfig.getModelListSucc')
                            });
                        }
                    }
                })
                .catch(error => {
                    console.error('获取模型列表异常:', error);
                    this.$Message.error('获取模型列表异常: ' + (error.message || '网络错误'));
                })
                .finally(() => {
                    this.btnLoading = false;
                });
        },
        getProviders() {
            this.$request({
                url: this.$urlFormat('products/{product_name}/model-providers'),
                method: 'get',
                openapi: true
            }).then(data => {
                if (data.status === 200) {
                    this.providers = data.data.Data || [];
                }
            });
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (!valid) {
                    this.$Message.error(this.$t('com.tipValidateError'));
                    return;
                }

                let tmpData = {};
                tmpData = cloneDeep(this.formData);

                tmpData.model_endpoint.headers = this.prepareHeadersForSubmit();
                if (tmpData.model_mappings && Array.isArray(tmpData.model_mappings)) {
                    tmpData.model_mappings = tmpData.model_mappings.filter(
                        item => item.key !== '' || item.value !== ''
                    );
                }

                this.$emit('submitData', {
                    topic: 'llmConfigData',
                    data: tmpData
                });
            });
        }
    }
};
</script>

<style lang="less" scoped>
.flex {
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
        flex: 1;
        margin-right: 10px;
    }
}

.header-controls {
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}

.header-pairs {
    margin-top: 10px;
}

.header-pair {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.header-input {
    flex: 1;
    margin: 0 5px;
}

.header-separator {
    margin: 0 5px;
    color: #666;
}

table {
    width: 100%;
    margin-top: 15px;
    font-size: 14px;
    @border-style:1px solid #e7e9f0;
    border-top: @border-style;
    border-left: @border-style;
    border-collapse: collapse;
    color: #000000a6;
    tbody {
        position: relative;
    }
    td,
    th {
        border-bottom: @border-style;
        border-right: @border-style;
        padding: 10px 20px;
        text-align: left;
        word-wrap: break-word;
        word-break: break-all;
        min-width: 130px;
    }
    th {
        background-color: #f8f8f9;
    }
    .table-title {
        font-weight: 500;
    }
    .spe_td {
        width: 400px;
        padding: 0px;
    }
}
</style>
