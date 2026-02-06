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
        <h3>{{ $t('route.routeRule') }}</h3>
        <div class="item">
            <ul class="clearFloat">
                <li class="title">{{ $t('route.ruleName') }}:</li>
                <li class="value">{{ formData.name || '-' }}</li>
            </ul>
            <ul class="clearFloat">
                <li class="title">{{ $t('route.domainRule') }}:</li>
                <li class="value">{{ (formData.basic && formData.basic.domain) || '-' }}</li>
            </ul>
            <ul class="clearFloat">
                <li class="title">{{ $t('route.pathMatch') }}:</li>
                <li class="value">
                    {{
                        getMatchTypeLabel(getNestedValue(formData, 'basic.path_filter.match_mode'))
                    }}:
                    {{
                        (formData.basic &&
                            formData.basic.path_filter &&
                            formData.basic.path_filter.path) ||
                        '-'
                    }}
                </li>
            </ul>
            <ul class="clearFloat">
                <li class="title">{{ $t('route.method') }}:</li>
                <li class="value">{{ (formData.basic && formData.basic.method) || '-' }}</li>
            </ul>
            <ul class="clearFloat">
                <li class="title">{{ $t('route.headerMatch') }}:</li>
                <li class="value">
                    <div
                        v-if="
                            formData.basic &&
                            formData.basic.header_filters &&
                            formData.basic.header_filters.length
                        "
                    >
                        <div v-for="(header, index) in formData.basic.header_filters" :key="index">
                            {{ header.key }}: {{ header.value }} ({{
                                getMatchTypeLabel(header.match_mode)
                            }})
                        </div>
                    </div>
                    <div v-else>-</div>
                </li>
            </ul>
            <p style="font-size: 13px; font-weight: bold; line-height: 30px;">
                {{ $t('route.requestBodyProcessing') }}
            </p>
            <ul class="clearFloat">
                <li class="title">{{ $t('route.jsonPath') }}:</li>
                <li class="value">
                    {{
                        (formData.basic &&
                            formData.basic.model_filter &&
                            formData.basic.model_filter.pattern) ||
                        '-'
                    }}
                </li>
            </ul>
            <ul class="clearFloat">
                <li class="title">{{ $t('route.modelName') }}:</li>
                <li class="value">
                    {{
                        (formData.basic &&
                            formData.basic.model_filter &&
                            formData.basic.model_filter.name) ||
                        '-'
                    }}
                </li>
            </ul>
            <h3>{{ $t('route.actionConfig') }}</h3>
            <div class="item">
                <ul class="clearFloat">
                    <li class="title">{{ $t('route.actionType') }}:</li>
                    <li class="value">
                        {{ $t('route.forward') }}
                    </li>
                </ul>
                <ul class="clearFloat">
                    <li class="title">{{ $t('route.forwardToCluster') }}:</li>
                    <li class="value">
                        {{
                            (formData.basic &&
                                formData.basic.expect_action &&
                                formData.basic.expect_action.forward &&
                                formData.basic.expect_action.forward.cluster_name) ||
                            '-'
                        }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
    props: {
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            formData: {}
        };
    },
    watch: {
        data: {
            handler(val) {
                this.formData = cloneDeep(val);
            },
            immediate: true
        }
    },
    methods: {
        getNestedValue(obj, path) {
            const keys = path.split('.');
            let result = obj;
            for (let i = 0; i < keys.length; i++) {
                if (result == null) {
                    return undefined;
                }
                result = result[keys[i]];
            }
            return result;
        },
        getMatchTypeLabel(value) {
            const types = {
                exact_match: this.$t('route.exactMatch'),
                prefix_match: this.$t('route.prefixMatch'),
                suffix_match: this.$t('route.suffixMatch')
            };
            return types[value] || value;
        }
    }
};
</script>

<style lang="less" scoped>
.item {
    padding-left: 20px;
    margin-bottom: 20px;
}

.clearFloat {
    line-height: 30px;
    display: flex;
    font-size: 13px;
    min-height: 30px;

    .title {
        width: 150px;
        text-align: right;
        font-weight: bold;
        flex-shrink: 0;
    }

    .value {
        flex: 1;
        padding-left: 15px;
        word-break: break-all;
    }
}

h3 {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-top: 20px;
}

.detail-link {
    color: #409eff;
    cursor: pointer;
    text-decoration: underline;
}

.detail-content {
    line-height: 30px;
    pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        max-height: 400px;
        overflow-y: auto;
    }
}
</style>
