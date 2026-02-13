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
<!-- eslint-disable -->
<template>
    <div class="SubClusters">
        <div>
            <Button size="small" type="primary" @click="onAdd">{{
                $t('com.createX', { obj: $t('subCluster.name') })
            }}</Button>
            <Drawer
                v-model="visible"
                :title="$t('com.createX', { obj: $t('subCluster.name') })"
                width="50"
                :mask-closable="false"
            >
                <Upsert v-if="visible" :tableData="tableData" @submit="handleSubmit" />
            </Drawer>
            <ProductList ref="ProductList" @getTableData="getTableData" />
        </div>
    </div>
</template>
<script>
import ProductList from './components/ProductList';
import Upsert from './components/Upsert';
export default {
    name: 'SubClusters',

    components: {
        ProductList,
        Upsert
    },

    data() {
        return {
            visible: false,
            upsertLoading: false,
            tableData: []
        };
    },
    methods: {
        getTableData(v) {
            this.tableData = v;
        },
        onAdd() {
            this.visible = true;
        },
        handleSubmit(v) {
            this.upsertLoading = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/sub-clusters'),
                method: 'post',
                data: v
            })
                .then(data => {
                    if (data.status === 200) {
                        this.$refs.ProductList.getSubClusters();
                        this.visible = false;
                        this.$Message.success({
                            content: this.$t('com.tipAddSucc')
                        });
                    }
                })
                .finally(() => {
                    this.upsertLoading = false;
                });
        }
    }
};
</script>
