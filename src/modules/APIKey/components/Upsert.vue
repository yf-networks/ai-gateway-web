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
            <FormItem :label="$t('apiForm.nameLabel') + '：'" prop="name">
                <Input
                    v-if="isAdd"
                    v-model="formData.name"
                    :placeholder="$t('com.tipEnterX', { obj: $t('com.name') })"
                >
                </Input>
                <p class="pl30" v-else>{{ formData.name }}</p>
            </FormItem>
            <FormItem :label="$t('apiForm.enableStatus')" prop="enable">
                <RadioGroup v-model="formData.enable">
                    <Radio label="true">{{ $t('com.enable') }}</Radio>
                    <Radio label="false">{{ $t('apiForm.notEnable') }}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="Key" prop="key">
                <div v-if="isAdd">
                    <Input
                        style="width: 95%;"
                        v-model="formData.key"
                        :placeholder="$t('apiForm.keyPlaceholder')"
                    ></Input
                    ><Icon class="refresh" type="md-sync" @click="getKey" />
                </div>

                <p class="pl30" v-else>{{ formData.key }}</p>
            </FormItem>
            <FormItem :label="$t('apiKey.isLimit')" prop="is_limit">
                <Select v-model="formData.is_limit" style="width: 300px;">
                    <Option value="true">{{ $t('apiKey.yes') }}</Option>
                    <Option value="false">{{ $t('apiKey.no') }}</Option>
                </Select>
            </FormItem>
            <FormItem
                v-if="formData.is_limit === 'true'"
                :label="$t('apiForm.quota')"
                prop="total_quota"
            >
                <InputNumber
                    v-model="formData.total_quota"
                    :precision="0"
                    :min="0"
                    :max="100000000"
                ></InputNumber>
                {{ $t('apiForm.quotaRange') }}
            </FormItem>
            <FormItem :label="$t('cert.expiredDate')" prop="expired_time">
                <DatePicker
                    :placeholder="$t('apiForm.selectTime')"
                    style="width: 432px;"
                    v-model="formData.expired_time"
                    type="datetime"
                    :options="options"
                />
                <Button @click="setTime('')">{{ $t('apiForm.neverExpire') }}</Button>
                <Button @click="setTime('1m')">{{ $t('apiForm.oneMonthLater') }}</Button>
                <Button @click="setTime('1d')">{{ $t('apiForm.oneDayLater') }}</Button>
                <Button @click="setTime('1h')">{{ $t('apiForm.oneHourLater') }}</Button>
            </FormItem>
            <FormItem :label="$t('apiKey.models')" prop="allowed_models">
                <Checkbox :disabled="!isAdd" v-model="modelEnable">{{ $t('com.enable') }}</Checkbox>
                <div v-show="modelEnable">
                    <el-select
                        v-model="formData.allowed_models"
                        :disabled="!isAdd"
                        popper-class="custom-select-dropdown"
                        :popper-append-to-body="false"
                        multiple
                        filterable
                    >
                        <el-option
                            v-for="item in modelList"
                            :value="item"
                            :key="item"
                            :label="item"
                        >
                        </el-option>
                    </el-select>
                    <span v-if="isAdd">
                        <Button type="primary" size="small" class="ml12" @click="selectAll"
                            >{{ $t('apiForm.selectAll') }}
                        </Button>
                        <Button type="primary" size="small" class="ml12" @click="clearnAll"
                            >{{ $t('apiForm.clearAll') }}
                        </Button>
                        <Button type="primary" size="small" class="ml12" @click="manuallyAddModel"
                            >{{ $t('apiForm.manualAddModel') }}
                        </Button>
                    </span>
                </div>
            </FormItem>
            <FormItem :label="$t('apiForm.sourceAddressCheck')" prop="allowed_subnets">
                <Checkbox v-model="subnetEnable">{{ $t('com.enable') }}</Checkbox>
                <Input
                    v-if="subnetEnable"
                    v-model="formData.allowed_subnets"
                    type="textarea"
                    :rows="8"
                    :placeholder="$t('apiForm.subnetPlaceholder')"
                />
            </FormItem>
            <FormItem class="com-btn-box drawer-footer">
                <Button @click="$emit('cancel')" class="btn-box-del">
                    {{ $t('com.cancel') }}
                </Button>
                <Button type="primary" @click="handleSubmit('formData')">
                    {{ $t('com.submit') }}
                </Button>
            </FormItem>
        </Form>

        <Modal v-model="customModel" :title="$t('apiForm.addModel')">
            <div style="word-break: break-all; padding: 20px 0;">
                <Input
                    v-model="newModelInput"
                    style="width: 90%;"
                    :placeholder="$t('apiForm.enterModelName')"
                ></Input>
            </div>
            <div slot="footer">
                <Button type="primary" @click="addModel">{{ $t('com.submit') }}</Button>
                <Button @click="close">{{ $t('com.cancel') }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { CommonNameCheck, isIpv4Cidr, isIpv6Cidr } from '@/utils/const';

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
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('apiForm.nameRequired')));
                return;
            }

            if (!CommonNameCheck(value)) {
                callback(new Error(this.$t('com.tipCommonRule')));
                return;
            }
            callback();
        };

        const validateKey = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('apiForm.keyRequired')));
                return;
            }

            let prefix = 'AI_product';

            if (!value.startsWith(prefix + '-')) {
                callback(new Error(this.$t('apiForm.keyPrefixError', { prefix: prefix })));
                return;
            }

            if (value === prefix + '-') {
                callback(new Error(this.$t('apiForm.keyIncomplete')));
                return;
            }

            const suffix = value.substring(prefix.length + 1);
            if (!suffix) {
                callback(new Error(this.$t('apiForm.keyIncomplete')));
                return;
            }

            if (suffix.startsWith('-') || suffix.endsWith('-') || suffix.includes('--')) {
                callback(new Error(this.$t('apiForm.keySuffixError')));
                return;
            }

            const suffixPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
            if (!suffixPattern.test(suffix)) {
                callback(new Error(this.$t('apiForm.keySuffixPatternError')));
                return;
            }

            callback();
        };

        const validateQuota = (rule, value, callback) => {
            if (value === null) {
                callback(new Error(this.$t('apiForm.quotaRequired')));
                return;
            }

            if (value < 0 || value > 100000000) {
                callback(new Error(this.$t('apiForm.quotaRangeError')));
                return;
            }

            callback();
        };

        const validateSubnet = (rule, value, callback) => {
            if (!value) {
                callback();
                return;
            }

            let tmpValue = value.split('\n');
            let hasError = false;

            for (let i = 0; i < tmpValue.length; i++) {
                const item = tmpValue[i].trim();

                if (item === '') {
                    continue;
                }

                if (!isIpv4Cidr(item) && !isIpv6Cidr(item)) {
                    callback(new Error(this.$t('apiForm.invalidSubnet', { subnet: item })));
                    hasError = true;
                    return;
                }
            }

            const nonEmptyItems = tmpValue
                .filter(item => item.trim() !== '')
                .map(item => item.trim());
            const uniqueItems = [...new Set(nonEmptyItems)];

            if (nonEmptyItems.length !== uniqueItems.length) {
                const seen = new Set();
                let duplicate = '';
                for (const item of nonEmptyItems) {
                    if (seen.has(item)) {
                        duplicate = item;
                        break;
                    }
                    seen.add(item);
                }
                callback(new Error(this.$t('apiForm.duplicateSubnet', { subnet: duplicate })));
                return;
            }

            callback();
        };

        return {
            formData: {
                name: '',
                enable: 'true',
                key: '',
                is_limit: '',
                total_quota: null,
                expired_time: '',
                allowed_models: [],
                allowed_subnets: ''
            },
            options: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            modelList: [],
            initialModelList: null,
            modelEnable: false,
            subnetEnable: false,
            ruleValidate: {
                name: [
                    {
                        required: this.isAdd,
                        validator: validateName
                    }
                ],
                enable: [
                    {
                        required: true,
                        message: this.$t('apiForm.pleaseSelect')
                    }
                ],
                key: [
                    {
                        required: this.isAdd,
                        validator: validateKey
                    }
                ],
                is_limit: [
                    {
                        required: true,
                        message: this.$t('apiForm.pleaseSelect')
                    }
                ],
                total_quota: [
                    {
                        required: true,
                        validator: validateQuota
                    }
                ],
                allowed_subnets: [
                    {
                        required: false,
                        validator: validateSubnet
                    }
                ]
            },
            newModelInput: '',
            customModel: false
        };
    },
    watch: {
        currentData: {
            handler(data) {
                if (!this.isAdd) {
                    this.formData = cloneDeep(data);
                    if (this.formData.allowed_models && this.formData.allowed_models.length > 0) {
                        this.modelEnable = true;

                        this.formData.allowed_models.forEach(model => {
                            if (!this.modelList.includes(model)) {
                                this.modelList.push(model);
                            }
                        });
                    }

                    if (data.allowed_subnets && data.allowed_subnets.length > 0) {
                        this.subnetEnable = true;

                        this.formData.allowed_subnets = data.allowed_subnets
                            .map((item, index) => {
                                return index < data.allowed_subnets.length - 1 ? item + '\n' : item;
                            })
                            .join('');
                    }

                    this.$set(this.formData, 'enable', data.enable.toString());
                    this.$set(this.formData, 'is_limit', data.is_limit.toString());
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        this.getModels();

        if (this.isAdd && !this.modelList) {
            this.modelList = [];
        }
    },
    methods: {
        onCancel() {
            this.$emit('cancel');
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (!this.modelEnable) {
                        this.formData.allowed_models = [];
                    }

                    if (!this.subnetEnable) {
                        this.formData.allowed_subnets = '';
                    }

                    if (
                        this.formData.expired_time &&
                        typeof this.formData.expired_time !== 'string'
                    ) {
                        this.formData.expired_time = moment(this.formData.expired_time).format(
                            'YYYY-MM-DD HH:mm:ss'
                        );
                    }

                    this.$emit('submit', this.formData);
                } else {
                    this.$Message.error(this.$t('com.tipValidateError'));
                }
            });
        },
        getKey() {
            this.$request({
                url: this.$urlFormat('products/{product_name}/api-keys/actions/generate'),
                method: 'get',
                openapi: true
            }).then(data => {
                if (data.status === 200) {
                    this.formData.key = data.data.Data.key || '';
                }
            });
        },
        setTime(time) {
            if (time === '') {
                this.formData.expired_time = '';
            } else {
                const now = new Date();
                let expiredTime = new Date(now);

                switch (time) {
                    case '1h':
                        expiredTime.setHours(now.getHours() + 1);
                        break;
                    case '1d':
                        expiredTime.setDate(now.getDate() + 1);
                        break;
                    case '1m':
                        expiredTime.setMonth(now.getMonth() + 1);
                        break;
                    default:
                        expiredTime.setMonth(now.getMonth() + 1);
                }

                this.formData.expired_time = moment(expiredTime).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        close() {
            this.customModel = false;
            this.newModelInput = '';
        },
        addModel() {
            if (this.newModelInput && this.newModelInput.trim() !== '') {
                const trimmedInput = this.newModelInput.trim();
                if (this.modelList.includes(trimmedInput)) {
                    this.$Message.warning(this.$t('apiForm.modelExists'));
                    return;
                }
                if (!CommonNameCheck(trimmedInput)) {
                    this.$Message.warning({
                        content: this.$t('com.tipCommonRule')
                    });
                    return;
                }

                if (!Array.isArray(this.modelList)) {
                    this.modelList = [];
                }

                this.modelList.push(trimmedInput);

                if (this.modelEnable) {
                    if (!this.formData.allowed_models) {
                        this.$set(this.formData, 'allowed_models', []);
                    }
                    if (!this.formData.allowed_models.includes(trimmedInput)) {
                        this.formData.allowed_models.push(trimmedInput);
                    }
                }

                this.customModel = false;
            }
        },
        getModels() {
            this.models = [];
            this.modelLoading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/models'),
                method: 'get',
                openapi: true
            }).then(data => {
                if (data.status === 200) {
                    const serverModels = data.data.Data || [];

                    if (!this.initialModelList) {
                        this.initialModelList = [...serverModels];
                    }

                    const manualModels = this.modelList.filter(
                        model => !serverModels.includes(model)
                    );

                    this.modelList = [...serverModels, ...manualModels];
                }
            });
        },
        selectAll() {
            this.formData.allowed_models = [...this.modelList];
        },
        clearnAll() {
            this.formData.allowed_models = [];
        },
        manuallyAddModel() {
            this.customModel = true;
            this.newModelInput = '';
        }
    }
};
</script>

