<!-- eslint-disable -->
<template>
    <div class="routes">
        <Button
            size="small"
            type="primary"
            class="submit"
            :loading="loading"
            @click="submitRoutes"
        >{{ $t('com.submitAndEffect') }}</Button>
        <div>
            <!-- <h3 class="title">{{ $t('com.ruleExplain') }}</h3>
            <p>{{ $t('route.tipExplain') }}</p>
            <h3 class="title">{{ $t('route.config') }}</h3> -->
            <Button size="small" type="primary" @click="addForwardRule">
                {{ $t('com.createX', { obj: $t('route.rule') }) }}
            </Button>
            <pageTable
                class="forwardRule"
                :tableData="tableData"
                :columns="columns"
                :draggable="true"
                @dragDrop="handleDragDrop"
            />
            <Drawer
                v-model="cantrolRule"
                :title="drawerTitle"
                width="60"
                :mask-closable="false"
            >
                <Upsert
                    v-if="cantrolRule"
                    :clustersData="clustersData"
                    :rulesData="currentRuleData"
                    :isAdd="isAdd"
                    @submit="submitForwardRule"
                />
            </Drawer>
        </div>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import pageTable from '@/components/table/pageTable';
import Upsert from './components/Upsert.vue';
import { notifyNavigationCancelled } from '@/utils/navigation';
import NProgress from '@/utils/nprogress';

function normalizeForwardRules(rules) {
    return (rules || []).map(item => {
        const normalized = cloneDeep(item);
        delete normalized._index;
        delete normalized._rowKey;
        return normalized;
    });
}

function serializeForwardRules(rules) {
    return JSON.stringify(normalizeForwardRules(rules));
}

export default {
    name: 'Routes',

    components: {
        pageTable,
        Upsert
    },

    beforeRouteLeave(to, from, next) {
        if (!this.hasUnsavedChanges()) {
            next();
            return;
        }
        const cancelLeave = () => {
            next(false);
            NProgress.done();
            notifyNavigationCancelled(this);
        };
        this.$Modal.confirm({
            title: this.$t('com.tips'),
            content: this.$t('route.tipUnsavedLeave'),
            onOk: () => {
                next();
            },
            onCancel: cancelLeave
        });
    },

    computed: {
        drawerTitle() {
            return this.isAdd
                ? this.$t('com.createX', { obj: this.$t('route.rule') })
                : this.$t('com.editX', { obj: this.$t('route.rule') });
        }
    },

    mounted() {
        this.getRoutes();
        this.getClusters();
    },

    data() {
        const that = this;
        return {
            loading: false,
            cantrolRule: false,
            tableData: [],
            clustersData: [],
            currentRuleData: {},
            isAdd: true,
            currentForwardRuleIndex: -1,
            savedSnapshot: null,
            columns: [
                {
                    title: this.$t('route.expression'),
                    key: 'expression',
                    searchable: true
                },
                {
                    title: this.$t('route.targetCluster'),
                    key: 'cluster_name',
                    searchable: true
                },
                {
                    title: this.$t('com.desc'),
                    key: 'description',
                    searchable: true
                },
                {
                    title: this.$t('com.operation'),
                    key: 'action',
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
                                            that.updateForwardRule(params.row);
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
                                            that.$Modal.confirm({
                                                title: that.$t('com.tips'),
                                                content: that.$t('route.tipDel'),
                                                onOk: () => {
                                                    that.delForwardRule(params.row._index);
                                                },
                                                onCancel: () => {
                                                    that.$Message.info({
                                                        content: that.$t('com.tipCancelDel')
                                                    });
                                                }
                                            });
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
        updateSavedSnapshot() {
            this.savedSnapshot = serializeForwardRules(this.tableData);
        },
        hasUnsavedChanges() {
            if (this.savedSnapshot === null) {
                return false;
            }
            return this.savedSnapshot !== serializeForwardRules(this.tableData);
        },
        handleDragDrop(a, b) {
            const tableData = cloneDeep(this.tableData);
            const tmp = tableData[b];
            tableData[b] = tableData[a];
            tableData[a] = tmp;
            this.tableData = tableData;
        },
        getClusters() {
            this.$request({
                url: 'clusters',
                method: 'get'
            }).then(data => {
                if (data.status === 200) {
                    this.clustersData = (data.data.Data || []).filter(element => element.ready);
                }
            });
        },
        getRoutes() {
            this.loading = true;
            this.$request({
                url: 'ai-route-rules',
                method: 'get'
            })
                .then(data => {
                    if (data.status === 200) {
                        const routeData = data.data.Data || {};
                        const forwardRules = routeData.forward_rules || [];
                        this.tableData = forwardRules.filter(item => item.name !== 'default');
                        this.updateSavedSnapshot();
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        addForwardRule() {
            this.cantrolRule = true;
            this.isAdd = true;
            this.currentRuleData = {};
        },
        updateForwardRule(data) {
            this.currentForwardRuleIndex = data._index;
            this.cantrolRule = true;
            this.isAdd = false;
            this.currentRuleData = data;
        },
        delForwardRule(index) {
            this.tableData.splice(index, 1);
        },
        submitForwardRule(data) {
            if (this.isAdd) {
                this.tableData.unshift(cloneDeep(data));
            } else {
                this.tableData.splice(this.currentForwardRuleIndex, 1, cloneDeep(data));
            }
            this.cantrolRule = false;
        },
        submitRoutes() {
            this.loading = true;
            this.$request({
                url: 'ai-route-rules',
                method: 'patch',
                data: {
                    forward_rules: this.tableData
                }
            })
                .then(data => {
                    if (data.status === 200) {
                        this.$Message.success({ content: this.$t('com.tipSubmitSucc') });
                        this.getRoutes();
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.routes {
    position: relative;
    min-height: 500px;

    .submit {
        position: absolute;
        right: 0;
        z-index: 998;
    }

    .title {
        line-height: 50px;
    }

    .content {
        display: inline-block;
        padding: 3px 0 3px 20px;
        margin-left: 20px;
        border-left: 1px solid rgba(37, 32, 32, 0.568);
        line-height: 32px;
    }
}
</style>
