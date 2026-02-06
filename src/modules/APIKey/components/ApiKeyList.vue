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
        <div class="title">
            <Button size="small" type="primary" @click="onAdd">{{ $t('com.create') }}</Button>
        </div>
        <pageTable :tableData="tableData" :columns="columns" :loading="tableLoading" />

        <Drawer
            v-model="isHiden"
            :title="isAdd ? $t('com.create') + ' API-Key' : $t('com.edit') + ' API-Key'"
            :mask-closable="false"
            width="50"
        >
            <Upsert
                v-if="isHiden"
                :currentData="currentData"
                :isAdd="isAdd"
                @submit="submitData"
                @cancel="isHiden = false"
            />
        </Drawer>

        <CustomModal
            :loading="loading"
            :modal="modal"
            :content="content"
            @onCancel="modal = false"
            @onOk="confirm"
        />
        <Modal
            v-model="keyModal"
            :title="$t('nav.APIKeyManage') + ' ' + $t('com.detail')"
            @on-ok="keyModal = false"
            @on-cancel="keyModal = false"
        >
            <div style="word-break: break-all; padding: 20px 0;">
                <Input v-model="currentKey" readonly style="width: 90%;"></Input>
                <Icon
                    type="md-copy"
                    size="22"
                    color="#2db7f5"
                    class="copy-icon"
                    v-clipboard:copy="currentKey"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                />
            </div>
            <div slot="footer">
                <Button type="primary" @click="keyModal = false">{{ $t('com.cancel') }}</Button>
            </div>
        </Modal>
        <Modal
            v-model="modelsModal"
            :title="$t('apiKey.modelsList')"
            @on-ok="modelsModal = false"
            @on-cancel="modelsModal = false"
        >
            <div style="padding: 20px 0; max-height: 400px; overflow-y: auto;">
                <table class="model-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f8f8f9;">
                            <th style="padding: 10px; border: 1px solid #dcdee2; text-align: left;">
                                {{ $t('apiKey.models') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(model, index) in currentModels" :key="index">
                            <td style="padding: 10px; border: 1px solid #dcdee2;">{{ model }}</td>
                        </tr>
                        <tr v-if="currentModels.length === 0">
                            <td
                                colspan="2"
                                style="
                                    padding: 10px;
                                    border: 1px solid #dcdee2;
                                    text-align: center;
                                "
                            >
                                {{ $t('apiKey.noData') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer">
                <Button @click="modelsModal = false">{{ $t('com.close') }}</Button>
            </div>
        </Modal>
        <Modal
            v-model="actionModal"
            :title="$t('com.operation') + $t('com.confirmX', { obj: '' })"
            @on-ok="confirmAction"
            @on-cancel="actionModal = false"
        >
            <p class="modal-content">{{ actionContent }}</p>
            <div slot="footer">
                <Button @click="actionModal = false">{{ $t('com.cancel') }}</Button>
                <Button type="primary" @click="confirmAction" :loading="loading">{{
                    $t('com.submit')
                }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import pageTable from '@/components/table/pageTable';
import CustomModal from '@/components/CustomModal';
import Upsert from './Upsert.vue';
import { cloneDeep } from 'lodash';
export default {
    components: {
        pageTable,
        Upsert,
        CustomModal
    },
    data() {
        const that = this;
        return {
            keyModal: false,
            modelsModal: false,
            currentModels: [],
            tableData: [],
            columns: [
                {
                    title: that.$t('com.name'),
                    key: 'name',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true
                },
                {
                    title: 'Key',
                    key: 'key',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true,
                    render(h, params) {
                        const keyValue = params.row.key || '';

                        let displayKey = keyValue;
                        if (keyValue.length > 12) {
                            displayKey =
                                keyValue.substring(0, 8) +
                                '****' +
                                keyValue.substring(keyValue.length - 4);
                        }

                        return h(
                            'span',
                            {
                                style: {
                                    color: '#2db7f5',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        that.showKeyModal(params.row.key);
                                    }
                                }
                            },
                            displayKey
                        );
                    }
                },
                {
                    title: that.$t('com.state'),
                    key: 'enable',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true,
                    render(h, params) {
                        const row = params.row;

                        if (!row.enable) {
                            return h('p', that.$t('com.deactivate'));
                        }

                        if (row.expired_time) {
                            const expiredTime = new Date(row.expired_time);
                            const now = new Date();
                            if (expiredTime < now) {
                                return h('p', that.$t('apiKey.expired'));
                            }
                        }

                        if (row.is_limit && row.remaining_quota === 0) {
                            return h('p', that.$t('apiKey.quotaExhausted'));
                        }

                        return h('p', that.$t('com.enable'));
                    }
                },
                {
                    title: that.$t('apiKey.isLimit'),
                    key: 'is_limit',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true,
                    render(h, params) {
                        return h(
                            'p',
                            params.row.is_limit ? that.$t('apiKey.yes') : that.$t('apiKey.no')
                        );
                    }
                },
                {
                    title: that.$t('apiKey.totalQuota'),
                    key: 'total_quota',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true,
                    render(h, params) {
                        return h('p', params.row.is_limit ? params.row.total_quota : '-');
                    }
                },
                {
                    title: that.$t('apiKey.remainingQuota'),
                    key: 'remaining_quota',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true,
                    render(h, params) {
                        return h('p', params.row.is_limit ? params.row.remaining_quota : '-');
                    }
                },
                {
                    title: that.$t('apiKey.updateTime'),
                    key: 'updated_time',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true
                },
                {
                    title: that.$t('cert.expiredDate'),
                    key: 'expired_time',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true
                },
                {
                    title: that.$t('apiKey.models'),
                    key: 'allowed_models',
                    minWidth: 160,
                    render: (h, params) => {
                        const models = params.row.allowed_models || [];
                        if (models.length > 0) {
                            return h('Icon', {
                                props: {
                                    type: 'ios-list-box-outline',
                                    size: 22
                                },
                                style: {
                                    cursor: 'pointer',
                                    color: '#2d8cf0'
                                },
                                on: {
                                    click: () => {
                                        that.showModelsModal(models);
                                    }
                                }
                            });
                        }
                        return h('span', '--');
                    }
                },
                {
                    title: that.$t('apiKey.subnet'),
                    key: 'allowed_subnets',
                    minWidth: 160,
                    sortable: 'custom',
                    searchable: true,
                    sortType: 'cidr',
                    render(h, params) {
                        if (params.row.allowed_subnets && params.row.allowed_subnets.length > 0) {
                            return h('div', [
                                ...params.row.allowed_subnets.map(item => h('p', item))
                            ]);
                        } else {
                            return '';
                        }
                    }
                },
                {
                    title: that.$t('com.operation'),
                    width: 220,
                    render(h, params) {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            that.onUpdate(params.row);
                                        }
                                    }
                                },
                                that.$t('com.edit')
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            that.onDel(params.row);
                                        }
                                    }
                                },
                                that.$t('com.del')
                            ),
                            params.row.enable
                                ? h(
                                      'Button',
                                      {
                                          props: {
                                              type: 'warning',
                                              size: 'small'
                                          },
                                          on: {
                                              click: () => {
                                                  that.showActionModal(params.row, 'disable');
                                              }
                                          }
                                      },
                                      that.$t('com.deactivate')
                                  )
                                : h(
                                      'Button',
                                      {
                                          props: {
                                              type: 'success',
                                              size: 'small'
                                          },
                                          on: {
                                              click: () => {
                                                  that.showActionModal(params.row, 'enable');
                                              }
                                          }
                                      },
                                      that.$t('com.enable')
                                  )
                        ]);
                    }
                }
            ],
            tableLoading: false,
            isHiden: false,
            currentData: {},
            loading: false,
            modal: false,
            currentName: '',
            content: '',
            currentKey: '',
            actionModal: false,
            actionContent: '',
            actionType: '',
            actionRow: null,
            isAdd: false
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        showKeyModal(key) {
            this.currentKey = key;
            this.keyModal = true;
        },
        onCopy(e) {
            this.$Message.success(this.$t('apiKey.copySucc'));
        },
        onError(e) {
            this.$Message.error(this.$t('apiKey.copyError'));
        },
        onAdd() {
            this.isAdd = true;
            this.isHiden = true;
        },
        onUpdate(row) {
            this.isAdd = false;
            this.currentName = row.name;
            this.currentData = row;
            this.isHiden = true;
        },
        onDel(row) {
            this.currentName = row.name;
            this.content = this.$t('com.confirmDelX', {
                obj: this.$t('nav.APIKeyManage') + ' ' + row.name
            });
            this.modal = true;
        },
        submitData(data) {
            let tmpData = cloneDeep(data);
            tmpData.enable = data.enable === 'true';
            tmpData.is_limit = data.is_limit === 'true';
            if (!tmpData.is_limit) {
                delete tmpData.total_quota;
            }
            if (data.allowed_subnets) {
                tmpData.allowed_subnets = data.allowed_subnets.split('\n').map(item => item.trim());
            } else {
                tmpData.allowed_subnets = [];
            }

            if (this.isAdd) {
                this.addReq(tmpData);
            } else {
                this.updateReq(tmpData);
            }
        },
        addReq(data) {
            this.$request({
                url: this.$urlFormat('products/{product_name}/api-keys'),
                method: 'post',
                openapi: true,
                data: data
            }).then(data => {
                if (data.status === 200) {
                    this.isHiden = false;
                    this.$Message.success({
                        content: this.$t('com.tipAddSucc')
                    });
                    this.fetchData();
                }
            });
        },
        updateReq(data, actions) {
            let tmpData = {};
            if (actions) {
                if (actions === 'disable') {
                    tmpData.enable = false;
                } else {
                    tmpData.enable = true;
                }
            } else {
                tmpData = cloneDeep(data);
            }

            this.loading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/api-keys/{api_key_name}', {
                    api_key_name: data.name
                }),
                method: 'patch',
                data: tmpData,
                openapi: true
            })
                .then(data => {
                    if (data.status === 200) {
                        this.isHiden = false;
                        this.$Message.success({
                            content: this.$t('com.tipEditSucc')
                        });
                        this.fetchData();
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        confirm() {
            this.loading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/api-keys/{api_key_name}', {
                    api_key_name: this.currentName
                }),
                method: 'delete',
                openapi: true
            })
                .then(data => {
                    if (data.status === 200) {
                        this.modal = false;
                        this.$Message.success({
                            content: this.$t('com.tipDelSucc')
                        });
                        this.fetchData();
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        fetchData() {
            this.tableLoading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/api-keys'),
                method: 'get',
                openapi: true
            })
                .then(res => {
                    if (res.status === 200) {
                        this.tableData = res.data.Data || [];
                    }
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        showModelsModal(models) {
            this.currentModels = models || [];
            this.modelsModal = true;
        },

        confirmAction() {
            if (this.actionRow && this.actionType) {
                this.updateReq(this.actionRow, this.actionType);
                this.actionModal = false;
                this.actionType = '';
                this.actionRow = null;
            }
        },

        showActionModal(row, actionType) {
            this.actionRow = row;
            this.actionType = actionType;
            if (actionType === 'enable') {
                this.actionContent = this.$t('apiKey.confirmEnable', { name: row.name });
            } else {
                this.actionContent = this.$t('apiKey.confirmDisable', { name: row.name });
            }
            this.actionModal = true;
        }
    }
};
</script>

<style lang="less" scoped>
.copy-icon {
    cursor: pointer;
}
.modal-content {
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    line-height: 1.5;
    max-height: 60vh;
    overflow-y: auto;
}
</style>
