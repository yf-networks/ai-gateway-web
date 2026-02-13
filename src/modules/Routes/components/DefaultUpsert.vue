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
    <div class="defaultRules">
        <Form
            ref="formData"
            :model="formData"
            :rules="ruleValidate"
            :label-width="120"
            @submit.native.prevent
        >
            <FormItem :label="$t('route.actionLabel')" prop="action">
                <Select
                    v-model="formData.action"
                    style="width: 260px;"
                    transfer
                    @on-change="changeAction"
                >
                    <Option value="forward">{{ $t('route.forwardAction') }}</Option>
                </Select>
            </FormItem>
            <FormItem
                :label="$t('route.targetCluster')"
                prop="cluster_name"
                :rules="{
                    required: true,
                    message: $t('route.selectActionRequired'),
                    trigger: 'change'
                }"
            >
                <Select
                    v-if="clustersData"
                    v-model="formData.cluster_name"
                    :placeholder="$t('route.selectTargetCluster')"
                    clearable
                    filterable
                    style="width: 260px;"
                >
                    <Option
                        v-for="item in clustersData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem>
                <div class="card-header" style="height: 20px;">
                    <span>
                        <Button
                            class="btn"
                            type="primary"
                            :loading="saveLoading"
                            @click="submitData"
                            >{{ $t('com.submit') }}</Button
                        >
                    </span>
                </div>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash';
export default {
    data() {
        return {
            formData: {
                action: 'response',
                cluster_name: ''
            },
            saveLoading: false,
            ruleValidate: {
                action: [
                    {
                        required: true,
                        message: this.$t('route.selectActionRequired'),
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    props: {
        clustersData: {
            type: Array,
            default() {
                return [];
            }
        },
        defaultForm: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    watch: {
        defaultForm: {
            handler(data) {
                if (data) {
                    this.formData = cloneDeep(data);
                    if (data.action && !isEmpty(data.action)) {
                        const key = Object.keys(data.action)[0];
                        this.formData = {
                            ...data.action[key],
                            action: key
                        };
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        changeAction(val) {
            if (val == 'forward') {
                this.$set(this.formData, 'cluster_name', '');
            }
        },
        submitData() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.$emit('submit', this.formData);
                } else {
                    this.$Message.error(this.$t('com.tipValidateError'));
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.defaultRules {
    padding: 20px;
}
.add-button {
    margin-top: 10px;
}
.inline {
    margin-bottom: 20px;
}
.item {
    /deep/.ivu-form-item-label {
        width: 50px !important;
        text-align: left;
    }
}
.box {
    /deep/.ivu-form-item-label {
        float: none;
        display: inline-block;
        padding: 0 0 10px 0;
    }
}
</style>
