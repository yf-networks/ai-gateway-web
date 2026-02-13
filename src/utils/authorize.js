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
// eslint-disable
import Vue from 'vue';
import { roleUndefined, roleProduct, roleAdmin, systemProduct } from './const';
import store from './store';

let excludeRoute = {
    'product.home': true
};

function handleRole(userData, role) {
    if (role === Vue.prototype.$AdminRole && userData.is_admin) {
        return roleAdmin;
    }

    return roleUndefined;
}
export default async to => {
    let meta = store.getMeta();
    if (!meta) {
        let navRsp = await Vue.prototype.$request({
            url: 'meta',
            method: 'get',
            unneedTips: true,
            withoutAuth: true
        });

        store.setMeta(navRsp.data.Data);
        meta = navRsp.data.Data;
    }
    if (to.name === 'LoginPassword') {
        return true;
    }

    let loginRoute = store.getLoginRoute();
    const userData = store.getUser();
    if (!userData) {
        return loginRoute;
    }
    const curRole = handleRole(userData, to.query.role);
    if (curRole === roleUndefined) {
        return 'illegalAccess';
    }
    // let product = store.getProduct();
    // let role = store.getCurRole();
    // if (!product) {
    //     let productName = to.params.name;
    //     if (productName && productName !== 'BFE') {
    //         let rsp = await Vue.prototype.$request({
    //             url: `products/${productName}`,
    //             method: 'get'
    //         });
    //         product = {
    //             name: rsp.data.Data.name
    //         };
    //     } else {
    //         product = {
    //             name: 'BFE'
    //         };
    //     }
    //     if (!product && role === roleUndefined && userData.is_admin) {
    //         product = systemProduct;
    //     }
    //     if (product) {
    //         store.setProduct(product);
    //     }
    // }
    // if (role === roleUndefined) {
    //     if (!product) {
    //         store.setCurRole(roleProduct);
    //         if (to.name === 'product.list') {
    //             return true;
    //         }

    //         return 'product.list';
    //     }
    //     store.setCurRole(curRole);
    // }

    if (excludeRoute[to.name]) {
        return true;
    }
    let curNav = store.findNav(to.name);
    if (!curNav) {
        return loginRoute;
    }
    return true;
};
