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
        <Form ref="formData" :model="formData" :rules="ruleValidate" label-position="top">
            <FormItem :label="$t('com.name')" prop="name">
                <Input
                    v-model="formData.name"
                    :placeholder="$t('com.tipEnterX', { obj: $t('com.name') })"
                >
                    <span slot="prepend">BFE-</span>
                </Input>
            </FormItem>
            <FormItem :label="$t('bfeClusters.clusterInstancePool')" prop="pool">
                <Select
                    v-model="formData.pool"
                    :placeholder="$t('com.tipSelectX', { obj: $t('instancePool.name') })"
                    style="width: 100%;"
                    filterable
                >
                    <Option
                        v-for="item in instancePoolList"
                        :key="item"
                        :value="item"
                        :label="item"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem class="com-btn-box drawer-footer">
                <Button type="primary" @click="handleSubmit('formData')"
                    >{{ $t('com.submit') }}
                </Button>
                <Button class="btnBox-btn" @click="handleReset('formData')"
                    >{{ $t('com.reset') }}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
    props: {
        instancePoolList: {
            type: Array,
            default() {
                return [];
            }
        },
        bfeClusterNames: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipEnterX', { obj: this.$t('cluster.BFE') })));
                return;
            }
            if (this.bfeClusterNames.indexOf('BFE-' + value) !== -1) {
                callback(
                    new Error(this.$t('com.tipAlreadyExistsX', { obj: this.$t('cluster.BFE') }))
                );
                return;
            }
            callback();
        };
        return {
            formData: {
                name: '',
                pool: ''
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        validator: validateName,
                        trigger: 'blur'
                    }
                ],
                pool: [
                    {
                        required: true,
                        message: this.$t('com.tipSelectX', { obj: this.$t('instancePool.name') }),
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    mounted() {
        this.handleReset('formData');
    },
    methods: {
        handleSubmit(name) {
            let tmpData = cloneDeep(this.formData);
            tmpData.name = `BFE-${this.formData.name}`;
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.$emit('submitForm', tmpData);
                } else {
                    this.$Message.error({
                        content: this.$t('com.tipValidateError')
                    });
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    }
};
</script>

<style lang="less" scoped></style>
