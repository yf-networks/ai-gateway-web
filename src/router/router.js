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
export default [
    {
        component: r =>
            require.ensure(
                [],
                () => r(require('../modules/Login/loginPassword.vue')),
                'login_password'
            ),
        path: '/login',
        name: 'LoginPassword'
    },
    {
        component: r => require.ensure([], () => r(require('../layout/BaseView.vue')), 'products'),
        path: '/products/:name',
        name: 'base-view',
        redirect: {
            name: 'gslb.list'
        },
        children: [
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/GslbConfigs')), 'gslb'),
                path: 'gslb',
                name: 'gslb.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/Login/Home')), 'home'),
                path: '',
                name: 'product.home'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/InstancePool')), 'ai-pool'),
                path: 'ai-pool',
                name: 'AIPool.list'
            },
            {
                component: r =>
                    require.ensure(
                        [],
                        () => r(require('../modules/BfeInstancePool')),
                        'instance-pool'
                    ),
                path: 'instance-pool-bfe',
                name: 'AIGatewayInstancePool.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/Domains')), 'domain'),
                path: 'domain',
                name: 'Domain.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/Cert')), 'cert'),
                path: 'cert',
                name: 'cert.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/User')), 'user'),
                path: 'user',
                name: 'user.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/Clusters')), 'cluster.list'),
                path: 'cluster',
                name: 'AICluster.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/Routes')), 'router.list'),
                path: 'router',
                name: 'DefaultRouteRule.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/BfeClusters')), 'bfe-clusters'),
                path: 'bfe-clusters',
                name: 'AIGatewayCluster.list'
            },
            {
                component: r =>
                    require.ensure([], () => r(require('../modules/AIRouteRules')), 'ai-rule'),
                path: 'ai-rule',
                name: 'AdvanceRouteRule.list'
            },
            {
                component: r => require.ensure([], () => r(require('../modules/APIKey')), 'APIKey'),
                path: 'api-key',
                name: 'APIKey.list'
            }
        ]
    },
    {
        component: r => require.ensure([], () => r(require('src/layout/404')), '404'),
        path: '*'
    }
];
