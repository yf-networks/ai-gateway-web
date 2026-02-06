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
/* jshint esversion: 6 */
import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import noahvRequest from 'noahv-request';
import noahvComponent from 'noahv-component';
import noahv from 'noahv-core';
import routerConfig from '@/router/router';
import NProgress from '@/utils/nprogress';
import layoutApp from '@/layout/layout';
import checkRole from '@/utils/authorize';
import { urlFormat } from '@/utils/tool';
import { i18n, loadLanguageAsync, getLang } from '@/utils/i18n';
import store from '@/utils/store';
import VueClipboard from 'vue-clipboard2';

import '@/utils/Element';
import '@/utils/request';
import '@/assets/css/main.less';
import './utils/directive';

Vue.prototype.$urlFormat = urlFormat;
Vue.prototype.$BFEProductLineId = 1;
Vue.prototype.$AdminRole = 'admin';
Vue.prototype.$ProductRole = 'product';
Vue.prototype.$store = store;
Vue.prototype.Version = '_VERSION_';

Vue.use(VueRouter);
Vue.use(noahvRequest);
Vue.use(noahvComponent);
Vue.use(VueClipboard);

Vue.prototype.$Message.config({
    top: 20,
    duration: 3
});

noahv.useLayout(layoutApp);
noahv.router(routerConfig, 'history');
noahv._router.beforeEach((to, from, next) => {
    NProgress.start();
    const lang = getLang();
    loadLanguageAsync(lang).then(() => next());
    checkRole(to, next).then(result => {
        if (result === true) {
            next();
            return;
        }
        let content = i18n.t('login.tipNotLogin');
        if (result === 'product.list') {
            content = i18n.t('login.tipSelectProductLine');
        }
        Vue.prototype.$Modal.warning({
            title: i18n.t('com.tips'),
            content: content,
            onOk: () => {
                NProgress.done();
                next({
                    name: result
                });
            }
        });
        if (result === 'illegalAccess') {
            content = i18n.t('login.tipUrlIllegal');
            result = store.getUser();
            Vue.prototype.$Modal.warning({
                title: i18n.t('com.tips'),
                content: content,
                onOk: () => {
                    NProgress.done();
                    next({
                        name: 'LoginPassword'
                    });
                }
            });
        }
    });
});
noahv._router.onError(error => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = noahv._router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        noahv._router.replace(targetPath);
    }
});
noahv._router.afterEach(() => {
    NProgress.done();
});
noahv.start('#app', '', i18n);
