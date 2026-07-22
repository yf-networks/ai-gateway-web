<!-- eslint-disable -->
<template>
    <div class="forward-rule-upsert">
        <Form ref="formData" :model="formData" :rules="ruleValidate" label-position="top">
            <FormItem :label="$t('route.expression')" prop="expression">
                <Expression
                    :expression="formData.expression"
                    @expressionChanged="onExpressionChanged"
                />
            </FormItem>
            <FormItem :label="$t('route.targetCluster')" prop="cluster_name">
                <Select
                    v-if="clustersData"
                    v-model="formData.cluster_name"
                    :placeholder="$t('route.selectTargetCluster')"
                    class="cluster-select"
                >
                    <Option
                        v-for="item in clustersData"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                    />
                </Select>
            </FormItem>
            <FormItem :label="$t('com.desc')" prop="description">
                <Input v-model="formData.description" />
            </FormItem>
            <FormItem class="com-btn-box drawer-footer">
                <Button type="primary" size="small" @click="handleSubmit('formData')">
                    {{ $t('com.localSave') }}
                </Button>
                <Button size="small" class="reset-btn" @click="handleReset('formData')">
                    {{ $t('com.reset') }}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import Expression from '@/components/Expression';
import { cloneDeep } from 'lodash';

export default {
    name: 'ForwardRuleUpsert',
    components: { Expression },
    props: {
        isAdd: {
            type: Boolean,
            default: true
        },
        rulesData: {
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
        }
    },
    watch: {
        rulesData: {
            handler(data) {
                if (!this.isAdd && data) {
                    this.formData = cloneDeep(data);
                } else {
                    this.resetFormData();
                }
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        const validateExpression = (rule, value, callback) => {
            if (this.formData.errmsg) {
                callback(new Error(this.formData.errmsg));
                return;
            }
            if (!value) {
                callback(new Error(this.$t('com.tipEnterX', { obj: this.$t('route.expression') })));
                return;
            }
            callback();
        };
        return {
            formData: {
                name: '',
                description: '',
                cluster_name: '',
                expression: '',
                errmsg: ''
            },
            ruleValidate: {
                cluster_name: [
                    {
                        required: true,
                        message: this.$t('com.tipNotEmptyX', { obj: this.$t('route.targetCluster') }),
                        trigger: 'change'
                    }
                ],
                expression: [
                    {
                        required: true,
                        validator: validateExpression,
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    methods: {
        resetFormData() {
            this.formData = {
                name: '',
                description: '',
                cluster_name: '',
                expression: '',
                errmsg: ''
            };
        },
        onExpressionChanged(expressionData) {
            this.formData.expression = expressionData.expression;
            this.formData.errmsg = expressionData.errmsg;
            this.$refs.formData.validateField('expression');
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.$emit('submit', cloneDeep(this.formData));
                } else {
                    this.$Message.error({ content: this.$t('com.tipValidateError') });
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
            if (!this.isAdd) {
                this.formData = cloneDeep(this.rulesData);
            } else {
                this.resetFormData();
            }
        }
    }
};
</script>

<style lang="less" scoped>
.cluster-select {
    width: 100%;
}
</style>
