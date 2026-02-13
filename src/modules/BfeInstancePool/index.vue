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
        <Button class="add-button" type="primary" size="small" @click="onAdd">
            {{ $t('com.createX', { obj: $t('instancePool.name') }) }}
        </Button>
        <Drawer
            v-model="isHiden"
            :mask-closable="false"
            width="1150"
            :title="
                isAdd
                    ? $t('com.editX', { obj: $t('instancePool.name') })
                    : $t('com.createX', { obj: $t('instancePool.name') })
            "
        >
            <createPool
                v-if="isHiden"
                :isAdd="isAdd"
                :currentData="currentData"
                :instancesPoolNames="instancesPoolNames"
                @submit="submitData"
                @cancle="onClose"
            />
        </Drawer>
        <pageTable ref="pageTable" :tableData="tableData" :columns="columns" :loading="loading" />
    </div>
</template>

<script>
import pageTable from '@/components/table/pageTable';
import createPool from '../InstancePool/components/Create.vue';
export default {
    components: {
        pageTable,
        createPool
    },
    data() {
        const that = this;
        return {
            tableData: [],
            columns: [
                {
                    title: this.$t('com.nameX', { obj: this.$t('instancePool.name') }),
                    searchable: true,
                    sortable: 'custom',
                    key: 'name'
                },
                {
                    title: this.$t('com.operation'),
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
                                            that.onUpdate(params);
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
                                    on: {
                                        click: () => {
                                            that.onDel(params);
                                        }
                                    }
                                },
                                that.$t('com.del')
                            )
                        ]);
                    }
                }
            ],
            loading: false,
            isHiden: false,
            isAdd: false,
            instancesPoolNames: [],
            currentData: {}
        };
    },
    mounted() {
        this.getBfePools();
    },
    methods: {
        onClose() {
            this.isHiden = !this.isHiden;
        },
        getBfePoolsInfo(name) {
            this.$request({
                url: this.$urlFormat('bfe-pools/{instance_pool_name}', {
                    instance_pool_name: name
                }),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.loading = false;
                    this.isHiden = true;
                    this.currentData = data.data.Data;
                }
            });
        },
        submitData(data) {
            if (this.isAdd) {
                let tmpName = 'BFE.';
                data.name = tmpName + data.name;
                this.onAddBfePools(data);
            } else {
                this.onUpdateBfePools(data);
            }
        },
        onUpdateBfePools(data) {
            this.$request({
                url: this.$urlFormat('bfe-pools/{instance_pool_name}', {
                    instance_pool_name: data.name
                }),
                method: 'patch',
                data: data
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipEditSucc')
                    });
                    this.isHiden = false;
                    this.getBfePools();
                }
            });
        },
        onAddBfePools(data) {
            this.$request({
                url: 'bfe-pools',
                method: 'post',
                data: data
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipAddSucc')
                    });
                    this.isHiden = false;
                    this.getBfePools();
                }
            });
        },
        onAdd() {
            this.isHiden = !this.isHiden;
            this.isAdd = true;
        },
        onUpdate(params) {
            this.isAdd = false;
            this.loading = true;
            this.getBfePoolsInfo(params.row.name);
        },
        onDel(params) {
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content:
                    this.$t('com.confirmDelX', { obj: this.$t('instancePool.name') }) +
                    params.row.name +
                    '?',
                onOk: () => {
                    this.onDelBfePools(params.row.name);
                },
                onCancel: () => {
                    this.$Message.info({ content: this.$t('com.tipCancelDel') });
                }
            });
        },
        onDelBfePools(name) {
            this.$request({
                url: this.$urlFormat('bfe-pools/{instance_pool_name}', {
                    instance_pool_name: name
                }),
                method: 'delete'
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipDelSucc')
                    });
                    this.isHiden = false;
                    this.getBfePools();
                }
            });
        },
        getBfePools() {
            this.loading = true;
            this.$request({
                url: 'bfe-pools',
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.loading = false;
                    this.tableData = data.data.Data.map(item => {
                        let obj = {};
                        obj.name = item;
                        return obj;
                    });
                    this.instancesPoolNames = data.data.Data;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped></style>
