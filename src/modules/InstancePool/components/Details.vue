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
<template>
	<div class="panel">
		<div class="panel-body">
			<div class="info-section">
				<div class="info-item">
					<span class="info-label">{{ $t('instancePool.name') }}</span>
					<span class="info-value">{{ infoData.name || '-' }}</span>
				</div>
			</div>

			<div class="table-section">
				<div class="section-title">{{ $t('instancePool.list') }}</div>
				<pageTable
					:tableData="infoData.instances"
					:columns="instanceColumns"
				/>
			</div>

			<div
				class="table-section"
				v-if="showEppInfo"
			>
				<div class="section-title">{{ $t('instancePool.eppDomainInfo') }}</div>
				<pageTable
					:tableData="eppList"
					:columns="eppColumns"
				/>
			</div>
			<div
				class="table-section"
				v-if="showEppIpInfo"
			>
				<div class="section-title">{{ $t('instancePool.eppIpList') }}</div>
				<pageTable
					:tableData="eppIpList"
					:columns="eppIpColumns"
				/>
			</div>
		</div>
		<div class="drawer-footer">
			<Button
				size="small"
				class="com-create-btn"
				type="primary"
				@click="onClose"
			>{{
                $t('com.close')
            }}</Button>
		</div>
	</div>
</template>

<script>
	import pageTable from "@/components/table/pageTable";
	export default {
		name: "Details",
		props: {
			infoData: {
				type: Object,
				default: () => ({}),
			},
		},
		components: {
			pageTable,
		},
		data() {
			return {
				tableData: [],
			};
		},
		methods: {
			onClose() {
				this.$emit("close");
			},
		},
		computed: {
			eppServer() {
				return (this.infoData && this.infoData.epp_server) || {};
			},
			showEppInfo() {
				const epp = this.eppServer;
				return !!epp.domain;
			},
			showEppIpInfo() {
				const epp = this.eppServer;
				return !!(epp.endpoints && epp.endpoints.length > 0);
			},
			eppList() {
				const epp = this.eppServer;
				if (epp.domain) {
					return [
						{
							domain: epp.domain,
							port: epp.port || "",
						},
					];
				}
				return [];
			},
			eppIpList() {
				const epp = this.eppServer;
				if (epp.endpoints && epp.endpoints.length > 0) {
					return epp.endpoints.map(function (item) {
						return {
							ip: item.ip || "-",
							port: item.port || "",
						};
					});
				}
				return [];
			},
			instanceColumns() {
				return [
					{
						title: this.$t('instancePool.machineOrDomain'),
						key: "hostname",
						sortable: "custom",
						ellipsis: true,
						render: function (h, params) {
							var hostname = params.row.hostname || "";
							if (hostname.length > 22) {
								var hostnameDetail = hostname.slice(0, 19) + "...";
								return h("div", [
									h("span", {}, [
										h(
											"Tooltip",
											{
												props: {
													placement: "right-end",
													transfer: true,
												},
											},
											[
												hostnameDetail,
												h(
													"span",
													{
														slot: "content",
														style: {
															whiteSpace: "normal",
															wordBreak: "break-all",
														},
													},
													hostname
												),
											]
										),
									]),
								]);
							} else {
								return h("div", {}, hostname);
							}
						},
					},
					{
						title: this.$t('instancePool.ipOrDomain'),
						key: "ip",
						sortable: "custom",
					},
					{
						title: this.$t('instancePool.port'),
						key: "port",
						sortable: "custom",
						render: function (h, params) {
							return h("div", params.row.ports["Default"] || "-");
						},
					},
					{
						title: this.$t('instancePool.tags'),
						key: "tags",
						sortable: "custom",
						render: function (h, params) {
							return h("div", JSON.stringify(params.row.tags) || "-");
						},
					},
					{
						title: this.$t('instancePool.weight'),
						key: "weight",
						sortable: "custom",
					},
				];
			},
			eppColumns() {
				var epp = this.eppServer;
				if (epp.domain) {
					return [
						{
							key: "domain",
							title: this.$t('domain.name'),
						},
						{
							key: "port",
							title: this.$t('instancePool.port'),
						},
					];
				}
				return [
					{
						key: "domain",
						title: this.$t('instancePool.ipAddress'),
					},
					{
						key: "port",
						title: this.$t('instancePool.port'),
					},
				];
			},
			eppIpColumns() {
				return [
					{
						key: "ip",
						title: this.$t('instancePool.ipAddress'),
					},
					{
						key: "port",
						title: this.$t('instancePool.port'),
					},
				];
			},
		},
	};
</script>

<style lang="less" scoped>
	.panel {
		background-color: #f5f7fa;
		min-height: 100%;
		padding-bottom: 60px;
	}

	.panel-body {
		background-color: #fff;
		padding: 24px;
	}

	.info-section {
		margin-bottom: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid #e8e8e8;
	}

	.info-item {
		display: flex;
		align-items: center;
		margin-bottom: 12px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.info-label {
		font-size: 14px;
		margin-right: 16px;
		width: 100px;
		text-align: right;
	}

	.info-value {
		color: #303133;
		font-size: 14px;
		font-weight: 500;
		flex: 1;
	}

	.table-section {
		margin-bottom: 24px;

		&:last-child {
			margin-bottom: 0;
		}

		.section-title {
			color: #606266;
			font-size: 14px;
			font-weight: 500;
			margin-bottom: 12px;
			padding-left: 12px;
			border-left: 3px solid #409eff;
		}
	}
</style>
