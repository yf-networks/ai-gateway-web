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
    <div class="Review">
        <div class="panel">
            <div class="panel-header">{{ $t('cluster.basicConfig') }}</div>
            <div class="panel-body">
                <ul class="clearFloat">
                    <li class="title">
                        {{ this.$t('com.nameX', { obj: this.$t('cluster.name') }) }}:
                    </li>
                    <li class="value">{{ baseConfigData['name'] }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.clusterDescription') }}:</li>
                    <li class="value">{{ baseConfigData['description'] }}</li>
                </ul>
                <ul v-if="baseConfigData.connection" class="clearFloat">
                    <li class="title">{{ $t('cluster.maxIdleConnPerRs') }}:</li>
                    <li class="value">{{ baseConfigData.connection['max_idle_conn_per_rs'] }}</li>
                </ul>
                <ul v-if="baseConfigData.sticky_sessions" class="clearFloat">
                    <li class="title">{{ $t('cluster.hashStrategy') }} :</li>
                    <li class="value">{{ baseConfigData.sticky_sessions['hash_strategy'] }}</li>
                </ul>
                <ul
                    v-if="
                        baseConfigData.sticky_sessions &&
                        baseConfigData.sticky_sessions['hash_strategy'] !== 'CLIENT_IP_ONLY'
                    "
                    class="clearFloat"
                >
                    <li class="title">{{ $t('cluster.hashHeader') }} :</li>
                    <li class="value">{{ baseConfigData.sticky_sessions['hash_header'] }}</li>
                </ul>
                <ul v-if="baseConfigData.sticky_sessions" class="clearFloat">
                    <li class="title">{{ $t('cluster.stickySessions') }} :</li>
                    <li class="value">
                        {{ baseConfigData.sticky_sessions['session_sticky_type'] }}
                    </li>
                </ul>
                <ul v-if="baseConfigData.buffers" class="clearFloat">
                    <li class="title">{{ $t('cluster.reqWriteBufferSize') }} :</li>
                    <li class="value">{{ baseConfigData.buffers['req_write_buffer_size'] }}</li>
                </ul>
                <ul v-if="baseConfigData.connection" class="clearFloat">
                    <li class="title">{{ $t('cluster.cancelOnClientClose') }}:</li>
                    <li class="value">
                        {{
                            baseConfigData.connection['cancel_on_client_close'] === 'true'
                                ? $t('com.enable')
                                : $t('com.deactivate')
                        }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="panel">
            <div class="panel-header">{{ $t('cluster.timeoutAndRetransmission') }}</div>
            <div v-if="baseConfigData.timeouts && baseConfigData.retries" class="panel-body">
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.timeoutReadClientAgain') }}:</li>
                    <li class="value">{{ baseConfigData.timeouts.timeout_read_client_again }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.timeoutReadbodyClient') }} :</li>
                    <li class="value">{{ baseConfigData.timeouts.timeout_readbody_client }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.timeoutConnServ') }} :</li>
                    <li class="value">{{ baseConfigData.timeouts.timeout_conn_serv }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.timeoutResHeader') }} :</li>
                    <li class="value">{{ baseConfigData.timeouts.timeout_response_header }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.timeoutWriteClient') }} :</li>
                    <li class="value">{{ baseConfigData.timeouts.timeout_write_client }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.maxRetryInSubcluster') }} :</li>
                    <li class="value">{{ baseConfigData.retries.max_retry_in_subcluster }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.maxRetryCrossSubcluster') }}:</li>
                    <li class="value">{{ baseConfigData.retries.max_retry_cross_subcluster }}</li>
                </ul>
            </div>
        </div>
        <div class="panel">
            <div class="panel-header">{{ $t('cluster.passiveHealthCheck') }}</div>
            <div class="panel-body">
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.faultThreshold') }} :</li>
                    <li class="value">{{ passiveHealthData['failnum'] }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.healthCheckInterval') }}:</li>
                    <li class="value">{{ passiveHealthData['interval'] }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.healthCheckHost') }}:</li>
                    <li class="value">{{ passiveHealthData['host'] }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.healthCheckUri') }}:</li>
                    <li class="value">{{ passiveHealthData['uri'] }}</li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('cluster.healthCheckStatuscode') }} :</li>
                    <li class="value">{{ passiveHealthData['statuscode'] }}</li>
                </ul>
            </div>
        </div>
        <div class="panel">
            <div class="panel-header">{{ $t('subCluster.name') }}</div>
            <div class="panel-body">
                <pageTable :columns="columns" :tableData="subClustersUsed" />
            </div>
        </div>
        <!-- 大模型 -->
        <div class="panel">
            <div class="panel-header">{{ $t('llmConfig.title') }}</div>
            <div class="panel-body" v-if="llmConfigData">
                <div v-if="llmConfigData.enable">
                    <ul class="clearFloat">
                        <li class="title">{{ $t('llmConfig.serviceName') }}:</li>
                        <li class="value">{{ llmConfigData.service_name }}</li>
                    </ul>
                    <ul class="clearFloat">
                        <li class="title">{{ $t('llmConfig.group') }}:</li>
                        <li class="value">{{ llmConfigData.group }}</li>
                    </ul>
                    <ul class="clearFloat">
                        <li class="title">{{ $t('llmConfig.modelRedirect') }}:</li>
                        <li class="value">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{{ $t('llmConfig.originalModelName') }}</th>
                                        <th>{{ $t('llmConfig.backendModelName') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(item, index) in llmConfigData.model_mappings"
                                        :key="index"
                                    >
                                        <td>
                                            {{ item.key }}
                                        </td>
                                        <td>
                                            {{ item.value }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                    </ul>
                    <ul class="clearFloat">
                        <li class="title">{{ $t('llmConfig.serviceAuthKey') }}:</li>
                        <li class="value">{{ llmConfigData.key }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">{{ $t('cluster.schedulerConfig') }}</div>
            <div class="panel-body">
                <table>
                    <tr>
                        <th>BFE{{ $t('cluster.name') }}</th>
                        <th>{{ $t('com.nameX', { obj: $t('subCluster.name') }) }}</th>
                        <th>{{ $t('cluster.proportion') }}</th>
                        <th>Total</th>
                    </tr>

                    <template v-for="(subClusters, bfeCluster) in scheduler">
                        <tr
                            v-for="(subCluster, index) in Object.keys(subClusters)"
                            :class="[
                                queryTotalRate(subClusters) !== 100 ? 'errorColor' : '',
                                'td-padding'
                            ]"
                        >
                            <td
                                class="td-padding"
                                v-if="index == 0"
                                :rowspan="Object.keys(subClusters).length"
                            >
                                {{ bfeCluster }}
                            </td>
                            <td class="td-padding">{{ subCluster }}</td>
                            <td class="td-padding">
                                {{ subClusters[subCluster] }}
                            </td>
                            <td
                                class="td-padding"
                                :rowspan="Object.keys(subClusters).length"
                                v-if="index == 0"
                            >
                                {{ queryTotalRate(subClusters) }}
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import pageTable from '@/components/table/pageTable';
import { cloneDeep } from 'lodash';
export default {
    name: 'Review',

    components: { pageTable },

    props: {
        baseConfigData: {
            type: Object,
            required: true
        },
        passiveHealthData: {
            type: Object,
            required: true
        },
        subClustersData: {
            type: Array,
            required: true
        },
        llmConfigData: {
            type: Object
        },
        scheduler: {
            type: Object,
            default() {
                return {};
            }
        },
        showFooter: {
            type: Boolean,
            default: true
        },
        isAdd: {
            type: Boolean,
            default: true
        },
        subClusterProductList: {
            type: Array,
            default() {
                return [];
            }
        },
        reportFlag: {
            type: Boolean
        }
    },
    watch: {
        subClustersData: {
            handler(v) {
                this.subClustersUsed = [];
                if (v) {
                    this.subClustersUsed = cloneDeep(v);
                    if (this.subClusterProductList && this.subClusterProductList.length > 0) {
                        this.subClustersUsed = this.subClusterProductList.filter(
                            item => this.subClustersUsed.indexOf(item.name) !== -1
                        );
                    }
                }
            },
            immediate: true,
            deep: true
        },
        reportFlag: {
            handler() {
                this.handleSubmit();
            }
        }
    },
    data() {
        return {
            subClustersUsed: [],
            spinShow: false,
            productName: '',
            columns: [
                {
                    title: this.$t('subCluster.name'),
                    key: 'name'
                },
                {
                    title: this.$t('instancePool.name'),
                    key: 'instance_pool'
                }
            ]
        };
    },
    methods: {
        handleSubmit() {
            this.$emit('submitData');
        },
        queryTotalRate(subCluster2rate) {
            let rate = 0;
            for (let subCluster in subCluster2rate) {
                if (subCluster2rate.hasOwnProperty(subCluster)) {
                    rate += subCluster2rate[subCluster];
                }
            }
            return rate;
        }
    }
};
</script>
<style lang="less" scoped>
.com-btn-box {
    margin-top: 15px;
}
.panel .panel-body ul .title {
    width: 400px;
}
table {
    @tableBorder: 1px solid #f4f4f4;
    width: 100%;
    border-top: @tableBorder;
    border-left: @tableBorder;
    border-collapse: collapse;
    margin-bottom: 30px;
    .t {
        border-right: @tableBorder;
        border-bottom: @tableBorder;
        text-align: left;
        font-size: 14px;
    }
    .td-padding {
        padding: 0 8px;
        line-height: 40px;
        height: 40px;
    }
    .chlid {
        border-bottom: @tableBorder;
        padding: 0 8px;
        .td-padding();
        &:last-child {
            border-bottom: 0px;
        }
        .warningMessage {
            font-size: 12px;
            text-align: left;
            color: black;
            height: 12px;
            line-height: 12px;
        }
    }

    .errorColor {
        line-height: 45px;
        height: 60px;
    }
    td {
        .t();
    }
    th {
        .t();
        .td-padding();
    }
    .background {
        background: #eee;
    }
}
.formShow {
    ul {
        display: flex;
        font-weight: 600;
        font-size: 14px;
        margin: 3px 0;
    }
    margin-bottom: 10px;
}
</style>
