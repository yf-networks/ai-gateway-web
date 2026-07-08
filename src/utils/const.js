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
/**
* 检查集群名称是否符合规范
* @param {string} value - 需要检查的集群名称
* @returns {boolean} - 返回检查结果，true表示符合规范，false表示不符合规范
*/
export function ClustersNameRegCheck(value) {
  // Define regex: must start with letter or digit, followed by letters, digits, hyphens, dots or underscores
  const reg = /^[A-Za-z0-9][A-Za-z0-9-._]{1,}$/;
  // Test input with regex and return result
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
  // Define regex for variable name validation
  // ^[_A-Za-z] - must start with underscore or letter
  // [_A-Za-z0-9]* - followed by any number of underscores, letters or digits
  const reg = /^[_A-Za-z][_A-Za-z0-9]*$/;
  // Test input with regex and return result
  return reg.test(value);
}
/**
 * 检查重命名规则的正则表达式验证函数
 * @param {string} value - 需要验证的字符串值
 * @returns {boolean} 返回验证结果，true表示符合规则，false表示不符合规则
 */
export function RedirectNameRegCheck(value) {
  // Define regex: start with letter/digit, contain letters/digits/underscores/hyphens, length 2-50
  const reg = /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,49}$/;
  // Test input with regex and return result
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
  const reg =
    /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
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
  const reg =
    /^((([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
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
  const reg =
    /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
  return reg.test(value);
}

export function UserNameRegCheck(value) {
  const reg = /^[a-zA-Z0-9\.@_-]*$/g;
  return reg.test(value);
}

export function PasswordRegCheck(value) {
  const reg =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*['"\-+=\.,~`!@#$%^&*();:])(.{3,})/;
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
  // Define regex to match one or more digits
  const reg = /^\d+$/;
  // Test input with regex and return result
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
  // Define regex to match strings containing special characters (excluding dot)
  const reg = /^(?=.*[\'\"-+=,~`!@#\$%\^&\*\(\);:])/;
  // Test input with regex and return result
  return reg.test(value);
}
/**
 * 检查输入值是否符合描述的正则表达式要求
 * @param {string} value - 需要检查的输入值
 * @returns {boolean} - 如果输入值匹配正则表达式则返回true，否则返回false
 */
export function DescriptionRegCheck(value) {
  // Requires at least 2 characters (including Chinese, letters, digits, punctuation, etc.)
  const reg = /^.{2,}$/;
  return reg.test(value);
}

export function URLCheck(value) {
  const reg =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  return reg.test(value);
}
// Start with letter/digit, contain letters/digits/underscores/hyphens, length > 1
export function CommonNameCheck(value) {
  const reg = /^[A-Za-z0-9][A-Za-z0-9-_]{1,}$/;
  return reg.test(value);
}
/**
 * 检查输入值是否为有效的IPv4 CIDR格式
 * @param {string} value - 需要检查的字符串值
 * @returns {boolean} 如果值是有效的IPv4 CIDR格式则返回true，否则返回false
 */
/**
 * 验证输入值是否符合IPv4 CIDR格式
 * @param {string} value - 需要验证的字符串值
 * @returns {boolean} 如果值符合IPv4 CIDR格式则返回true，否则返回false
 */
export function isIpv4Cidr(value) {
  const reg =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/;
  return reg.test(value);
}

export function ipToInt(ip) {
  return (
    ip
      .split('.')
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
}

export function intToIp(int) {
  return [
    (int >>> 24) & 0xff,
    (int >>> 16) & 0xff,
    (int >>> 8) & 0xff,
    int & 0xff,
  ].join('.');
}

export function cidrToNetwork(cidr) {
  const [ip, prefix] = cidr.split('/');
  const mask = (0xffffffff << (32 - parseInt(prefix, 10))) >>> 0;
  return intToIp(ipToInt(ip) & mask);
}

export function cidrToMask(cidr) {
  const prefix = parseInt(cidr.split('/')[1], 10);
  const mask = (0xffffffff << (32 - prefix)) >>> 0;
  return intToIp(mask);
}

export function isCidrEqual(cidr1, cidr2) {
  return (
    cidrToNetwork(cidr1) === cidrToNetwork(cidr2) &&
    cidr1.split('/')[1] === cidr2.split('/')[1]
  );
}

export function isCidrContained(cidr1, cidr2) {
  const [ip1, prefix1] = cidr1
    .split('/')
    .map((v, i) => (i === 1 ? parseInt(v, 10) : v));
  const [ip2, prefix2] = cidr2
    .split('/')
    .map((v, i) => (i === 1 ? parseInt(v, 10) : v));

  if (prefix1 < prefix2) {
    return false;
  }

  const network1 = ipToInt(cidrToNetwork(cidr1));
  const network2 = ipToInt(cidrToNetwork(cidr2));
  const mask2 = (0xffffffff << (32 - prefix2)) >>> 0;

  return (network1 & mask2) === network2;
}

export function isIpv6Cidr(value) {
  const reg =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::|([0-9a-fA-F]{1,4}:)*::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:)*::[0-9a-fA-F]{1,4}|[0-9a-fA-F]{1,4}::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  return reg.test(value);
}
export const roleUndefined = -1;
export const roleProduct = 0;
export const roleAdmin = 1;
export const systemProduct = {
  name: 'AI_product',
};
export const role2name = {
  0: 'normal',
  1: 'admin',
};
