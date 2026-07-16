<template>
	<view class="page-wrap">
		<AppHeader title="企业资料" content="企业资料" :back="true"></AppHeader>
		<view class="form-list">
			<view class="form-item" v-for="(item, index) in invoiceData" :key="index">
				<text class="label">{{ item.label }}</text>
				<text class="value">{{ item.value }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import AppHeader from '@/components/header.vue'


	const invoiceData = [{
			label: '企业名称',
			value: '某某公司'
		},
		{
			label: '联系人',
			value: '蔡徐坤'
		},
		{
			label: '联系电话',
			value: '17356969946'
		},
		{
			label: '同意社会信用代码',
			value: 'IYGHUIASYHU'
		},
		{
			label: '认证状态',
			value: '未认证'
		}
	]
</script>

<style scoped>

	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		box-sizing: border-box;
	}

	.form-list {
		margin: 0 30rpx;
	}

	.form-item {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx 20rpx;
		margin-bottom: 24rpx;
	}

	.label {
		font-size: 28rpx;
		color: #888;
		display: block;
		margin-bottom: 12rpx;
	}

	.value {
		font-size: 28rpx;
		color: #111;
		font-weight: 500;
	}
</style>