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
*//**
 * 检查集群名称是否符合规范
 * @param {string} value - 需要检查的集群名称
 * @returns {boolean} - 返回检查结果，true表示符合规范，false表示不符合规范
 */
export function ClustersNameRegCheck(value) {
    // 定义正则表达式，要求以字母或数字开头，后面可以跟字母、数字、连字符、点或下划线
    const reg = /^[A-Za-z0-9][A-Za-z0-9-._]{1,}$/;
    // 使用正则表达式测试输入值并返回结果
    return reg.test(value);
}

export function BaseClustersNameRegCheck(value) {
    const reg = /^.+$/;
    return reg.test(value);
}
/**
 * 检查变量名是否符合JavaScript命名规范
 * @param {string} value - 需要检查的变量名
 * @returns {boolean} - 如果变量名符合规范返回true，否则返回false
 */
export function VarNameRegCheck(value) {
    // 定义正则表达式，用于验证变量名
    // ^[_A-Za-z] - 必须以下划线或字母开头
    // [_A-Za-z0-9]* - 后面可以跟随任意数量的下划线、字母或数字
    const reg = /^[_A-Za-z][_A-Za-z0-9]*$/;
    // 使用正则表达式测试输入的值并返回结果
    return reg.test(value);
}/**
 * 检查重命名规则的正则表达式验证函数
 * @param {string} value - 需要验证的字符串值
 * @returns {boolean} 返回验证结果，true表示符合规则，false表示不符合规则
 */
export function RedirectNameRegCheck(value) {
    // 定义正则表达式：以字母或数字开头，可包含字母、数字、下划线和横线，长度为2-50个字符
    const reg = /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,49}$/;
    // 使用正则表达式测试输入值并返回测试结果
    return reg.test(value);
}

export function AreaNameRegCheck(value) {
    const reg = /^[a-zA-Z0-9\_-]*$/g;
    return reg.test(value);
}

export function DominNameRegCheck(value) {
    const reg = /^[a-zA-Z0-9\._-]*$/g;
    return reg.test(value);
}

export function HealthRegCheck(value) {
    const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    return reg.test(value);
}

export function ClustersNameTwoRegCheck(value) {
    const reg = /^[A-Za-z0-9][A-Za-z0-9-._]{1,255}$/;
    return reg.test(value);
}

export function PatternIPRegCheck(value) {
    const reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/;
    return reg.test(value);
}

export function ClusterNameRegCheck(value) {
    const reg = /^[0-9a-zA-Z_-]{1,}$/;
    return reg.test(value);
}

export function ClusterNameTwoRegCheck(value) {
    const reg = /^[0-9a-zA-Z#+_-]{1,}$/;
    return reg.test(value);
}

export function ClusterNameThreeRegCheck(value) {
    const reg = /^[0-9]{1,}$/;
    return reg.test(value);
}

export function ClusterNameFourRegCheck(value) {
    const reg = /^[2-5]{1,}$/;
    return reg.test(value);
}

export function MailRegCheck(value) {
    const reg = /^((([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
    return reg.test(value);
}

export function ProductNameRegCheck(value) {
    const reg = /^[0-9a-zA-Z_]{1,}$/;
    return reg.test(value);
}

export function PhoneRegCheck(value) {
    const reg = /[a-zA-Z0-9\_\-\.\#][a-zA-Z0-9\_\-\.\#\;]*/;
    return reg.test(value);
}

export function currentLimitNameRegCheck(value) {
    const reg = /[_a-zA-Z0-9]+/;
    return reg.test(value);
}

export function VIpRegCheck(value) {
    const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
    return reg.test(value);
}

export function UserNameRegCheck(value) {
    const reg = /^[a-zA-Z0-9\.@_-]*$/g;
    return reg.test(value);
}

export function PasswordRegCheck(value) {
    const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\'"-+=\.,~`!@#\$%\^&\*\(\);:])(?=.{3,})/;
    return reg.test(value);
}

export function NumRegCheck(value) {
    const reg = /^(\d*)$/;
    return reg.test(value);
}
/**
 * 检查输入值是否只包含数字
 * @param {any} value - 需要检查的输入值
 * @returns {boolean} 如果输入值只包含数字则返回true，否则返回false
 */
export function NumTwoRegCheck(value) {
    // 定义一个正则表达式，用于匹配一个或多个数字
    const reg = /^\d+$/;
    // 使用正则表达式测试输入值，并返回测试结果
    return reg.test(value);
}

export function NumThreeRegCheck(value) {
    const reg = /^[0-9]*$/;
    return reg.test(value);
}
/**
 * 检查证书名称是否包含特殊字符
 * @param {string} value - 需要检查的证书名称
 * @returns {boolean} - 如果包含特殊字符返回true，否则返回false
 */
export function CertNameRegCheck(value) {
    // 定义正则表达式，匹配包含特殊字符的字符串（不包括点号）
    const reg = /^(?=.*[\'\"-+=,~`!@#\$%\^&\*\(\);:])/;
    // 使用正则表达式测试输入值并返回结果
    return reg.test(value);
}
/**
 * 检查输入值是否符合描述的正则表达式要求
 * @param {string} value - 需要检查的输入值
 * @returns {boolean} - 如果输入值匹配正则表达式则返回true，否则返回false
 */
export function DescriptionRegCheck(value) {
    // 定义正则表达式，要求至少包含2个字母或数字
    const reg = /[a-zA-Z0-9]{2}/;
    // 测试输入值是否符合正则表达式规则，并返回结果
    return reg.test(value);
}

export function URLCheck(value) {
    const reg = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return reg.test(value);
}
// 字母或数字开头，字母、数字、下划线、中划线。长度大于1
export function CommonNameCheck(value) {
    const reg = /^[A-Za-z0-9][A-Za-z0-9-_]{1,}$/;
    return reg.test(value);
}/**
 * 检查输入值是否为有效的IPv4 CIDR格式
 * @param {string} value - 需要检查的字符串值
 * @returns {boolean} 如果值是有效的IPv4 CIDR格式则返回true，否则返回false
 *//**
 * 验证输入值是否符合IPv4 CIDR格式
 * @param {string} value - 需要验证的字符串值
 * @returns {boolean} 如果值符合IPv4 CIDR格式则返回true，否则返回false
 */
export function isIpv4Cidr(value) {
    // 定义正则表达式，用于验证IPv4 CIDR格式
    // 格式说明：xxx.xxx.xxx.xxx/xx，其中xxx是0-255的数字，xx是0-32的数字
    const reg = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/;
    // 使用正则表达式测试输入值并返回结果
    return reg.test(value);
}

export function isIpv6Cidr(value) {
    const reg = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::|([0-9a-fA-F]{1,4}:)*::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:)*::[0-9a-fA-F]{1,4}|[0-9a-fA-F]{1,4}::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    return reg.test(value);
}
export const roleUndefined = -1;
export const roleProduct = 0;
export const roleAdmin = 1;
export const systemProduct = {
    name: 'BFE'
};
export const role2name = {
    0: 'normal',
    1: 'admin'
};
