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
        <Button size="small" type="primary" class="add-button" @click="onAdd">
            {{ $t('route.addRouteRule') }}
        </Button>
        <pageTable
            class="clear-both"
            :columns="columns"
            :tableData="tableData"
            :loading="loading"
        />
        <Drawer v-model="isHiden" :title="getDrawerTitle" width="60" :mask-closable="false">
            <Upsert
                v-if="isHiden"
                :currentRule="currentRule"
                :mode="mode"
                @submitForm="submitForm"
                @cancel="isHiden = false"
            />
        </Drawer>
    </div>
</template>

<script>
import pageTable from '@/components/table/pageTable';
import Upsert from './components/index.vue';
export default {
    components: {
        pageTable,
        Upsert
    },
    props: {
        rules: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        const that = this;
        return {
            mode: '',
            isHiden: false,
            loading: false,
            tableData: [],
            currentRule: {},
            columns: [
                {
                    title: that.$t('route.executionOrder'),
                    key: 'index',
                    width: '70',
                    render(h, params) {
                        return (
                            <div>
                                <span>{params.row.index + 1}</span>
                            </div>
                        );
                    }
                },
                {
                    title: that.$t('route.ruleName'),
                    key: 'name',
                    searchable: true
                },
                {
                    title: that.$t('route.domainName'),
                    searchable: true,
                    render(h, params) {
                        return <div>{params.row.basic.domain || ''}</div>;
                    }
                },
                {
                    title: that.$t('route.pathMatch'),
                    searchable: true,
                    render(h, params) {
                        return (
                            <div>
                                {params.row.basic.path_filter
                                    ? JSON.stringify(params.row.basic.path_filter)
                                    : ''}
                            </div>
                        );
                    }
                },
                {
                    title: that.$t('route.method'),
                    searchable: true,
                    render(h, params) {
                        return <div>{params.row.basic.method || ''}</div>;
                    }
                },
                {
                    title: that.$t('route.headerMatch'),
                    searchable: true,
                    render(h, params) {
                        return (
                            <div>
                                {params.row.basic.header_filters
                                    ? JSON.stringify(params.row.basic.header_filters)
                                    : ''}
                            </div>
                        );
                    }
                },
                {
                    title: that.$t('route.modelMatch'),
                    render(h, params) {
                        return (
                            <div>
                                {params.row.basic.model_filter
                                    ? JSON.stringify(params.row.basic.model_filter)
                                    : ''}
                            </div>
                        );
                    }
                },
                {
                    title: that.$t('route.action'),
                    key: 'name',
                    searchable: true
                },
                {
                    title: this.$t('com.operation'),
                    width: 200,
                    key: 'operator',
                    renderHeader(h) {
                        return h(
                            'div',
                            {
                                style: {
                                    display: 'inline-block'
                                }
                            },
                            [
                                h('span', that.$t('com.operation')),
                                h(
                                    'tooltip',
                                    {
                                        props: {
                                            placement: 'top',
                                            transfer: true,
                                            maxWidth: 1000,
                                            theme: 'light'
                                        }
                                    },
                                    [
                                        <i
                                            class="el-icon-s-opportunity"
                                            style="color:#409eff; margin:0 3px;"
                                        ></i>,
                                        h(
                                            'span',
                                            {
                                                slot: 'content'
                                            },
                                            that.$t('route.dragToChangeOrder')
                                        )
                                    ]
                                )
                            ]
                        );
                    },
                    render(h, params) {
                        return (
                            <div>
                                <div>
                                    {that.rulesViewBtn ? (
                                        <el-button
                                            size="mini"
                                            type="success"
                                            class="com-mini-btn"
                                            on-click={() =>
                                                that.onRulesView(params.row, params.row.index)
                                            }
                                        >
                                            {that.$t('com.view')}
                                        </el-button>
                                    ) : (
                                        ''
                                    )}
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        class="com-mini-btn"
                                        on-click={() =>
                                            that.onRuleUpdate(params.row, params.row.index)
                                        }
                                    >
                                        {that.$t('com.edit')}
                                    </el-button>
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        class="com-mini-btn"
                                        on-click={() =>
                                            that.onRuleDel(params.row, params.row.index)
                                        }
                                    >
                                        {that.$t('com.del')}
                                    </el-button>
                                </div>
                            </div>
                        );
                    }
                }
            ],
            currentIndex: -1
        };
    },
    computed: {
        getDrawerTitle() {
            if (this.mode === 'add') {
                return this.$t('route.addRouteRule');
            } else if (this.mode === 'view') {
                return this.$t('route.viewRouteRule');
            } else {
                return this.$t('route.editRouteRule');
            }
        }
    },
    watch: {
        rules: {
            handler(val) {
                if (val) {
                    this.tableData = val.map((item, index) => {
                        return {
                            ...item,
                            index: index
                        };
                    });
                }
            },
            immediate: true
        }
    },
    methods: {
        onAdd() {
            this.mode = 'add';
            this.isHiden = true;
        },
        submitForm(ruleData) {
            if (this.mode === 'add') {
                this.addRule(ruleData);
            } else {
                this.updateRule(ruleData);
            }

            this.$emit('update:forward_rules', this.tableData);
        },

        addRule(ruleData) {
            this.currentRule = {};
            const newRule = {
                index: this.tableData.length,
                ...ruleData
            };
            this.tableData.push(newRule);
            this.isHiden = false;
        },

        updateRule(ruleData) {
            this.tableData.splice(this.currentIndex, 1, ruleData);
            this.isHiden = false;
        },

        onRulesView(row, index) {
            this.mode = 'view';
            this.currentRule = { ...row };
            this.isHiden = true;
        },

        onRuleUpdate(row, index) {
            this.mode = 'edit';
            this.currentRule = { ...row };
            this.currentIndex = index;
            this.isHiden = true;
        },

        onRuleDel(row, index) {
            this.$Modal.confirm({
                title: this.$t('route.confirmDelete'),
                content: this.$t('route.deleteRuleConfirm', { name: row.name }),
                onOk: () => {
                    this.tableData.splice(index, 1);
                    this.tableData.forEach((item, idx) => {
                        this.$set(item, 'index', idx);
                    });

                    this.$emit('update:forward_rules', this.tableData);
                },
                onCancel: () => {}
            });
        }
    }
};
</script>

<style lang="less" scoped></style>
