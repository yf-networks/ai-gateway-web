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
    <div
        class="noahv-layout"
        v-if="$route.name != 'LoginPassword'"
        :class="showSidebar ? 'sidebarWidth' : ''"
    >
        <sidebar></sidebar>
        <div class="bfe-right-content">
            <headerBar @headerBar="getshowSidebar" />
            <div class="bfe-content">
                <breadCrumb />
                <div class="bfe-content-view">
                    <router-view class="routerView"></router-view>
                </div>
            </div>
        </div>
    </div>
    <div class="noahv-layout" v-else>
        <router-view></router-view>
    </div>
</template>
<script>
import breadCrumb from './sidebar/breadCrumb';
import sidebar from './sidebar/sidebar';
import headerBar from './sidebar/headerBar';
export default {
    name: 'NvHeader',

    components: {
        sidebar,
        headerBar,
        breadCrumb
    },
    data() {
        return {
            showSidebar: false
        };
    },

    methods: {
        getshowSidebar(data) {
            this.showSidebar = data;
        }
    }
};
</script>
