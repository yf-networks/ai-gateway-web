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
 /**
 * @file config for proxy, useful only in dev.
 *
 * The dev server is using http-proxy-middleware for proxying,
 * so you can refer to its docs for detailed usage.
 * see https://github.com/chimurai/http-proxy-middleware for documentation.
 */
// eslint-disable-next-line no-undef
module.exports = {
    proxy: {
        // proxy all requests starting with /proxy to target,
        // use ** or / will proxy all requests starting with any string，include static file.
        // proxy useful only while path exist && option.target is exist
        path: ['/open-api/v1'],
        option: {
            target: 'http://172.18.1.196:8183',
            // changes the origin of the host header to the target URL
            changeOrigin: true,
            // object, adds request headers. (Example: {Cookie:'mycookie'})
            headers: {
                // if target url need auth
                // get cookie by visit the target url
                Cookie: false
            }
        }
    }
};
