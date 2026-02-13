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
    <Breadcrumb class="bfe-breadcrumb">
        <BreadcrumbItem v-if="nav">{{ $t(`nav.${nav.text}`) }}</BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
export default {
    name: 'breadCrumb',

    computed: {
        user() {
            return this.$store.getUser();
        },
        role() {
            return this.$store.getCurRole();
        },
        nav() {
            return this.$store.findNav(this.$route.name);
        }
    }
};
</script>
