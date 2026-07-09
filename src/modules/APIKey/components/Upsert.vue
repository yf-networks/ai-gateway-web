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
      ref="formData"
      :model="formData"
      :rules="ruleValidate"
      label-position="top"
      @submit.native.prevent
    >
      <Card :title="$t('apiKey.basicInfo')" class="form-card">
        <FormItem :label="$t('apiKey.description')" prop="description">
          <Input
            v-model="formData.description"
            :placeholder="$t('apiKey.descriptionPlaceholder')"
            :maxlength="256"
            show-word-limit
          ></Input>
        </FormItem>
        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('com.expiredDate')" prop="expired_time">
              <Checkbox v-model="neverExpire">{{ $t('apiForm.neverExpire') }}</Checkbox>
              <DatePicker
                v-if="!neverExpire"
                :placeholder="$t('apiForm.selectTime')"
                style="width: 210px; margin-left: 10px"
                v-model="formData.expired_time"
                type="date"
                :options="options"
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('apiKey.enabledStatus')">
              <Select
                v-model="formData.enabled"
                :key="'enabled-' + formRenderKey"
                style="width: 100%"
              >
                <Option value="true">{{ $t('com.enable') }}</Option>
                <Option value="false">{{ $t('com.deactivate') }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('apiKey.quotaCheck')">
              <Select v-model="formData.unlimited_quota" style="width: 100%">
                <Option value="false">{{ $t('apiKey.yes') }}</Option>
                <Option value="true">{{ $t('apiKey.no') }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('apiKey.allowedModels')">
              <Select
                v-model="formData.models"
                style="width: 100%"
                multiple
                :placeholder="$t('apiKey.selectModels')"
                filterable
              >
                <Option value="*">{{ $t('apiKey.allModels') }}</Option>
                <Option v-for="model in allModels" :key="model" :value="model">
                  {{ model }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('apiKey.allowedSubnet')" prop="subnet">
              <Input
                v-model="subnetInput"
                type="textarea"
                :rows="3"
                :placeholder="$t('apiKey.subnetPlaceholder')"
                @on-blur="validateSubnetRules"
              ></Input>
              <p class="form-tip">{{ $t('apiKey.subnetTip') }}</p>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('apiKey.mountedEntity')">
              <Select
                v-model="formData.entity_id"
                style="width: 100%"
                :placeholder="$t('apiKey.selectEntity')"
                filterable
              >
                <Option v-for="entity in entityList" :key="entity.id" :value="entity.id">
                  {{ entity.name }} ({{ entity.type }})
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Card>

      <Card :title="$t('apiKey.quotaInfo')" class="form-card">
        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('apiKey.unlimitedQuota')">
              <Select v-model="formData.quota_plan.unlimited" style="width: 100%">
                <Option value="true">{{ $t('apiKey.yes') }}</Option>
                <Option value="false">{{ $t('apiKey.no') }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <div v-if="formData.quota_plan.unlimited !== 'true'">
          <Row :gutter="24">
            <Col span="12">
              <FormItem :label="$t('apiKey.passWhenNoQuota')">
                <Select v-model="formData.quota_plan.pass_when_no_enough_quota" style="width: 100%">
                  <Option value="true">{{ $t('apiKey.yes') }}</Option>
                  <Option value="false">{{ $t('apiKey.no') }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem :label="$t('apiKey.quotaTotal')" prop="quota_plan.quota">
                <InputNumber
                  v-model="formData.quota_plan.quota"
                  :min="0"
                  style="width: 100%"
                ></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col span="12">
              <FormItem :label="$t('apiKey.quotaUnit')">
                <Select v-model="formData.quota_plan.unit" style="width: 100%">
                  <Option value="total_token">total_token</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem :label="$t('apiKey.resetPeriod')">
                <Select v-model="formData.quota_plan.reset_period" style="width: 100%">
                  <Option value="never">{{ $t('apiKey.resetNever') }}</Option>
                  <Option value="weekly">{{ $t('apiKey.resetWeekly') }}</Option>
                  <Option value="monthly">{{ $t('apiKey.resetMonthly') }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </div>
      </Card>

      <Card :title="$t('apiKey.rateLimitConfig')" class="form-card">
        <Row :gutter="24">
          <Col span="12">
            <FormItem :label="$t('apiKey.enableRateLimit')">
              <Select v-model="formData.rate_limit_policy.enabled" style="width: 100%">
                <Option value="true">{{ $t('apiKey.yes') }}</Option>
                <Option value="false">{{ $t('apiKey.no') }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <div v-if="formData.rate_limit_policy.enabled === 'true'">
          <div class="rules-section">
            <h4 class="rules-title">{{ $t('apiKey.tpmRules') }}</h4>
            <div
              v-for="(rule, index) in formData.rate_limit_policy.rules.tpm"
              :key="'tpm-' + index"
              class="rule-row"
            >
              <Row :gutter="16">
                <Col span="4">
                  <FormItem
                    :label="$t('apiKey.ruleName')"
                    :prop="'rate_limit_policy.rules.tpm.' + index + '.name'"
                    :rules="[{ required: true, validator: validateTpmRuleName, trigger: 'blur' }]"
                  >
                    <Input v-model="rule.name"></Input>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem :label="$t('apiKey.applyModel')">
                    <el-select v-model="rule.model" style="width: 100%" filterable size="small">
                      <el-option value="*" :label="$t('apiKey.allModels')" />
                      <el-option
                        v-for="model in allModels"
                        :key="model"
                        :value="model"
                        :label="model"
                      />
                    </el-select>
                  </FormItem>
                </Col>
                <Col span="3">
                  <FormItem :label="$t('apiKey.timeWindow')">
                    <InputNumber
                      v-model="rule.window_minutes"
                      :min="1"
                      :max="360"
                      style="width: 100%"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem :label="$t('apiKey.maxTokens')">
                    <InputNumber
                      v-model="rule.max_tokens"
                      :min="1"
                      style="width: 100%"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span="3">
                  <FormItem :label="$t('apiKey.stepMinutes')">
                    <InputNumber
                      v-model="rule.step_minutes"
                      :min="1"
                      :max="rule.window_minutes"
                      style="width: 100%"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span="2">
                  <FormItem :label="$t('com.operation')">
                    <Button type="error" size="small" @click="removeTpmRule(index)">{{
                      $t('com.del')
                    }}</Button>
                  </FormItem>
                </Col>
              </Row>
            </div>
            <Button type="primary" size="small" @click="addTpmRule" icon="md-add">{{
              $t('apiKey.addRule')
            }}</Button>
          </div>

          <div class="rules-section">
            <h4 class="rules-title">{{ $t('apiKey.rpmRules') }}</h4>
            <div
              v-for="(rule, index) in formData.rate_limit_policy.rules.rpm"
              :key="'rpm-' + index"
              class="rule-row"
            >
              <Row :gutter="16">
                <Col span="6">
                  <FormItem
                    :label="$t('apiKey.ruleName')"
                    :prop="'rate_limit_policy.rules.rpm.' + index + '.name'"
                    :rules="[{ required: true, validator: validateRpmRuleName, trigger: 'blur' }]"
                  >
                    <Input v-model="rule.name"></Input>
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem :label="$t('apiKey.applyModel')">
                    <el-select v-model="rule.model" style="width: 100%" size="small" filterable>
                      <el-option value="*" :label="$t('apiKey.allModels')" />
                      <el-option
                        v-for="model in allModels"
                        :key="model"
                        :value="model"
                        :label="model"
                      />
                    </el-select>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem :label="$t('apiKey.timeWindow')">
                    <InputNumber
                      v-model="rule.window_minutes"
                      :min="1"
                      :max="360"
                      style="width: 100%"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem :label="$t('apiKey.maxRequests')">
                    <InputNumber
                      v-model="rule.max_requests"
                      :min="1"
                      style="width: 100%"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span="2">
                  <FormItem :label="$t('com.operation')">
                    <Button type="error" size="small" @click="removeRpmRule(index)">{{
                      $t('com.del')
                    }}</Button>
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
              >{{ $t('apiKey.addRule') }}</Button
            >
          </div>

          <!-- 最大并发 -->
          <Row :gutter="24">
            <Col span="12">
              <FormItem :label="$t('apiKey.maxConcurrency')">
                <InputNumber
                  v-model="formData.rate_limit_policy.rules.max_concurrency"
                  :min="-1"
                  style="width: 100%"
                ></InputNumber>
                <p class="form-tip">{{ $t('apiKey.maxConcurrencyTip') }}</p>
              </FormItem>
            </Col>
          </Row>
        </div>
      </Card>

      <FormItem class="com-btn-box drawer-footer">
        <Button @click="$emit('cancel')" class="btn-box-del">
          {{ $t('com.cancel') }}
        </Button>
        <Button type="primary" @click="handleSubmit('formData')">
          {{ $t('com.submit') }}
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { isIpv4Cidr, isCidrEqual, isCidrContained } from '@/utils/const';

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
    }
  },
  data() {
    const that = this;

    // Validate description
    const validateDescription = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error(this.$t('apiForm.nameRequired')));
        return;
      }
      if (value.length > 1024) {
        callback(new Error(this.$t('apiKey.descriptionLengthError')));
        return;
      }
      callback();
    };

    // Validate expired time (required when never expire is not checked)
    const validateExpiredTime = (rule, value, callback) => {
      if (!that.neverExpire) {
        if (!value) {
          callback(new Error(this.$t('apiKey.selectExpiredTime')));
          return;
        }
      }
      callback();
    };

    // Validate quota (required when quota_plan.unlimited=false)
    const validateQuota = (rule, value, callback) => {
      if (that.formData.quota_plan.unlimited !== 'true') {
        if (value === null || value === undefined || value === '') {
          callback(new Error(this.$t('apiKey.quotaRequired')));
          return;
        }
        if (value < 0) {
          callback(new Error(this.$t('apiKey.quotaRangeError')));
          return;
        }
      }
      callback();
    };

    // Validate TPM rules
    const validateTpmRules = (rule, value, callback) => {
      if (that.formData.rate_limit_policy.enabled !== 'true') {
        callback();
        return;
      }
      const tpm = that.formData.rate_limit_policy.rules.tpm || [];
      const names = new Set();
      for (let i = 0; i < tpm.length; i++) {
        const rule = tpm[i];
        if (!rule.name || rule.name.trim() === '') {
          callback(new Error(this.$t('apiKey.ruleNameRequired', { index: i + 1 })));
          return;
        }
        if (names.has(rule.name)) {
          callback(new Error(this.$t('apiKey.ruleNameDuplicate', { name: rule.name })));
          return;
        }
        names.add(rule.name);
        if (!rule.window_minutes || rule.window_minutes < 1 || rule.window_minutes > 360) {
          callback(new Error(this.$t('apiKey.windowMinutesInvalid', { index: i + 1 })));
          return;
        }
        if (!rule.max_tokens || rule.max_tokens < 1) {
          callback(new Error(this.$t('apiKey.maxTokensInvalid', { index: i + 1 })));
          return;
        }
        if (rule.step_minutes && (rule.step_minutes < 1 || rule.step_minutes > 360)) {
          callback(new Error(this.$t('apiKey.stepMinutesRange', { index: i + 1 })));
          return;
        }
        if (rule.step_minutes && rule.step_minutes > rule.window_minutes) {
          callback(new Error(this.$t('apiKey.stepMinutesInvalid', { index: i + 1 })));
          return;
        }
      }
      callback();
    };

    // Validate RPM rules
    const validateRpmRules = (rule, value, callback) => {
      if (that.formData.rate_limit_policy.enabled !== 'true') {
        callback();
        return;
      }
      const rpm = that.formData.rate_limit_policy.rules.rpm || [];
      const names = new Set();
      for (let i = 0; i < rpm.length; i++) {
        const rule = rpm[i];
        if (!rule.name || rule.name.trim() === '') {
          callback(new Error(this.$t('apiKey.ruleNameRequired', { index: i + 1 })));
          return;
        }
        if (names.has(rule.name)) {
          callback(new Error(this.$t('apiKey.ruleNameDuplicate', { name: rule.name })));
          return;
        }
        names.add(rule.name);
        if (!rule.window_minutes || rule.window_minutes < 1 || rule.window_minutes > 360) {
          callback(new Error(this.$t('apiKey.windowMinutesInvalid', { index: i + 1 })));
          return;
        }
        if (!rule.max_requests || rule.max_requests < 1) {
          callback(new Error(this.$t('apiKey.maxRequestsInvalid', { index: i + 1 })));
          return;
        }
        if (rule.step_minutes && (rule.step_minutes < 1 || rule.step_minutes > 360)) {
          callback(new Error(this.$t('apiKey.stepMinutesRange', { index: i + 1 })));
          return;
        }
        if (rule.step_minutes && rule.step_minutes > rule.window_minutes) {
          callback(new Error(this.$t('apiKey.stepMinutesInvalid', { index: i + 1 })));
          return;
        }
      }
      callback();
    };

    // Validate subnet CIDR format
    const validateSubnet = (rule, value, callback) => {
      const subnets = value || [];
      if (subnets.length === 0) {
        callback(new Error(this.$t('apiKey.subnetRequired')));
        return;
      }
      if (subnets.includes('*') && subnets.length > 1) {
        callback(new Error(this.$t('apiKey.subnetCidrConflict')));
        return;
      }
      for (let i = 0; i < subnets.length; i++) {
        const cidr = subnets[i];
        if (cidr === '*') continue;
        if (!isIpv4Cidr(cidr)) {
          callback(new Error(this.$t('apiKey.subnetFormatError', { index: i + 1, cidr: cidr })));
          return;
        }
        for (let j = 0; j < subnets.length; j++) {
          if (i === j) continue;
          const otherCidr = subnets[j];
          if (otherCidr === '*') continue;
          if (isCidrEqual(cidr, otherCidr)) {
            callback(new Error(this.$t('apiKey.subnetDuplicate', { cidr: cidr })));
            return;
          }
          if (isCidrContained(cidr, otherCidr)) {
            callback(
              new Error(this.$t('apiKey.subnetContained', { cidr: cidr, parent: otherCidr }))
            );
            return;
          }
          if (isCidrContained(otherCidr, cidr)) {
            callback(new Error(this.$t('apiKey.subnetContains', { cidr: cidr, child: otherCidr })));
            return;
          }
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
          callback(new Error(this.$t('apiKey.rateLimitRuleRequired')));
          return;
        }
      }
      callback();
    };

    return {
      neverExpire: true,
      subnetInput: '*',
      formRenderKey: 0,
      unlimitedQuotaTop: 'true',
      formData: {
        description: '',
        enabled: 'true',
        expired_time: null,
        unlimited_quota: 'false',
        models: ['*'],
        subnet: ['*'],
        entity_id: null,
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
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      entityList: [],
      modelServices: [],
      ruleValidate: {
        description: [
          {
            required: true,
            validator: validateDescription,
            trigger: 'blur'
          }
        ],
        expired_time: [
          {
            validator: validateExpiredTime,
            trigger: 'change'
          }
        ],
        subnet: [
          {
            validator: validateSubnet,
            trigger: 'blur'
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
    subnetInput(newVal) {
      // Parse multi-line input to array, ignore empty lines
      if (newVal) {
        const subnets = newVal
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item !== '');
        this.formData.subnet = subnets.length > 0 ? subnets : ['*'];
      } else {
        this.formData.subnet = ['*'];
      }
    },
    'formData.models': {
      handler(val) {
        if (!val || val.length === 0) return;
        const hasStar = val.includes('*');
        const hasOthers = val.length > 1;
        if (hasStar && hasOthers) {
          const lastIndex = val.length - 1;
          if (val[lastIndex] === '*') {
            this.formData.models = ['*'];
          } else {
            this.formData.models = val.filter((v) => v !== '*');
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.fetchEntityList();
    this.fetchModelServices();
  },
  methods: {
    normalizeSelectBool(value, defaultValue = true) {
      if (value === true || value === 'true') return 'true';
      if (value === false || value === 'false') return 'false';
      return defaultValue ? 'true' : 'false';
    },
    initFormData(data) {
      this.formData = cloneDeep(data);

      // Convert top-level boolean values to strings (must be done before Select renders)
      this.formData.enabled = this.normalizeSelectBool(
        this.formData.enabled !== undefined ? this.formData.enabled : this.formData.enabled,
        true
      );
      this.formData.unlimited_quota = this.normalizeSelectBool(
        this.formData.unlimited_quota,
        false
      );
      this.formRenderKey += 1;

      // Handle expired time
      if (data.expired_time === -1 || data.expired_time === null) {
        this.neverExpire = true;
        this.formData.expired_time = null; // DatePicker requires null instead of -1
      } else {
        this.neverExpire = false;
        this.formData.expired_time = moment.unix(data.expired_time).format('YYYY-MM-DD HH:mm:ss');
      }

      // Handle subnet: convert array to multi-line text
      if (data.subnet && data.subnet.length > 0) {
        this.subnetInput = data.subnet.join('\n');
      } else {
        this.subnetInput = '*';
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
        this.formData.quota_plan.unlimited = this.normalizeSelectBool(
          this.formData.quota_plan.unlimited,
          true
        );
        this.formData.quota_plan.pass_when_no_enough_quota = this.normalizeSelectBool(
          this.formData.quota_plan.pass_when_no_enough_quota,
          false
        );
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
        this.formData.rate_limit_policy.enabled = this.normalizeSelectBool(
          this.formData.rate_limit_policy.enabled,
          false
        );
      }
      if (!this.formData.rate_limit_policy.rules) {
        this.formData.rate_limit_policy.rules = {
          tpm: [],
          rpm: [],
          max_concurrency: -1
        };
      }

      // Ensure models and subnet exist
      if (!this.formData.models || this.formData.models.length === 0) {
        this.formData.models = ['*'];
      }
      if (!this.formData.subnet || this.formData.subnet.length === 0) {
        this.formData.subnet = ['*'];
      }

      if (this.modelServices.length > 0) {
        this.normalizeModelsField();
      }
    },

    fetchEntityList() {
      this.$request({
        url: this.$urlFormat('entities'),
        method: 'get',
        openapi: true
      })
        .then((data) => {
          if (data.status === 200) {
            this.entityList = data.data.Data.list || data.data.Data || [];
          }
        })
        .catch(() => {
          // Use empty array if API fails
          this.entityList = [];
        });
    },

    fetchModelServices() {
      this.$request({
        url: this.$urlFormat('models'),
        method: 'get',
        openapi: true
      })
        .then((data) => {
          if (data.status === 200) {
            const services = data.data.Data.services || [];
            this.modelServices = services;
            // After model list loads, if in edit mode, reformat model fields to ensure proper display
            if (!this.isAdd && this.formData && this.formData.id) {
              this.normalizeModelsField();
            }
          }
        })
        .catch(() => {
          this.modelServices = [];
        });
    },
    normalizeModelsField() {
      if (this.formData.models && this.formData.models.length > 0) {
        const models = [...this.formData.models];
        if (models.includes('*')) {
          this.formData.models = ['*'];
        } else {
          this.formData.models = models;
        }
      }
    },

    addTpmRule() {
      if (this.formData.rate_limit_policy.rules.tpm.length >= 3) {
        this.$Message.warning(this.$t('apiKey.maxRulesTip'));
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
        this.$Message.warning(this.$t('apiKey.maxRulesTip'));
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
        callback(new Error(this.$t('apiKey.ruleNameRequired')));
        return;
      }
      const tpm = this.formData.rate_limit_policy.rules.tpm || [];
      const count = tpm.filter((r) => r.name === value.trim()).length;
      if (count > 1) {
        callback(new Error(this.$t('apiKey.ruleNameDuplicate', { name: value.trim() })));
        return;
      }
      callback();
    },

    validateRpmRuleName(rule, value, callback) {
      if (!value || value.trim() === '') {
        callback(new Error(this.$t('apiKey.ruleNameRequired')));
        return;
      }
      const rpm = this.formData.rate_limit_policy.rules.rpm || [];
      const count = rpm.filter((r) => r.name === value.trim()).length;
      if (count > 1) {
        callback(new Error(this.$t('apiKey.ruleNameDuplicate', { name: value.trim() })));
        return;
      }
      callback();
    },

    validateSubnetRules() {
      // Trigger form validation for subnet field
      if (this.$refs.formData) {
        this.$refs.formData.validateField('subnet');
      }
    },

    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const submitData = cloneDeep(this.formData);

          // Handle expired time
          if (this.neverExpire) {
            submitData.expired_time = -1;
          } else if (submitData.expired_time) {
            // DatePicker may return Date object or ISO string, convert to Unix timestamp
            submitData.expired_time = Math.floor(
              new Date(submitData.expired_time).getTime() / 1000
            );
          }

          // Convert string boolean values to actual boolean values
          submitData.enabled = submitData.enabled === 'true';
          submitData.unlimited_quota = submitData.unlimited_quota === 'true';
          submitData.quota_plan.unlimited = submitData.quota_plan.unlimited === 'true';
          submitData.quota_plan.pass_when_no_enough_quota =
            submitData.quota_plan.pass_when_no_enough_quota === 'true';
          submitData.rate_limit_policy.enabled = submitData.rate_limit_policy.enabled === 'true';

          // If rate limit policy is disabled, clear rules but keep structure
          if (!submitData.rate_limit_policy.enabled) {
            submitData.rate_limit_policy.rules = {
              tpm: [],
              rpm: [],
              max_concurrency: -1
            };
          }

          this.$emit('submit', submitData);
        } else {
          this.$Message.error(this.$t('com.tipValidateError'));
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
</style>
