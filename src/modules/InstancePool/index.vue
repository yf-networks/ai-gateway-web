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
    <div>
        <Button class="add-button" type="primary" size="small" @click="onAdd">
            {{ $t('com.createX', { obj: $t('instancePool.name') }) }}
        </Button>
        <Drawer
            v-model="isVisible"
            :mask-closable="false"
            width="1150"
            :title="
                isAdd
                    ? $t('com.createX', { obj: $t('instancePool.name') })
                    : $t('com.editX', { obj: $t('instancePool.name') })
            "
        >
            <createPool
                v-if="isVisible"
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
import createPool from './components/Create.vue';
import { cloneDeep } from 'lodash';
export default {
    name: 'instancePools',
    components: {
        pageTable,
        createPool
    },
    mounted() {
        this.getPoolList();
    },
    data() {
        const that = this;
        return {
            currentData: {},
            instancesPoolNames: [],
            loading: false,
            isVisible: false,
            isAdd: false,
            tableData: [],
            currentName: '',
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
            ]
        };
    },
    methods: {
        onAdd() {
            this.isVisible = !this.isVisible;
            this.isAdd = true;
        },
        onUpdate(params) {
            this.isAdd = false;
            this.loading = true;
            this.getProductInstancePoolInfo(params.row.name);
        },
        onDel(params) {
            this.$Modal.confirm({
                title: this.$t('com.informationTips'),
                content:
                    this.$t('com.confirmDelX', { obj: this.$t('instancePool.name') }) +
                    params.row.name +
                    '?',
                onOk: () => {
                    this.currentName = params.row.name;
                    this.onDeleteSubCluster(`subcluster-${params.row.name}-aiyf`);
                },
                onCancel: () => {
                    this.$Message.info({ content: this.$t('com.tipCancelDel') });
                }
            });
        },
        onClose() {
            this.isVisible = !this.isVisible;
        },
        submitData(data) {
            if (this.isAdd) {
                this.onAddInstancePool(data);
            } else {
                this.onUpdatetInstancePool(data);
            }
        },
        getProductInstancePoolInfo(name) {
            let tmpName = name.split('.')[1];
            this.$request({
                url: this.$urlFormat(
                    'products/{product_name}/instance-pools/{instance_pool_name}',
                    {
                        instance_pool_name: tmpName
                    }
                ),
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.loading = false;
                    this.isVisible = true;
                    this.currentData = data.data.Data;
                }
            });
        },
        onDelInstancePool(name) {
            this.$request({
                url: this.$urlFormat(
                    'products/{product_name}/instance-pools/{instance_pool_name}',
                    {
                        instance_pool_name: name
                    }
                ),
                method: 'delete'
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipDelSucc')
                    });
                    this.isVisible = false;
                    this.getPoolList();
                }
            });
        },
        onAddInstancePool(data) {
            let tmpData = cloneDeep(data);
            tmpData.type = 'product';
            tmpData.name = 'AI_product' + '.' + data.name;
            this.$request({
                url: this.$urlFormat('products/{product_name}/instance-pools'),
                method: 'post',
                data: tmpData
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipAddSucc')
                    });
                    this.isVisible = false;
                    this.getPoolList();
                    this.onAddSubCluster(tmpData);
                }
            });
        },
        onAddSubCluster(data) {
            this.$request({
                url: this.$urlFormat('products/{product_name}/sub-clusters'),
                method: 'post',
                data: {
                    name: `subcluster-${data.name}-aiyf`,
                    instance_pool: data.name,
                    idc: 'aiyf',
                    description: `subcluster-${data.name}-aiyf`
                },
                openapi: true
            }).then(data => {
                if (data.status === 200) {
                } else {
                    console.error('子集群添加失败');
                }
            });
        },

        onUpdatetInstancePool(data) {
            let tmpName = this.currentData.name.split('.')[1];
            this.$request({
                url: this.$urlFormat(
                    'products/{product_name}/instance-pools/{instance_pool_name}',
                    {
                        instance_pool_name: tmpName
                    }
                ),
                method: 'patch',
                data: data
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipEditSucc')
                    });
                    this.isVisible = false;
                    this.getPoolList();
                }
            });
        },
        getPoolList() {
            this.loading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/instance-pools'),
                method: 'get'
            })
                .then(data => {
                    this.tableData = [];
                    if (data.status === 200) {
                        data.data.Data.map(item => {
                            let obj = {};
                            obj.name = item;
                            this.tableData.push(obj);
                        });
                        this.instancesPoolNames = data.data.Data;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onDeleteSubCluster(name) {
            this.$request({
                url: this.$urlFormat('products/{product_name}/sub-clusters/{sub_cluster_name}', {
                    sub_cluster_name: name
                }),
                method: 'delete',
                openapi: true
            }).then(data => {
                if (data.status === 200) {
                    this.onDelInstancePool(this.currentName);
                } else {
                    console.error('子集群删除失败');
                    this.$Message.error({
                        content: this.$t('com.tipDelError')
                    });
                }
            });
        }
    }
};
</script>
