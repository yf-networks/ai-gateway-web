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
        <Form ref="domainsForm" :model="domainsForm" :rules="ruleValidate" label-position="top">
            <FormItem :label="$t('domain.name')" prop="name">
                <Input
                    v-model="domainsForm.name"
                    type="text"
                    :placeholder="$t('com.tipRequiredX', { obj: $t('domain.name') })"
                    class="com-create-input"
                />
            </FormItem>
        </Form>
        <div class="drawer-footer">
            <Button size="small" type="primary" @click="submitForm('domainsForm')">
                {{ $t('com.submit') }}
            </Button>
            <Button size="small" class="com-create-btn" @click="handleReset('domainsForm')">
                {{ $t('com.reset') }}
            </Button>
        </div>
    </div>
</template>

<script>
import { DominNameRegCheck } from '@/utils/const';
export default {
    data() {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipRequiredX', { obj: this.$t('domain.name') })));
                return;
            }
            if (this.domainNames.indexOf(value) !== -1) {
                callback(
                    new Error(this.$t('com.tipAlreadyExistsX', { obj: this.$t('domain.name') }))
                );
                return;
            }
            if (!DominNameRegCheck(value)) {
                callback(new Error(this.$t('com.tipNameRule')));
                return;
            }
            if (value.length < 2) {
                callback(new Error(this.$t('com.tipLengthX', { len: 1 })));
                return;
            }
            callback();
        };
        return {
            domainsForm: {
                name: ''
            },
            ruleValidate: {
                name: [{ required: true, validator: validateName, trigger: 'blur' }]
            }
        };
    },
    props: {
        domainNames: {
            type: Array,
            required: true
        }
    },
    methods: {
        submitForm(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.$emit('submitForm', this.domainsForm);
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    }
};
</script>
