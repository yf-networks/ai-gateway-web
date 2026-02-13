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
    <div class="common-404">
        <Nv404 :title="title" :tips="tips" :href="href" />
    </div>
</template>
<script>
export default {
    name: 'common-404',
    data() {
        return {
            title: '404',
            tips: this.$t('login.tip404'),
            href: '/'
        };
    }
};
</script>
