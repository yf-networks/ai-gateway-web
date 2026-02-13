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
        <Button class="add-button" type="primary" @click="onAdd" size="small">{{
            $t('com.createX', { obj: $t('domain.name') })
        }}</Button>
        <Drawer
            v-model="isHiden"
            :title="$t('com.createX', { obj: $t('domain.name') })"
            width="30"
            :mask-closable="false"
        >
            <created v-if="isHiden" :domainNames="domainNames" @submitForm="submitForm" />
        </Drawer>
        <pageTable ref="pageTable" :tableData="tableData" :columns="columns" :loading="loading" />
    </div>
</template>

<script>
import pageTable from '@/components/table/pageTable';
import created from './components/Created.vue';
export default {
    components: {
        pageTable,
        created
    },
    mounted() {
        this.getDomainList();
    },
    data() {
        const that = this;
        return {
            loading: false,
            isHiden: false,
            tableData: [],
            columns: [
                {
                    title: this.$t('domain.name'),
                    key: 'name',
                    searchable: true,
                    sortable: 'custom'
                },
                {
                    key: 'action',
                    title: this.$t('com.operation'),
                    render(h, params) {
                        return h(
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
                        );
                    }
                }
            ],
            domainNames: []
        };
    },
    methods: {
        submitForm(data) {
            this.$request({
                url: this.$urlFormat('products/{product_name}/domains'),
                method: 'post',
                data: data
            }).then(data => {
                if (data.status === 200) {
                    this.$Message.success({
                        content: this.$t('com.tipAddSuccX', { obj: this.$t('domain.name') })
                    });
                    this.isHiden = false;
                    this.getDomainList();
                }
            });
        },
        onAdd() {
            this.isHiden = true;
        },
        getDomainList() {
            this.loading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/domains'),
                method: 'get'
            })
                .then(data => {
                    if (data.status === 200) {
                        this.domainNames = data.data.Data;
                        this.tableData = data.data.Data;
                        let result = [];
                        this.tableData.forEach(item => {
                            let obj = {};
                            obj.name = item;
                            result.push(obj);
                        });
                        this.tableData = result;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onDel(params) {
            this.$Modal.confirm({
                loading: true,
                title: this.$t('com.informationTips'),
                content:
                    this.$t('com.confirmDelX', { name: this.$t('domain.name') }) + params.row.name,
                onOk: () => {
                    this.$request({
                        url: this.$urlFormat('products/{product_name}/domains/{domain_name}', {
                            domain_name: params.row.name
                        }),
                        method: 'delete'
                    }).then(data => {
                        this.$Modal.remove();
                        if (data.status === 200) {
                            this.$Message.success({
                                content: this.$t('com.tipDelSucc')
                            });
                            this.getDomainList();
                        }
                    });
                },
                onCancel: () => {
                    this.$Message.info({
                        content: this.$t('com.tipCancelDel')
                    });
                }
            });
        }
    }
};
</script>
