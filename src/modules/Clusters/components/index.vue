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
    <div class="newClusters">
        <BaseConfig
            v-show="currentStepIndex === 0"
            :baseConfigData="baseConfigData"
            :reportFlag="baseSubmitFlag"
            :isAdd="isAdd"
            :clusterNames="clusterNames"
            @submitData="acceptDataHandler"
        />
        <Timeout
            v-show="currentStepIndex === 1"
            :baseConfigData="baseConfigData"
            :reportFlag="timeoutSubmitFlag"
            :isAdd="isAdd"
            @submitData="acceptDataHandler"
        />
        <PassiveHealthCheck
            v-show="currentStepIndex === 2"
            :passiveHealthData="passiveHealthData"
            :reportFlag="passiveHealthSubmitFlag"
            :isAdd="isAdd"
            :submitName="submitName"
            @submitData="acceptDataHandler"
        />
        <SubClusters
            v-show="currentStepIndex === 3"
            :mountedSubCluster="mountedSubCluster"
            :subClustersData="subClustersData"
            :reportFlag="subClustersFlag"
            :subClusterProductList="subClusterProductList"
            @submitData="acceptDataHandler"
        />
        <GatewayConfig
            v-show="currentStepIndex === 4"
            :llmConfigData="llmConfigData"
            :isAdd="isAdd"
            :stepsCurrentState="currentStepIndex"
            :subClusterProductList="subClusterProductList"
            :subClustersData="subClustersData"
            :reportFlag="llmConfigFlag"
            @submitData="acceptDataHandler"
        />
        <Scheduler
            v-show="currentStepIndex === 5 && isAdd"
            :scheduler="scheduler"
            :isAdd="isAdd"
            :subClustersData="subClustersData"
            :reportFlag="schedulerSubmitFlag"
            @submitData="acceptDataHandler"
            @disable="onChangeDisable"
        />

        <Review
            v-show="currentStepIndex === reviewStepIndex"
            :baseConfigData="baseConfigData"
            :subClustersData="subClustersData"
            :passiveHealthData="passiveHealthData"
            :llmConfigData="llmConfigData"
            :scheduler="scheduler"
            :subClusterProductList="subClusterProductList"
            :isAdd="isAdd"
            :reportFlag="reviewSubmitFlag"
            v-on="$listeners"
            @submitData="submit"
        />
        <footer>
            <Steps :current="currentStepIndex">
                <Step
                    v-for="(step, index) in visibleSteps"
                    :key="index"
                    :title="StepsTitle(index)"
                    :content="step.content"
                ></Step>
            </Steps>
        </footer>
        <div class="com-btn-box drawer-footer">
            <Button
                v-show="currentStepIndex === reviewStepIndex"
                size="small"
                type="primary"
                @click="submitNextSteps"
            >
                {{ $t('com.submit') }}
            </Button>
            <Button
                v-show="currentStepIndex !== reviewStepIndex"
                size="small"
                :disabled="disabled"
                @click="submitNextSteps"
                type="primary"
            >
                {{ $t('com.nextStep') }}
            </Button>
            <Button v-show="currentStepIndex !== 0" @click="back" size="small">{{
                $t('com.lastStep')
            }}</Button>
        </div>
    </div>
</template>

<script>
import BaseConfig from './BaseConfig';
import Timeout from './Timeout';
import SubClusters from './SubClusters';
import Scheduler from './Scheduler';
import PassiveHealthCheck from './PassiveHealthCheck';
import { cloneDeep } from 'lodash';
import Review from './Review';
import GatewayConfig from './GatewayConfig.vue';

