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
  <Form
    ref="formData"
    :model="formData"
    :rules="ruleValidate"
    label-position="top"
    @submit.native.prevent
  >
    <Card :title="$t('entity.basicInfo')" class="form-card">
      <FormItem :label="$t('entity.name')" prop="name">
        <Input
          v-model="formData.name"
          :disabled="!isAdd"
          :placeholder="$t('entity.namePlaceholder')"
          :maxlength="64"
          show-word-limit
        ></Input>
      </FormItem>

      <Row :gutter="24">
        <Col span="12">
          <FormItem :label="$t('entity.type')" prop="type">
            <Select
              v-model="formData.type"
              style="width: 100%;"
              :disabled="!isAdd"
            >
              <Option
                v-for="item in entityTypeList"
                :key="item.type_name"
                :value="item.type_name"
              >
                {{ item.type_name }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem :label="$t('entity.parentEntity')">
            <Select v-model="formData.parent_id" style="width: 100%;" clearable>
              <Option value="">{{ $t('entity.noParent') }}</Option>
              <Option
                v-for="item in parentEntityList"
                :key="item.id"
                :value="String(item.id)"
              >
                {{ item.name }}
              </Option>
            </Select>
            <p class="form-tip">
              {{ $t('entity.parentLevelTip') }}
            </p>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="24">
        <Col span="12">
          <FormItem :label="$t('entity.allowModels')">
            <Select
              v-model="formData.allow_models"
              style="width: 100%;"
              multiple
              :placeholder="$t('entity.selectAllowModels')"
              filterable
            >
              <Option value="*">{{ $t('entity.allModels') }}</Option>
              <Option v-for="model in allModels" :key="model" :value="model">
                {{ model }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem :label="$t('entity.blockModels')">
            <Select
              v-model="formData.block_models"
              style="width: 100%;"
              multiple
              :placeholder="$t('entity.selectBlockModels')"
              filterable
            >
              <Option value="*">{{ $t('entity.allModels') }}</Option>
              <Option v-for="model in allModels" :key="model" :value="model">
                {{ model }}
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Card>

    <Card :title="$t('entity.quotaInfo')" class="form-card">
      <Row :gutter="24">
        <Col span="12">
          <FormItem :label="$t('entity.unlimitedQuota')">
            <Select
              v-model="formData.quota_plan.unlimited"
              style="width: 100%;"
            >
              <Option value="true">{{ $t('entity.yes') }}</Option>
              <Option value="false">{{ $t('entity.no') }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <div v-if="formData.quota_plan.unlimited === 'false'">
        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('entity.passWhenNoQuota')">
              <Select
                v-model="formData.quota_plan.pass_when_no_enough_quota"
                style="width: 100%;"
              >
                <Option value="true">{{ $t('entity.yes') }}</Option>
                <Option value="false">{{ $t('entity.no') }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('entity.quotaTotal')" prop="quota_plan.quota">
              <InputNumber
                v-model="formData.quota_plan.quota"
                :min="0"
                style="width: 100%;"
              ></InputNumber>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('entity.quotaUnit')">
              <Select v-model="formData.quota_plan.unit" style="width: 100%;">
                <Option value="total_token">total_token</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('entity.resetPeriod')">
              <Select
                v-model="formData.quota_plan.reset_period"
                style="width: 100%;"
              >
                <Option value="never">{{ $t('entity.resetNever') }}</Option>
                <Option value="weekly">{{ $t('entity.resetWeekly') }}</Option>
                <Option value="monthly">{{ $t('entity.resetMonthly') }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>
    </Card>

    <!-- 限流配置 -->
    <Card :title="$t('entity.rateLimitConfig')" class="form-card">
      <Row :gutter="24">
        <Col span="12">
          <FormItem :label="$t('entity.enableRateLimit')">
            <Select
              v-model="formData.rate_limit_policy.enabled"
              style="width: 100%;"
            >
              <Option value="true">{{ $t('entity.yes') }}</Option>
              <Option value="false">{{ $t('entity.no') }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <div v-if="formData.rate_limit_policy.enabled === 'true'">
        <div class="rules-section">
          <h4 class="rules-title">{{ $t('entity.tpmRules') }}</h4>
          <div
            v-for="(rule, index) in formData.rate_limit_policy.rules.tpm"
            :key="'tpm-' + index"
            class="rule-row"
          >
            <Row :gutter="16">
              <Col span="4">
                <FormItem
                  :label="$t('entity.ruleName')"
                  :prop="'rate_limit_policy.rules.tpm.' + index + '.name'"
                  :rules="[{ required: true, validator: validateTpmRuleName, trigger: 'blur' }]"
                >
                  <Input v-model="rule.name"></Input>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem :label="$t('entity.applyModel')">
                  <Select
                    v-model="rule.model"
                    filterable
                    size="small"
                    style="width: 100%;"
                  >
                    <Option value="*">{{ $t('entity.allModels') }}</Option>
                    <Option
                      v-for="model in allModels"
                      :key="model"
                      :value="model"
                      >{{ model }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem :label="$t('entity.timeWindow')">
                  <InputNumber
                    v-model="rule.window_minutes"
                    :min="1"
                    :max="360"
                    style="width: 100%;"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem :label="$t('entity.maxTokens')">
                  <InputNumber
                    v-model="rule.max_tokens"
                    :min="1"
                    style="width: 100%;"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem :label="$t('entity.stepMinutes')">
                  <InputNumber
                    v-model="rule.step_minutes"
                    :min="1"
                    :max="rule.window_minutes"
                    style="width: 100%;"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="2">
                <FormItem :label="$t('com.operation')">
                  <Button
                    type="error"
                    size="small"
                    @click="removeTpmRule(index)"
                    >{{ $t('com.del') }}</Button
                  >
                </FormItem>
              </Col>
            </Row>
          </div>
          <Button
            type="primary"
            size="small"
            @click="addTpmRule"
            icon="md-add"
            >{{ $t('entity.addRule') }}</Button
          >
        </div>

        <div class="rules-section">
          <h4 class="rules-title">{{ $t('entity.rpmRules') }}</h4>
          <div
            v-for="(rule, index) in formData.rate_limit_policy.rules.rpm"
            :key="'rpm-' + index"
            class="rule-row"
          >
            <Row :gutter="16">
              <Col span="5">
                <FormItem
                  :label="$t('entity.ruleName')"
                  :prop="'rate_limit_policy.rules.rpm.' + index + '.name'"
                  :rules="[{ required: true, validator: validateRpmRuleName, trigger: 'blur' }]"
                >
                  <Input v-model="rule.name"></Input>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem :label="$t('entity.applyModel')">
                  <Select
                    v-model="rule.model"
                    filterable
                    size="small"
                    style="width: 100%;"
                  >
                    <Option value="*">{{ $t('entity.allModels') }}</Option>
                    <Option
                      v-for="model in allModels"
                      :key="model"
                      :value="model"
                      >{{ model }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem :label="$t('entity.timeWindow')">
                  <InputNumber
                    v-model="rule.window_minutes"
                    :min="1"
                    :max="360"
                    style="width: 100%;"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem :label="$t('entity.maxRequests')">
                  <InputNumber
                    v-model="rule.max_requests"
                    :min="1"
                    style="width: 100%;"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="2">
                <FormItem :label="$t('com.operation')">
                  <Button
                    type="error"
                    size="small"
                    @click="removeRpmRule(index)"
                    >{{ $t('com.del') }}</Button
                  >
                </FormItem>
              </Col>
            </Row>
          </div>
          <Button
            type="primary"
            size="small"
            class="mt20 mb20"
            @click="addRpmRule"
            icon="md-add"
            >{{ $t('entity.addRule') }}</Button
          >
        </div>

        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('entity.maxConcurrency')">
              <InputNumber
                v-model="formData.rate_limit_policy.rules.max_concurrency"
                :min="-1"
                style="width: 100%;"
              ></InputNumber>
              <p class="form-tip">{{ $t('entity.maxConcurrencyTip') }}</p>
            </FormItem>
          </Col>
        </Row>
      </div>
    </Card>

    <FormItem class="com-btn-box drawer-footer">
      <Button
        @click="$emit('cancel')"
        class="btn-box-del"
        >{{ $t('com.cancel') }}</Button
      >
      <Button
        type="primary"
        @click="handleSubmit('formData')"
        >{{ $t('com.submit') }}</Button
      >
    </FormItem>
  </Form>
</template>

<script>
import { cloneDeep } from 'lodash';

export default {
    props: {
        currentData: {
            type: Object,
            default() {
                return {};
            }
        },
        isAdd: {
            type: Boolean,
            default: false
        },
        entityList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        const that = this;

        // Validate name
        const validateName = (rule, value, callback) => {
            if (!value || value.trim() === '') {
                callback(new Error(this.$t('entity.enterName')));
                return;
            }
            callback();
        };

        // Validate type
        const validateType = (rule, value, callback) => {
            if (!value || value.trim() === '') {
                callback(new Error(this.$t('entity.selectType')));
                return;
            }
            callback();
        };

        // Validate quota (required when quota_plan.unlimited=false)
        const validateQuota = (rule, value, callback) => {
            if (that.formData.quota_plan.unlimited === 'false') {
                if (value === null || value === undefined || value === '') {
                    callback(new Error(this.$t('entity.enterQuotaTotal')));
                    return;
                }
                if (value < 0) {
                    callback(new Error(this.$t('entity.quotaRangeError')));
                    return;
                }
            }
            callback();
        };

        // Validate TPM rules
        const validateTpmRules = (rule, value, callback) => {
            if (that.formData.rate_limit_policy.enabled === 'false') {
                callback();
                return;
            }
            const tpm = that.formData.rate_limit_policy.rules.tpm || [];
            const names = new Set();
            for (let i = 0; i < tpm.length; i++) {
                const rule = tpm[i];
                if (!rule.name || rule.name.trim() === '') {
                    callback(new Error(this.$t('entity.tpmRuleNameRequired', { index: i + 1 })));
                    return;
                }
                if (names.has(rule.name)) {
                    callback(new Error(this.$t('entity.tpmRuleNameDuplicate', { name: rule.name })));
                    return;
                }
                names.add(rule.name);
                if (!rule.window_minutes || rule.window_minutes < 1 || rule.window_minutes > 360) {
                    callback(new Error(this.$t('entity.tpmWindowMinutesInvalid', { index: i + 1 })));
                    return;
                }
                if (!rule.max_tokens || rule.max_tokens < 1) {
                    callback(new Error(this.$t('entity.tpmMaxTokensRequired', { index: i + 1 })));
                    return;
                }
                if (rule.step_minutes && (rule.step_minutes < 1 || rule.step_minutes > 360)) {
                    callback(new Error(this.$t('entity.tpmStepMinutesRange', { index: i + 1 })));
                    return;
                }
                if (rule.step_minutes && rule.step_minutes > rule.window_minutes) {
                    callback(new Error(this.$t('entity.tpmStepMinutesInvalid', { index: i + 1 })));
                    return;
                }
            }
            callback();
        };

        // Validate RPM rules
        const validateRpmRules = (rule, value, callback) => {
            if (that.formData.rate_limit_policy.enabled === 'false') {
                callback();
                return;
            }
            const rpm = that.formData.rate_limit_policy.rules.rpm || [];
            const names = new Set();
            for (let i = 0; i < rpm.length; i++) {
                const rule = rpm[i];
                if (!rule.name || rule.name.trim() === '') {
                    callback(new Error(this.$t('entity.rpmRuleNameRequired', { index: i + 1 })));
                    return;
                }
                if (names.has(rule.name)) {
                    callback(new Error(this.$t('entity.rpmRuleNameDuplicate', { name: rule.name })));
                    return;
                }
                names.add(rule.name);
                if (!rule.window_minutes || rule.window_minutes < 1 || rule.window_minutes > 360) {
                    callback(new Error(this.$t('entity.rpmWindowMinutesInvalid', { index: i + 1 })));
                    return;
                }
                if (!rule.max_requests || rule.max_requests < 1) {
                    callback(new Error(this.$t('entity.rpmMaxRequestsRequired', { index: i + 1 })));
                    return;
                }
                if (rule.step_minutes && (rule.step_minutes < 1 || rule.step_minutes > 360)) {
                    callback(new Error(this.$t('entity.rpmStepMinutesRange', { index: i + 1 })));
                    return;
                }
                if (rule.step_minutes && rule.step_minutes > rule.window_minutes) {
                    callback(new Error(this.$t('entity.rpmStepMinutesInvalid', { index: i + 1 })));
                    return;
                }
            }
            callback();
        };

        // Validate rate limit policy (at least one rule required)
        const validateRateLimitPolicy = (rule, value, callback) => {
            if (that.formData.rate_limit_policy.enabled === 'true') {
                const tpm = that.formData.rate_limit_policy.rules.tpm || [];
                const rpm = that.formData.rate_limit_policy.rules.rpm || [];
                const maxConcurrency = that.formData.rate_limit_policy.rules.max_concurrency;
                if (tpm.length === 0 && rpm.length === 0 && maxConcurrency === -1) {
                    callback(new Error(this.$t('entity.rateLimitRuleRequired')));
                    return;
                }
            }
            callback();
        };

        return {
            entityTypeList: [],
            modelServices: [],
            formData: {
                name: '',
                type: '',
                parent_id: '',
                allow_models: ['*'],
                block_models: [],
                quota_plan: {
                    unlimited: 'true',
                    pass_when_no_enough_quota: 'false',
                    quota: 100000000,
                    unit: 'total_token',
                    reset_period: 'never'
                },
                rate_limit_policy: {
                    enabled: 'false',
                    rules: {
                        tpm: [],
                        rpm: [],
                        max_concurrency: -1
                    }
                }
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        validator: validateName,
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        validator: validateType,
                        trigger: 'change'
                    }
                ],
                'quota_plan.quota': [
                    {
                        validator: validateQuota,
                        trigger: 'blur'
                    }
                ],
                'rate_limit_policy.rules.tpm': [
                    {
                        validator: validateTpmRules,
                        trigger: 'blur'
                    }
                ],
                'rate_limit_policy.rules.rpm': [
                    {
                        validator: validateRpmRules,
                        trigger: 'blur'
                    }
                ],
                'rate_limit_policy.enabled': [
                    {
                        validator: validateRateLimitPolicy,
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    computed: {
        parentEntityList() {
            if (!this.formData.type) return [];
            const currentType = this.entityTypeList.find(
                t => t.type_name === this.formData.type
            );
            if (!currentType) return [];
            const currentLevel = currentType.level;
            return this.entityList.filter(entity => {
                if (entity.id === this.currentData.id) return false; // Cannot select self
                const entityType = this.entityTypeList.find(
                    t => t.type_name === entity.type
                );
                return entityType && entityType.level < currentLevel;
            });
        },
        allModels() {
            const models = [];
            for (const service of this.modelServices) {
                if (service.models && service.models.length > 0) {
                    models.push(...service.models);
                }
            }
            return models;
        }
    },
    watch: {
        currentData: {
            handler(data) {
                if (!this.isAdd && data && data.id) {
                    this.initFormData(data);
                }
            },
            deep: true,
            immediate: true
        },
        'formData.allow_models': {
            handler(val) {
                if (!val || val.length === 0) return;
                const hasStar = val.includes('*');
                const hasOthers = val.length > 1;
                if (hasStar && hasOthers) {
                    const lastIndex = val.length - 1;
                    if (val[lastIndex] === '*') {
                        this.formData.allow_models = ['*'];
                    } else {
                        this.formData.allow_models = val.filter(v => v !== '*');
                    }
                }
            },
            deep: true
        },
        'formData.block_models': {
            handler(val) {
                if (!val || val.length === 0) return;
                const hasStar = val.includes('*');
                const hasOthers = val.length > 1;
                if (hasStar && hasOthers) {
                    const lastIndex = val.length - 1;
                    if (val[lastIndex] === '*') {
                        this.formData.block_models = ['*'];
                    } else {
                        this.formData.block_models = val.filter(v => v !== '*');
                    }
                }
            },
            deep: true
        }
    },
    mounted() {
        this.fetchEntityTypeList();
        this.fetchModelServices();
    },
    methods: {
        initFormData(data) {
            this.formData = cloneDeep(data);

            // Convert parent_id to string (for Select component)
            if (this.formData.parent_id !== undefined && this.formData.parent_id !== null) {
                this.formData.parent_id = String(this.formData.parent_id);
            } else {
                this.formData.parent_id = '';
            }

            // Ensure quota_plan exists and convert boolean values to strings
            if (!this.formData.quota_plan) {
                this.formData.quota_plan = {
                    unlimited: 'true',
                    pass_when_no_enough_quota: 'false',
                    quota: 100000000,
                    unit: 'total_token',
                    reset_period: 'never'
                };
            } else {
                // Convert boolean values to strings
                this.formData.quota_plan.unlimited = String(this.formData.quota_plan.unlimited);
                this.formData.quota_plan.pass_when_no_enough_quota = String(this.formData.quota_plan.pass_when_no_enough_quota);
            }

            // Ensure rate_limit_policy exists and convert boolean values to strings
            if (!this.formData.rate_limit_policy) {
                this.formData.rate_limit_policy = {
                    enabled: 'false',
                    rules: {
                        tpm: [],
                        rpm: [],
                        max_concurrency: -1
                    }
                };
            } else {
                // Convert boolean values to strings
                this.formData.rate_limit_policy.enabled = String(this.formData.rate_limit_policy.enabled);
            }
            if (!this.formData.rate_limit_policy.rules) {
                this.formData.rate_limit_policy.rules = {
                    tpm: [],
                    rpm: [],
                    max_concurrency: -1
                };
            }

            // Ensure allow_models and block_models exist
            if (!this.formData.allow_models || this.formData.allow_models.length === 0) {
                this.formData.allow_models = ['*'];
            }
            if (!this.formData.block_models) {
                this.formData.block_models = [];
            }
        },

        fetchEntityTypeList() {
            this.$request({
                url: 'entity-types',
                method: 'get',
                openapi: true
            }).then(data => {
                if (data.status === 200) {
                    this.entityTypeList = data.data.Data.list || data.data.Data || [];
                }
            }).catch(() => {
                this.entityTypeList = [];
            });
        },

        fetchModelServices() {
            this.$request({
                url: 'models',
                method: 'get',
                openapi: true
            }).then(data => {
                if (data.status === 200) {
                    const services = data.data.Data.services || [];
                    this.modelServices = services;
                    // After model list loads, if in edit mode, reformat model fields to ensure proper display
                    if (!this.isAdd && this.formData && this.formData.id) {
                        this.normalizeModelFields();
                    }
                }
            }).catch(() => {
                this.modelServices = [];
            });
        },
        normalizeModelFields() {
            if (this.formData.allow_models && this.formData.allow_models.length > 0) {
                const models = [...this.formData.allow_models];
                if (models.includes('*')) {
                    this.formData.allow_models = ['*'];
                } else {
                    this.formData.allow_models = models;
                }
            }
            if (this.formData.block_models && this.formData.block_models.length > 0) {
                const models = [...this.formData.block_models];
                if (models.includes('*')) {
                    this.formData.block_models = ['*'];
                } else {
                    this.formData.block_models = models;
                }
            }
        },

        addTpmRule() {
            if (this.formData.rate_limit_policy.rules.tpm.length >= 3) {
                this.$Message.warning(this.$t('entity.maxRulesTip'));
                return;
            }
            this.formData.rate_limit_policy.rules.tpm.push({
                name: '',
                model: '*',
                window_minutes: 1,
                max_tokens: 10000,
                step_minutes: 1
            });
        },

        removeTpmRule(index) {
            this.formData.rate_limit_policy.rules.tpm.splice(index, 1);
        },

        addRpmRule() {
            if (this.formData.rate_limit_policy.rules.rpm.length >= 3) {
                this.$Message.warning(this.$t('entity.maxRulesTip'));
                return;
            }
            this.formData.rate_limit_policy.rules.rpm.push({
                name: '',
                model: '*',
                window_minutes: 1,
                max_requests: 100
            });
        },

        removeRpmRule(index) {
            this.formData.rate_limit_policy.rules.rpm.splice(index, 1);
        },

        validateTpmRuleName(rule, value, callback) {
            if (!value || value.trim() === '') {
                callback(new Error(this.$t('entity.ruleNameRequired')));
                return;
            }
            const tpm = this.formData.rate_limit_policy.rules.tpm || [];
            const count = tpm.filter(r => r.name === value.trim()).length;
            if (count > 1) {
                callback(new Error(this.$t('entity.ruleNameDuplicate', { name: value.trim() })));
                return;
            }
            callback();
        },

        validateRpmRuleName(rule, value, callback) {
            if (!value || value.trim() === '') {
                callback(new Error(this.$t('entity.ruleNameRequired')));
                return;
            }
            const rpm = this.formData.rate_limit_policy.rules.rpm || [];
            const count = rpm.filter(r => r.name === value.trim()).length;
            if (count > 1) {
                callback(new Error(this.$t('entity.ruleNameDuplicate', { name: value.trim() })));
                return;
            }
            callback();
        },

        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    const submitData = cloneDeep(this.formData);

                    submitData.quota_plan.unlimited = submitData.quota_plan.unlimited === 'true';
                    submitData.quota_plan.pass_when_no_enough_quota = submitData.quota_plan.pass_when_no_enough_quota === 'true';
                    submitData.rate_limit_policy.enabled = submitData.rate_limit_policy.enabled === 'true';

                    if (!submitData.rate_limit_policy.enabled) {
                        submitData.rate_limit_policy.rules = {
                            tpm: [],
                            rpm: [],
                            max_concurrency: -1
                        };
                    }

                    this.$emit('submit', submitData);
                } else {
                    this.$Message.error(this.$t('entity.formValidateError'));
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.form-card {
    margin-bottom: 16px;

    /deep/ .ivu-card-head {
        padding: 14px 20px;
        background: #f8f8f9;
        border-bottom: 1px solid #e8eaec;
    }

    /deep/ .ivu-card-body {
        padding: 20px;
    }
}

.rules-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed #e8eaec;
}

.rules-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #2d8cf0;
}

.rule-row {
    padding: 12px;
    background: #f8f8f9;
    border-radius: 4px;
}

.form-tip {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}

.btn-box-del {
    margin-right: 8px;
}

.com-btn-box {
    text-align: right;
    padding-top: 16px;
}

.mt20 {
    margin-top: 20px;
}

.mb20 {
    margin-bottom: 20px;
}
</style>
