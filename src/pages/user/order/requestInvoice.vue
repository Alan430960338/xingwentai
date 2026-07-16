<template>
	<view class="page-wrap">
		<AppHeader title="发票申请" content="申请开票" :back="true"></AppHeader>
		<view class="form-list">
			<view class="form-item" v-for="(item, index) in invoiceData" :key="index">
				<text class="label">{{ item.label }}</text>
				<text class="value">{{ item.value }}</text>
			</view>
		</view>
		<mybtn text="提交申请" type="primary" style="position: absolute; bottom: 30rpx; left: 30rpx;right: 30rpx;"></mybtn>
	</view>
</template>

<script setup>
	import AppHeader from '@/components/header.vue'
	import mybtn from '@/components/button/btmBtn.vue'


	// 模拟发票数据
	const invoiceData = [{
			label: '发票类型',
			value: '增值税普通发票'
		},
		{
			label: '发票抬头',
			value: '杭州文泰科技园有限公司'
		},
		{
			label: '税号',
			value: '91330108MA****77'
		},
		{
			label: '开票金额',
			value: '¥1,680'
		},
		{
			label: '接收邮箱',
			value: 'finance@wentai.cn'
		}
	]
</script>

<style scoped>


	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
	}

	.form-list {
		margin: 30rpx;
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

	.bottom-btn {
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		right: 30rpx;
		text-align: center;
		background-color: #1560da;
		color: #ffffff;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		font-size: 30rpx;
	}
</style>