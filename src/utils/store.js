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
import Vue from 'vue';
import { i18n } from '@/utils/i18n';
import { role2name, roleAdmin } from '@/utils/const';

export default {
    state: Vue.observable({
        user: null,
        meta: null,
        curRole: roleAdmin
    }),
    getUser() {
        if (this.state.user) {
            return this.state.user;
        }
        let ls = localStorage.getItem('user');
        if (ls) {
            return JSON.parse(ls);
        }
        return null;
    },
    getUserRoles() {
        let user = this.getUser();
        if (!user) {
            return [];
        }

        roles.push({ id: roleAdmin, role: i18n.t('com.sysAdminView') });

        return roles;
    },
    getLoginRoute() {
        return 'LoginPassword';
    },
    getCurRole() {
        return this.state.curRole;
    },
    getMeta() {
        return this.state.meta;
    },
    getNav() {
        return this.state.meta ? this.state.meta.nav : null;
    },
    isProductManager() {
        return this.state.curRole === 0;
    },
    findNav(routeName) {
        if (!this.state.meta || !this.state.meta.nav) {
            return null;
        }

        let role2nav = this.state.meta.nav[role2name[this.state.curRole]];
        if (!role2nav) {
            return null;
        }

        return findNav(role2nav, routeName);
    },
    setCurRole(newVal) {
        this.state.curRole = newVal;
    },
    setMeta(newVal) {
        this.state.meta = newVal;
    },
    setUserData(newVal) {
        this.state.user = {
            name: newVal.user_name,
            sessionKey: newVal.session_key,
            is_admin: newVal.is_admin
        };
        localStorage.setItem('user', JSON.stringify(this.state.user));
        this.state.curRole = roleAdmin;
    },
    removeUserData() {
        this.state.user = null;
        localStorage.removeItem('user');
    }
};

function findNav(root, id) {
    if (!root) {
        return null;
    }

    if (root.id === id) {
        return root;
    }

    let length = root.children ? root.children.length : 0;
    for (let index = 0; index < length; index++) {
        let node = findNav(root.children[index], id);
        if (node) {
            return node;
        }
    }
    return null;
}