<style lang="less" scoped>
.btn-box-del {
    margin-right: 8px;
}
.el-select {
    width: 70%;
}
.refresh {
    font-size: 25px;
    cursor: pointer;
}
</style>
<style>
.custom-select-dropdown {
    min-width: 300px !important;
    max-width: 500px !important;
}

.custom-select-dropdown .el-select-dropdown__item {
    white-space: normal !important;
    word-break: break-all !important;
    line-height: 1.5 !important;
    padding: 8px 10px !important;
    height: auto !important;
}

.custom-select-dropdown .el-select-dropdown__item span {
    white-space: normal !important;
}
.el-select .el-select__tags {
    flex-wrap: wrap !important;
    max-width: 100% !important;
    display: flex !important;
    align-items: center !important;
}

.el-select .el-select__tags .el-tag {
    margin-top: 3px !important;
    margin-bottom: 3px !important;
    max-width: 100% !important;
    display: inline-flex !important;
    align-items: center !important;
}

.el-select .el-select__tags-text {
    max-width: 200px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    display: inline-block !important;
}

.el-select .el-tag .el-tag__close {
    position: static !important;
    transform: none !important;
    flex-shrink: 0 !important;
}

.el-select .el-select__tags .el-select__tags-text {
    display: inline-block !important;
    vertical-align: middle !important;
}

.el-select .el-select__tags .el-select__collapse-tags {
    display: inline-flex !important;
    align-items: center !important;
}
</style>
