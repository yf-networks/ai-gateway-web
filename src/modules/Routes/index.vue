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
    <div class="routes">
        <Tabs v-model="tabValue" :animated="false" type="card" name="basRules">
            <TabPane :label="$t('route.defaultRule')" name="defaultRules">
                <DefaultUpsert
                    ref="defaultRules"
                    :clustersData="clustersData"
                    :defaultForm="routeData.default_forward_rule"
                    @submit="submitRoutes"
                />
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import { cloneDeep } from 'lodash';
import DefaultUpsert from './components/DefaultUpsert.vue';
export default {
    name: 'Routes',
    components: {
        DefaultUpsert
    },
    mounted() {
        this.getRoutes();
        this.getClusters();
    },
    data() {
        return {
            tabValue: 'defaultRules',
            oldData: {},
            routeData: {
                default_forward_rule: {}
            },
            clustersData: [],
            value: 'basRules'
        };
    },
    methods: {
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
        },

        getRoutes() {
            this.$Spin.show();
            this.routeData = {};
            this.$request({
                url: this.$urlFormat('products/{product_name}/routes'),
                method: 'get',
                openapi: true
            })
                .then(data => {
                    if (data.status === 200) {
                        if (data.data.Data && data.data.Data[0]) {
                            this.routeData = {
                                default_forward_rule: data.data.Data[0].default_route_rule
                            };
                        }
                    }
                })
                .finally(() => {
                    this.$Spin.hide();
                });
        },
        submitRoutes(data) {
            let tmpData = cloneDeep(data);
            tmpData.action = {
                forward: {
                    cluster_name: data.cluster_name
                }
            };

            this.$Spin.show();
            this.$request({
                url: this.$urlFormat('products/{product_name}/routes'),
                method: 'patch',
                openapi: true,
                data: {
                    default_forward_rule: tmpData
                }
            })
                .then(data => {
                    if (data.status === 200) {
                        this.getRoutes();
                        this.$Message.success({ content: this.$t('com.tipSubmitSucc') });
                    }
                })
                .finally(() => {
                    this.$Spin.hide();
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
    .lodingBox {
        min-height: 500px;
        position: relative;
    }
    .routes_btn {
        margin-bottom: 15px;
    }
    .routes_title {
        width: 80%;
        margin: 0 auto;
        background: #eee;
    }
    .title {
        line-height: 50px;
    }
    .content {
        padding: 3px 0px 3px 20px;
        margin-left: 20px;
        border-left: 1px solid rgba(37, 32, 32, 0.568);
        line-height: 50px;
    }
    .default {
        border-left: none;
        margin-left: 30px;
    }
    .label {
        font-weight: 500;
    }
}
</style>
