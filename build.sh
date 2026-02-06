#
# Copyright (c) 2021 The BFE Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#/
#!/bin/sh

version=`cat version.txt`
echo 'version: ' $version
sed -i "s/_VERSION_/$version/g" index.html
sed -i "s/_VERSION_/$version/g" src/main.js

CUR_DIR=$(cd `dirname $0`; pwd)

# prepare
if [ -d $CUR_DIR/output ]; then
    rm -rf $CUR_DIR/output
fi

if [ -d $CUR_DIR/noahv ]; then
    rm -rf $CUR_DIR/noahv
fi

echo "install node_module"
npm install --registry https://registry.npm.taobao.org

# build
echo "npm build start"

node configs/build.js

if [ $? -ne 0 ]; then
    echo "build failed!"
    exit 1;
fi
echo "npm build success"

echo "pack start"
rm  noahv/static/#/#.gz
cp version.txt noahv/
cp -r docs noahv/
cp -r README.md noahv/
mkdir output
mv noahv "ai-gateway-web_${version}"
mv "ai-gateway-web_${version}" output/
cd output
tar -czvf "ai-gateway-web_${version}.tar.gz" "ai-gateway-web_${version}"
shasum -a 256 "ai-gateway-web_${version}.tar.gz" > "ai-gateway-web_${version}_checksums.txt"
rm -rf "ai-gateway-web_${version}"
echo "pack success"

echo "build success"
exit 0;