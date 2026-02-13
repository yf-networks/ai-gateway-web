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
    <div class="ai-route-rules-container">
        <div class="action-bar">
            <Button
                size="small"
                type="primary"
                class="submit-button"
                :loading="isSubmitting"
                @click="submitRules"
            >
                {{ $t('com.submitAndEffect') }}
            </Button>
        </div>
        <Tabs v-model="activeTab">
            <TabPane :label="$t('aiRouteRules.rulesList')" name="rule">
                <Rules :rules="rules" @update:forward_rules="handleRulesUpdate" />
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import Rules from './Rules';
import { cloneDeep } from 'lodash';

export default {
    name: 'AIRouteRules',
    components: {
        Rules
    },

    data() {
        return {
            activeTab: 'rule',
            rules: [],
            draftRules: [],
            isSubmitting: false
        };
    },

    mounted() {
        this.fetchRules();
    },

    methods: {
        handleRulesUpdate(updatedRules) {
            this.draftRules = cloneDeep(updatedRules);
        },

        submitRules() {
            this.isSubmitting = true;
            this.$request({
                url: this.$urlFormat('products/{product_name}/ai-route-rules'),
                method: 'patch',
                openapi: true,
                data: {
                    rules: this.draftRules
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        this.$Message.success(this.$t('com.tipSubmitSucc'));
                        this.fetchRules();
                    }
                })
                .catch(error => {
                    console.error('提交规则失败:', error);
                    this.$Message.error(this.$t('aiRouteRules.submitFailed'));
                })
                .finally(() => {
                    this.isSubmitting = false;
                });
        },

        fetchRules() {
            this.$request({
                url: this.$urlFormat('products/{product_name}/ai-route-rules'),
                method: 'get',
                openapi: true
            })
                .then(response => {
                    if (response.status === 200) {
                        this.rules = response.data.Data || [];
                        this.draftRules = cloneDeep(this.rules);
                    }
                })
                .catch(error => {
                    console.error('获取规则失败:', error);
                });
        }
    }
};
</script>

<style lang="less" scoped>
.ai-route-rules-container {
    .action-bar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 16px;
    }
}
</style>
