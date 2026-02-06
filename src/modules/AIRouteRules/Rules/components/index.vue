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
    <div class="newClusters">
        <Rules
            v-show="stepsCurrentState === 0"
            :clustersData="clustersData"
            :basic="formData.basic"
            :isAdd="mode === 'add'"
            ref="rulesForm"
        />
        <Review v-if="stepsCurrentState === 1" ref="reviewForm" :data="formData" />
        <footer class="bottom">
            <Steps :current="stepsCurrentState">
                <Step
                    v-for="(item, index) in stepList"
                    :key="index"
                    :title="item.title"
                    :content="item.content"
                ></Step>
            </Steps>
        </footer>
        <div class="com-btn-box drawer-footer">
            <Button
                v-show="stepsCurrentState === stepList.length - 1"
                size="small"
                type="primary"
                :loading="submitting"
                @click="submitNextSteps"
            >
                {{ submitting ? $t('com.submitting') : $t('com.localSave') }}
            </Button>
            <Button
                v-show="stepsCurrentState !== stepList.length - 1"
                size="small"
                @click="validateCurrentStep"
                type="primary"
            >
                {{ $t('com.nextStep') }}
            </Button>
            <Button v-show="stepsCurrentState !== 0" @click="back" size="small">{{
                $t('com.lastStep')
            }}</Button>
        </div>
    </div>
</template>

<script>
import Rules from './Rules';
import Review from './Review.vue';
import { cloneDeep } from 'lodash';

export default {
    props: {
        mode: {
            type: String,
            default: 'add'
        },
        currentRule: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    components: {
        Rules,
        Review
    },
    data() {
        return {
            stepsCurrentState: 0,
            stepList: [
                {
                    title: this.$t('com.haveInHand'),
                    content: this.$t('route.stepRules')
                },
                {
                    title: this.$t('com.pending'),
                    content: this.$t('route.stepReview')
                }
            ],
            tagList: [],
            formData: {
                basic: {}
            },
            disabled: false,
            clustersData: [],
            submitting: false
        };
    },
    watch: {
        stepsCurrentState: {
            handler(currentIndex) {
                this.stepList.map((item, index) => {
                    let msg =
                        currentIndex === index
                            ? this.$t('com.haveInHand')
                            : index > currentIndex
                            ? this.$t('com.pending')
                            : this.$t('com.completed');
                    this.$set(item, 'title', msg);
                });
            },
            immediate: true
        },
        currentRule: {
            handler(val) {
                if (this.mode !== 'add' && val && Object.keys(val).length > 0) {
                    this.formData = cloneDeep(val);
                    this.$set(this.formData, 'basic', {
                        name: val.name,
                        ...val.basic
                    });
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.getClusters();
    },
    methods: {
        async validateCurrentStep() {
            this.disabled = true;

            try {
                let currentComponent = null;
                let currentStepName = this.getCurrentStepName();

                switch (this.stepsCurrentState) {
                    case 0:
                        currentComponent = this.$refs.rulesForm;
                        break;
                    default:
                        this.submitNextSteps();
                        return;
                }

                if (currentComponent && typeof currentComponent.validate === 'function') {
                    const validateResult = currentComponent.validate();

                    if (validateResult.then) {
                        const result = await validateResult;

                        if (result.valid) {
                            await this.saveCurrentStepData();

                            this.submitNextSteps();
                        } else {
                            this.$Message.error(
                                `【${currentStepName}】${this.$t('com.tipValidateError')}`
                            );
                            this.disabled = false;
                        }
                    } else {
                        currentComponent.validate(valid => {
                            if (valid) {
                                this.saveCurrentStepData();

                                this.submitNextSteps();
                            } else {
                                this.$Message.error(
                                    `【${currentStepName}】${this.$t('com.tipValidateError')}`
                                );
                                this.disabled = false;
                            }
                        });
                    }
                } else {
                    await this.saveCurrentStepData();
                    this.submitNextSteps();
                }
            } catch (error) {
                const currentStepName = this.getCurrentStepName();

                let errorMessage = `【${currentStepName}】${this.$t('com.tipError')}`;
                if (error.message) {
                    errorMessage += `: ${error.message}`;
                }

                this.$Message.error(errorMessage);
                this.disabled = false;
            }
        },

        getCurrentStepName() {
            const stepNames = [this.$t('route.stepRules'), this.$t('route.stepReview')];
            return stepNames[this.stepsCurrentState] || this.$t('com.tipError');
        },

        async saveCurrentStepData() {
            let currentComponent = null;
            switch (this.stepsCurrentState) {
                case 0:
                    currentComponent = this.$refs.rulesForm;
                    if (currentComponent && currentComponent.getFormData) {
                        try {
                            const rulesData = currentComponent.getFormData();
                            this.formData.basic = { ...rulesData };
                            this.formData.name = rulesData.name;
                        } catch (error) {
                            console.error(
                                `${this.$t('route.stepRules')}${this.$t('com.tipError')}:`,
                                error
                            );
                            throw error;
                        }
                    }
                    break;
            }
        },
        submitNextSteps() {
            if (this.stepsCurrentState < this.stepList.length - 1) {
                this.stepsCurrentState++;
                this.disabled = false;
            } else {
                this.submitForm();
            }
        },

        back() {
            if (this.stepsCurrentState > 0) {
                this.stepsCurrentState--;
            }
        },
        submitForm() {
            this.submitting = true;

            try {
                const completeFormData = this.buildCompleteFormData();

                this.$emit('submitForm', completeFormData);
            } catch (error) {
                this.$Message.error(
                    `${this.$t('com.localSave')}${this.$t('com.tipError')}: ${error.message}`
                );
            } finally {
                this.submitting = false;
            }
        },

        buildCompleteFormData() {
            const completeData = {
                name: this.formData.basic.name,
                basic: this.formData.basic || {}
            };

            return this.cleanEmptyValues(completeData);
        },

        cleanEmptyValues(obj) {
            if (obj === null || obj === undefined || obj === '') {
                return undefined;
            }

            if (typeof obj !== 'object') {
                return obj;
            }

            if (Array.isArray(obj)) {
                const cleanedArray = obj
                    .map(item => this.cleanEmptyValues(item))
                    .filter(item => item !== undefined);
                return cleanedArray.length > 0 ? cleanedArray : undefined;
            }

            const cleaned = {};
            for (const [key, value] of Object.entries(obj)) {
                const cleanedValue = this.cleanEmptyValues(value);
                if (cleanedValue !== undefined) {
                    cleaned[key] = cleanedValue;
                }
            }

            return Object.keys(cleaned).length > 0 ? cleaned : undefined;
        },
        getClusters() {
            this.$request({
                url: this.$urlFormat('products/{product_name}/clusters'),
                method: 'get',
                openapi: true
            }).then(data => {
                if (data.status === 200) {
                    this.clustersData = data.data.Data.filter(element => !!element.ready);
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
footer {
    margin-top: 30px;
}

.com-btn-box.drawer-footer {
    margin-top: 20px;
    text-align: center;
}
</style>
