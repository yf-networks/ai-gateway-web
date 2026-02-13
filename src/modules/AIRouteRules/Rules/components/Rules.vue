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
        <Form :label-width="120" ref="formData" :model="formData" @submit.native.prevent>
            <FormItem
                :label="$t('route.ruleName')"
                prop="name"
                :rules="{
                    required: true,
                    validator: validateName
                }"
            >
                <Input v-model="formData.name" :placeholder="$t('route.ruleNamePlaceholder')" />
            </FormItem>
            <FormItem
                :label="$t('route.domainRule')"
                prop="domain"
                :rules="{
                    required: false,
                    validator: validateDomain
                }"
            >
                <Input v-model="formData.domain" :placeholder="$t('route.domainPlaceholder')" />
            </FormItem>
            <FormItem
                :label="$t('route.pathMatch')"
                prop="path_filter"
                :rules="{
                    required: false,
                    validator: validatePathFilter
                }"
            >
                <div class="flex-box">
                    <Select
                        v-model="formData.path_filter.match_mode"
                        style="width: 120px;"
                        clearable
                    >
                        <Option value="exact_match">{{ $t('route.exactMatch') }}</Option>
                        <Option value="prefix_match">{{ $t('route.prefixMatch') }}</Option>
                        <Option value="suffix_match">{{ $t('route.suffixMatch') }}</Option>
                    </Select>
                    <Input
                        v-model="formData.path_filter.path"
                        :placeholder="$t('route.pathPlaceholder')"
                    />
                    <Checkbox v-model="formData.path_filter.ignore_case" style="width: 150px;">{{
                        $t('route.ignoreCase')
                    }}</Checkbox>
                </div>
            </FormItem>
            <FormItem :label="$t('route.method')" prop="method">
                <Select v-model="formData.method" class="select-width" clearable>
                    <Option v-for="item in methodsData" :value="item.value" :key="item.value">{{
                        item.label
                    }}</Option>
                </Select>
            </FormItem>
            <FormItem
                :label="$t('route.headerMatch')"
                prop="header_filters"
                :rules="{
                    required: false,
                    validator: validateHeaderFilters
                }"
            >
                <div>
                    <div
                        v-for="(header, index) in formData.header_filters"
                        :key="index"
                        class="flex-box"
                        style="margin-bottom: 10px;"
                    >
                        <Input
                            v-model="header.key"
                            :placeholder="$t('route.headerKeyPlaceholder')"
                            style="width: 150px;"
                        />
                        <Input
                            v-model="header.value"
                            :placeholder="$t('route.headerValuePlaceholder')"
                            style="width: 200px;"
                        />
                        <Select v-model="header.match_mode" style="width: 120px;" clearable>
                            <Option value="exact_match">{{ $t('route.exactMatch') }}</Option>
                            <Option value="prefix_match">{{ $t('route.prefixMatch') }}</Option>
                            <Option value="suffix_match">{{ $t('route.suffixMatch') }}</Option>
                        </Select>
                        <Button
                            type="error"
                            @click="removeHeader(index)"
                            v-if="formData.header_filters.length > 1"
                            >-</Button
                        >

                        <Checkbox v-model="header.ignore_case">{{
                            $t('route.ignoreCase')
                        }}</Checkbox>
                    </div>
                    <Button style="margin-top: 10px;" type="primary" @click="addHeader">+</Button>
                </div>
            </FormItem>
            <div class="model-match-header">
                <p class="model-match-label">{{ $t('route.modelMatch') }}</p>
                <Checkbox v-model="formData.model_filter.ignore_case" class="ignore-case-checkbox">
                    {{ $t('route.ignoreCase') }}
                </Checkbox>
            </div>
            <div style="padding-left: 60px;">
                <FormItem
                    :label="$t('route.jsonPath')"
                    prop="model_filter.pattern"
                    :rules="{
                        required: false,
                        validator: validateModelFilterPattern
                    }"
                >
                    <div class="flex-box">
                        <Input
                            v-model="formData.model_filter.pattern"
                            :placeholder="$t('route.jsonPathPlaceholder')"
                        />
                    </div>
                </FormItem>
                <FormItem :label="$t('route.modelName')" prop="model_filter.name">
                    <div class="flex-box">
                        <Input
                            v-model="formData.model_filter.name"
                            :placeholder="$t('route.modelNamePlaceholder')"
                            @on-change="changeModelFilterName"
                        />
                    </div>
                </FormItem>
            </div>
            <p style="line-height: 40px; color: #515a6e; padding-left: 55px;">
                <span style="color: red;">* </span>
                {{ $t('route.action') }}
            </p>
            <div>
                <FormItem
                    class="inline box"
                    prop="expect_action.action"
                    :rules="{
                        required: true,
                        message: $t('route.selectActionRequired')
                    }"
                >
                    <Select
                        v-model="formData.expect_action.action"
                        class="cluster_id_title"
                        style="width: 200px;"
                        :placeholder="$t('route.selectAction')"
                    >
                        <Option
                            v-for="item in actionsList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></Option>
                    </Select>
                </FormItem>
                <FormItem
                    v-if="formData.expect_action.action === 'forward'"
                    class="inline"
                    :label="$t('route.targetCluster')"
                    prop="expect_action.cluster_name"
                    :rules="{
                        required: true,
                        message: $t('route.selectClusterRequired'),
                        trigger: 'change'
                    }"
                >
                    <Select
                        v-model="formData.expect_action.cluster_name"
                        clearable
                        filterable
                        :placeholder="$t('route.selectTargetCluster')"
                        class="cluster_id_title"
                    >
                        <Option
                            v-for="item in clustersData"
                            :key="item.id"
                            :label="item.label || item.name"
                            :value="item.name"
                        ></Option>
                    </Select>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