export default {
    name: 'newClusters',

    components: {
        BaseConfig,
        Timeout,
        PassiveHealthCheck,
        GatewayConfig,
        SubClusters,
        Scheduler,
        Review
    },
    props: {
        currentCluster: {
            type: Object,
            default() {
                return {};
            }
        },
        clusterNames: {
            type: Array,
            default() {
                return [];
            }
        },
        isAdd: {
            type: Boolean
        },
        subClusterProductList: {
            type: Array,
            default() {
                return [];
            }
        },
        mountedSubCluster: {
            type: Array,
            default() {
                return [];
            }
        }
    },

    mounted() {
        if (!this.isAdd) {
            this.changeData();
        }
    },

    data() {
        return {
            submitName: '',
            currentStepIndex: 0,
            baseConfigData: {},
            llmConfigData: {},
            passiveHealthData: {},
            scheduler: {},
            baseSubmitFlag: false,
            timeoutSubmitFlag: false,
            passiveHealthSubmitFlag: false,
            subClustersFlag: false,
            llmConfigFlag: false,
            schedulerSubmitFlag: false,
            reviewSubmitFlag: false,
            disabled: false,
            subClustersData: []
        };
    },

    computed: {
        // 定义所有可能的步骤
        allSteps() {
            return [
                { content: this.$t('cluster.basicConfig'), visible: true },
                { content: this.$t('cluster.timeoutAndRetransmission'), visible: true },
                { content: this.$t('cluster.passiveHealthCheck'), visible: true },
                {
                    content: this.$t('com.createX', { obj: this.$t('subCluster.name') }),
                    visible: true
                },
                { content: this.$t('cluster.modelConfig'), visible: true },
                { content: this.$t('cluster.schedulerConfig'), visible: this.isAdd },
                { content: this.$t('cluster.review'), visible: true }
            ];
        },
        visibleSteps() {
            return this.allSteps.filter(step => step.visible);
        },
        reviewStepIndex() {
            return this.visibleSteps.length - 1;
        }
    },

    methods: {
        onChangeDisable(v) {
            this.disabled = true;
        },
        submit() {
            let params = this.handelData();
            if (!this.isAdd) {
                Promise.all([
                    this.updateSubClusters(params.sub_clusters),
                    this.updataClusterBasicData(params)
                ]).then(data => {
                    if (data.every(item => item.status === 200)) {
                        this.$Message.success({ content: this.$t('com.tipSubmitSucc') });
                        this.$emit('submit');
                    }
                });
            } else {
                this.$request({
                    url: this.$urlFormat('products/{product_name}/clusters'),
                    method: 'post',
                    data: params
                }).then(data => {
                    if (data.status === 200) {
                        this.$Message.success({ content: this.$t('com.tipSubmitSucc') });
                        this.$emit('submit');
                    }
                });
            }
        },
        updataClusterBasicData(params) {
            delete params.scheduler;
            delete params.sub_clusters;
            return this.$request({
                url: this.$urlFormat('products/{product_name}/clusters/{cluster_name}', {
                    cluster_name: params.name
                }),
                method: 'patch',
                data: params
            });
        },
        acceptDataHandler(data) {
            this[data.topic] = data.data;
            this.submitName = this.baseConfigData.name;

            if (this.currentStepIndex < this.reviewStepIndex) {
                this.currentStepIndex += 1;
            }
        },
        updateSubClusters(data) {
            return this.$request({
                url: this.$urlFormat(
                    'products/{product_name}/clusters/{cluster_name}/sub-clusters',
                    { cluster_name: this.baseConfigData.name }
                ),
                method: 'patch',
                data: {
                    name: this.baseConfigData.name,
                    sub_clusters: data
                }
            });
        },
        handelData() {
            let data = {
                name: this.baseConfigData.name,
                description: this.baseConfigData.description,
                basic: {
                    connection: this.baseConfigData.connection,
                    retries: this.baseConfigData.retries,
                    buffers: this.baseConfigData.buffers,
                    timeouts: this.baseConfigData.timeouts
                },
                sub_clusters: this.subClustersData,
                sticky_sessions: this.baseConfigData.sticky_sessions,
                passive_health_check: this.passiveHealthData,
                llm_config: this.llmConfigData,
                scheduler: this.scheduler
            };
            data.basic.connection.cancel_on_client_close =
                this.baseConfigData.connection.cancel_on_client_close === 'true';
            this.changeObj(data);
            return data;
        },
        changeObj(data) {
            for (let key in data) {
                if (JSON.stringify(data[key]) === '{}') {
                    data[key] = null;
                }
            }
        },
        StepsTitle(index) {
            let msg =
                index === this.currentStepIndex
                    ? this.$t('com.haveInHand')
                    : index > this.currentStepIndex
                    ? this.$t('com.pending')
                    : this.$t('com.completed');
            return msg;
        },
        submitNextSteps() {
            switch (this.currentStepIndex) {
                case 0:
                    this.baseSubmitFlag = !this.baseSubmitFlag;
                    break;
                case 1:
                    this.timeoutSubmitFlag = !this.timeoutSubmitFlag;
                    break;
                case 2:
                    this.passiveHealthSubmitFlag = !this.passiveHealthSubmitFlag;
                    break;
                case 3:
                    this.subClustersFlag = !this.subClustersFlag;
                    break;
                case 4:
                    this.llmConfigFlag = !this.llmConfigFlag;
                    break;
                case 5:
                    if (this.isAdd) {
                        this.schedulerSubmitFlag = !this.schedulerSubmitFlag;
                    } else {
                        this.reviewSubmitFlag = !this.reviewSubmitFlag;
                    }
                    break;
                case 6:
                    this.reviewSubmitFlag = !this.reviewSubmitFlag;
            }
        },
        changeData() {
            const tmpData = cloneDeep(this.currentCluster);
            this.baseConfigData = {
                name: tmpData.name,
                description: tmpData.description,
                connection: tmpData.basic.connection,
                buffers: tmpData.basic.buffers,
                retries: tmpData.basic.retries,
                timeouts: tmpData.basic.timeouts,
                sticky_sessions: tmpData.sticky_sessions
            };
            this.passiveHealthData = tmpData.passive_health_check;
            this.llmConfigData = tmpData.llm_config;
            this.subClustersData = tmpData.sub_clusters ? tmpData.sub_clusters : [];
            this.scheduler = tmpData.scheduler;
        },
        back() {
            if (this.currentStepIndex > 0) {
                this.currentStepIndex -= 1;
            }
        }
    }
};
</script>

<style lang="less" scoped>
footer {
    padding-bottom: 30px;
    margin-top: 35px;
}
</style>
