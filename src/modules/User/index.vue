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
        <Tabs v-model="nameValue">
            <TabPane name="User" :label="$t('user.ordinaryUser')">
                <User v-if="nameValue === 'User'" />
            </TabPane>
            <TabPane name="Token" :label="$t('user.innerUser')">
                <Token v-if="nameValue === 'Token'" />
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import User from './components/User.vue';
import Token from './components/Token.vue';
export default {
    name: 'instancePools',
    components: {
        User,
        Token
    },

    data() {
        return {
            nameValue: 'User'
        };
    }
};
</script>