import { CommonNameCheck } from '@/utils/const';
import { cloneDeep, isEmpty } from 'lodash';
import { isFQDN } from 'validator';
export default {
    props: {
        isAdd: {
            type: Boolean,
            default: true
        },
        basic: {
            type: Object,
            default() {
                return {};
            }
        },
        clustersData: {
            type: Array,
            default() {
                return [];
            }
        },
        tagList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    watch: {
        basic: {
            handler(val) {
                if (!this.isAdd) {
                    this.formData = cloneDeep(val);

                    if (!this.formData.path_filter) {
                        this.formData.path_filter = {
                            match_mode: '',
                            ignore_case: false,
                            path: ''
                        };
                    } else if (!this.formData.path_filter.hasOwnProperty('ignore_case')) {
                        this.formData.path_filter.ignore_case = false;
                    }

                    if (!this.formData.model_filter) {
                        this.formData.model_filter = {
                            pattern: '',
                            name: '',
                            ignore_case: false
                        };
                    } else if (!this.formData.model_filter.hasOwnProperty('ignore_case')) {
                        this.formData.model_filter.ignore_case = false;
                    }

                    if (
                        !this.formData.header_filters ||
                        this.formData.header_filters.length === 0
                    ) {
                        this.$set(this.formData, 'header_filters', []);
                    } else {
                        this.formData.header_filters.forEach(ele => {
                            if (!ele.hasOwnProperty('ignore_case')) {
                                this.$set(ele, 'ignore_case', false);
                            }
                        });
                    }

                    if (val.expect_action && !isEmpty(val.expect_action)) {
                        const key = Object.keys(val.expect_action)[0];
                        this.$set(this.formData, 'expect_action', {
                            action: key,
                            ...val.expect_action[key]
                        });
                    } else {
                        this.formData.expect_action = [];
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            formData: {
                name: '',
                domain: '',
                path_filter: {
                    match_mode: '',
                    ignore_case: false,
                    path: ''
                },
                method: '',
                header_filters: [],
                model_filter: {
                    pattern: '',
                    name: '',
                    ignore_case: false
                },
                expect_action: {
                    action: '',
                    cluster_name: ''
                }
            },
            methodsData: [
                { value: 'GET', label: 'GET' },
                { value: 'POST', label: 'POST' },
                { value: 'PATCH', label: 'PATCH' },
                { value: 'DELETE', label: 'DELETE' },
                { value: 'PUT', label: 'PUT' },
                { value: 'OPTIONS', label: 'OPTIONS' }
            ],
            model_ignore: false,
            path_ignore: false,
            header_ignore: false
        };
    },
    computed: {
        actionsList() {
            return [{ label: this.$t('route.forwardAction'), value: 'forward' }];
        }
    },
    methods: {
        addHeader() {
            this.formData.header_filters.push({
                key: '',
                value: '',
                match_mode: '',
                ignore_case: false
            });
        },
        removeHeader(index) {
            if (this.formData.header_filters.length > 1) {
                this.formData.header_filters.splice(index, 1);
            }
        },
        validateName(rule, value, callback) {
            if (!value) {
                callback(new Error(this.$t('com.tipEnterX', { obj: this.$t('route.ruleName') })));
                return;
            }

            if (!CommonNameCheck(value)) {
                callback(new Error(this.$t('com.tipNameRule')));
                return;
            }
            callback();
        },
        validateDomain(rule, value, callback) {
            if (!value) {
                callback();
                return;
            }

            if (!isFQDN(value)) {
                callback(new Error(this.$t('route.invalidDomain')));
                return;
            }

            callback();
        },

        validateHeaderFilters(rule, value, callback) {
            if (!Array.isArray(value)) {
                callback();
                return;
            }

            const isEmpty = function (str) {
                return (
                    str === undefined ||
                    str === null ||
                    (typeof str === 'string' && str.trim() === '')
                );
            };
            for (let i = 0; i < value.length; i++) {
                const item = value[i];

                const key = item && item.key;
                const val = item && item.value;
                const matchMode = item && item.match_mode;

                const isKeyEmpty = isEmpty(key);
                const isValEmpty = isEmpty(val);
                const isMatchModeEmpty = isEmpty(matchMode);

                const filledCount =
                    (!isKeyEmpty ? 1 : 0) + (!isValEmpty ? 1 : 0) + (!isMatchModeEmpty ? 1 : 0);

                if (filledCount > 0 && filledCount < 3) {
                    callback(new Error(this.$t('route.headerFillAllOrNone', { line: i + 1 })));
                    return;
                }
            }

            callback();
        },
        validateUrl(rule, value, callback) {
            if (!value) {
                callback(new Error(this.$t('com.tipNotEmptyX', { obj: 'URL' })));
                return;
            }

            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(value)) {
                callback(new Error(this.$t('com.tipFormatError')));
                return;
            }

            callback();
        },
        validateCode(rule, value, callback) {
            if (value == null) {
                callback(new Error(this.$t('com.tipNotEmptyX', { obj: this.$t('com.status') })));
                return;
            }

            if (value < 100 || value > 599) {
                callback(new Error(this.$t('com.tipRangeError', { min: 100, max: 599 })));
                return;
            }

            callback();
        },
        validateClusterName(rule, value, callback) {
            if (!value) {
                callback(
                    new Error(this.$t('com.tipSelectX', { obj: this.$t('route.targetCluster') }))
                );
                return;
            }

            const exists = this.clustersData.some(cluster => cluster.name === value);
            if (!exists) {
                callback(
                    new Error(this.$t('com.tipNotExist', { obj: this.$t('route.targetCluster') }))
                );
                return;
            }

            callback();
        },
        validatePathFilter(rule, value, callback) {
            const matchMode = value && value.match_mode;
            const path = value && value.path;

            const isEmpty = function (str) {
                return (
                    str === undefined ||
                    str === null ||
                    (typeof str === 'string' && str.trim() === '')
                );
            };

            const isMatchModeEmpty = isEmpty(matchMode);
            const isPathEmpty = isEmpty(path);

            if (isMatchModeEmpty !== isPathEmpty) {
                callback(new Error(this.$t('route.pathMatchModeConsistent')));
                return;
            }

            callback();
        },
        validateModelFilterPattern(rule, value, callback) {
            const name = this.formData.model_filter.name;

            const isEmpty = str =>
                str === undefined || str === null || (typeof str === 'string' && str.trim() === '');

            if (!isEmpty(name) && isEmpty(this.formData.model_filter.pattern)) {
                callback(new Error(this.$t('route.enterJsonPath')));
                return;
            }

            callback();
        },
        changeModelFilterName() {
            this.$refs.formData.validateField('model_filter.pattern');
        },
        validate() {
            return new Promise(resolve => {
                this.$refs['formData'].validate(valid => {
                    if (!valid) {
                        resolve({
                            valid: false
                        });
                        return;
                    }

                    const hasValidCondition = this.hasValidCondition();

                    if (!hasValidCondition) {
                        this.$Message.error(this.$t('route.atLeastOneCondition'));
                        resolve({
                            valid: false
                        });
                        return;
                    }

                    resolve({
                        valid: valid
                    });
                });
            });
        },
        hasValidCondition() {
            const formData = this.formData;

            if (formData.method && formData.method.trim() !== '') {
                return true;
            }

            if (
                formData.header_filters &&
                Array.isArray(formData.header_filters) &&
                formData.header_filters.length > 0 &&
                formData.header_filters.some(
                    header =>
                        header.key &&
                        header.key.trim() !== '' &&
                        header.value &&
                        header.value.trim() !== ''
                )
            ) {
                return true;
            }

            if (
                formData.model_filter &&
                ((formData.model_filter.pattern && formData.model_filter.pattern.trim() !== '') ||
                    (formData.model_filter.name && formData.model_filter.name.trim() !== ''))
            ) {
                return true;
            }

            if (
                (formData.path_filter &&
                    formData.path_filter.path &&
                    formData.path_filter.path.trim() !== '') ||
                (formData.path_filter.name && formData.path_filter.name.trim() !== '')
            ) {
                return true;
            }

            if (formData.domain && formData.domain.trim() !== '') {
                return true;
            }

            return false;
        },
        getFormData() {
            const result = cloneDeep(this.formData);

            if (
                !result.path_filter ||
                (result.path_filter.match_mode === '' && result.path_filter.path === '')
            ) {
                result.path_filter = {};
            }

            if (
                !result.header_filters ||
                result.header_filters.length === 0 ||
                result.header_filters.every(
                    h => h.key === '' && h.value === '' && h.match_mode === ''
                )
            ) {
                result.header_filters = [];
            }

            if (
                !result.model_filter ||
                (result.model_filter.pattern === '' && result.model_filter.name === '')
            ) {
                result.model_filter = {};
            }

            if (result.expect_action && result.expect_action.action) {
                const actionData = { ...result.expect_action };

                result.expect_action = {
                    forward: {
                        cluster_name: actionData.cluster_name
                    }
                };
            } else {
                result.expect_action = {};
            }

            return result;
        }
    }
};
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    gap: 10px;
    align-items: center;
}

.select-width {
    width: 200px;
}

.box {
    padding: 10px 0;
}

.model-match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
    padding-left: 40px;

    .model-match-label {
        color: #515a6e;
        margin: 0;
    }

    .ignore-case-checkbox {
        width: 150px;
        text-align: right;
    }
}
</style>
