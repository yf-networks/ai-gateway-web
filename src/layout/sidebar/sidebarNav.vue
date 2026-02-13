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
        <Menu
            theme="dark"
            width="auto"
            class="menu_list"
            :active-name="activeName"
            @on-select="onSelect"
            v-if="navs && role2name[role]"
            :open-names="openNames"
            ref="Menu"
        >
            <navItem
                v-for="node in navs[role2name[role]].children"
                :node="node"
                :key="node.id"
                :name="node.id"
            ></navItem>
        </Menu>
    </div>
</template>

<script>
import { role2name } from '@/utils/const';
import navItem from './navItem';

export default {
    name: 'sidebarNav',
    components: {
        navItem
    },
    computed: {
        navs() {
            return this.$store.getNav();
        },
        activeName() {
            return this.$route.name;
        },
        role() {
            return this.$store.getCurRole();
        }
    },
    data() {
        return {
            role2name: role2name,
            openNames: []
        };
    },
    mounted() {
        this.openDefauleMenu();
    },
    watch: {
        role() {
            this.openDefauleMenu();
        }
    },

    methods: {
        onSelect: function (name) {
            if (this.$route.name !== name) {
                this.$router.push({
                    name: name,
                    query: {
                        role: this.$route.query.role
                    }
                });
            }
        },
        openDefauleMenu() {
            this.openNames = [];
            if (this.navs) {
                this.navs[this.role2name[this.role]].children.forEach(item => {
                    this.openNames.push(item.id);
                });
                this.$nextTick(() => {
                    this.$refs.Menu.updateOpened();
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
/deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    border-right: none;
    color: #fff;
    background: linear-gradient(
        90deg,
        rgba(59, 125, 221, 0.2),
        rgba(59, 125, 221, 0.0875) 60%,
        transparent
    ) !important;
    border-left: 3px solid #515a6e;
    border-left-color: #a0cfff !important;
}
</style>
