<template>
	<view class="page-wrap">
		<AppHeader title="发票管理" content="发票管理" :back="true"></AppHeader>
		<!-- 顶部标签切换 -->
		<view class="tab-switch">
			<view class="tab-item" :class="{ active: currentTab === 'ing' }" @click="currentTab = 'ing'">
				<text>开票中</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 'done' }" @click="currentTab = 'done'">
				<text>已开票</text>
			</view>
		</view>

		<!-- 工单列表 -->
		<view class="list-wrap">
			<!-- 工单详情卡片 -->
			<view class="order-card">
				<view class="order-title-row">
					<text class="order-title">机房精密空调告警维修</text>
					<view class="order-tag">
						<text class="tag-text">待派单</text>
					</view>
				</view>

				<view class="order-title-row-tag">
					<div class="tag1">
						SLA <span>4</span>小时
					</div>

					<div class="tag2">
						机房空调
					</div>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务地址</text>
					<text class="info-value">杭州市滨江区江南大道 88 号数康中心</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务时间</text>
					<text class="info-value">06-18 09:30</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">联系人</text>
					<text class="info-value">王经理 138****5521</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务商</text>
					<text class="info-value">杭州维保服务有限公司</text>
				</view>

				<div class="line-container">
					<div class="bottom-line" />
					<div class="bottom-line" />
					<div class="bottom-line" />
					<div class="bottom-line" />
				</div>
				<div class="totle-price">
					<view>
						￥<span class="price">8,600.00</span>
					</view>
					<view style="display: flex;">

						<div class="item-btn" @click.stop="invoice">
							查看
						</div>
					</view>

				</div>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import AppHeader from '@/components/header.vue'
	// 当前激活标签
	const currentTab = ref('ing')

	// 模拟工单数据
	const orderData = ref([{
			title: '机房精密空调告警维修',
			status: 'ing',
			statusText: '开票中',
			tagClass: 'blue-tag',
			address: '杭州市滨江区江南大道 88 号数据中心 3F',
			startTime: '06-18 09:30',
			duration: '预计 4 小时',
			contact: '王经理 138****5621',
			supplier: '新文泰运维服务商',
			price: '¥1,680',
			btnClass: 'solid-btn'
		},
		{
			title: '机房精密空调告警维修',
			status: 'done',
			statusText: '已开票',
			tagClass: 'green-tag',
			address: '杭州市滨江区江南大道 88 号数据中心 3F',
			startTime: '06-18 09:30',
			duration: '预计 4 小时',
			contact: '王经理 138****5621',
			supplier: '新文泰运维服务商',
			price: '¥1,680',
			btnClass: 'outline-btn'
		}
	])

	// 根据标签筛选列表
	const filterList = computed(() => {
		return orderData.value.filter(item => item.status === currentTab.value)
	})
</script>

<style scoped>


	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		box-sizing: border-box;
	}

	/* 顶部切换标签 */
	.tab-switch {
		margin: 0 30rpx 30rpx;
		display: flex;
	}

	.tab-item {
		padding: 16rpx 50rpx;
		border-radius: 60rpx;
		background: #fff;
		font-size: 34rpx;
		color: #667085;
		margin-right: 24rpx;
	}

	.tab-item.active {
		background: #e8f3ff;
		color: #007aff;
		border: 1rpx solid #bcdbff;
	}

	/* 工单卡片 */
	.order-card {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin: 0 30rpx;
	}

	.tag1 {
		font-size: 20rpx;
		background-color: #eaf1fc;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		text-align: center;
		color: #1265d9;
		border: 1rpx solid #c1d7f5;
		margin-right: 10rpx;
	}

	.tag2 {
		font-size: 20rpx;
		background-color: #eaf7f2;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		text-align: center;
		border: 1rpx solid #c1d7f5;
		color: #12a96a;
	}

	.order-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}

	.order-title-row-tag {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.order-title {
		font-size: 30rpx;
		color: #1d2939;
		font-weight: 600;
	}

	.order-tag {
		background-color: #fff7e6;
		border-radius: 20rpx;
		padding: 6rpx 12rpx;
		font-size: 20rpx;
	}

	.tag-text {
		font-size: 20rpx;
		color: #ff7d00;
	}

	.order-info-row {
		margin-bottom: 18rpx;
		border-bottom: 1rpx dashed #e5edf7;
		padding-bottom: 15rpx;
		display: flex;
		justify-content: space-between;
	}

	.info-label {
		font-size: 20rpx;
		color: #667085;
		display: block;
		margin-bottom: 6rpx;
	}

	.info-value {
		font-size: 22rpx;
		color: #1d2939;
		line-height: 32rpx;
	}

	.price {
		font-size: 28rpx;
		color: #1d2939;
		font-weight: 600;
	}

	.order-btn-row {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.order-btn {
		width: 48%;
		height: 72rpx;
		border-radius: 36rpx;
		font-size: 24rpx;
		border: none;
		background-color: #f5f7fa;
		color: #1d2939;
	}

	.order-btn.primary {
		background-color: #007aff;
		color: #ffffff;
	}

	.order-btn::after {
		border: none;
	}

	.line-container {
		display: flex;
		justify-content: space-between;
	}

	.bottom-line {
		width: 22%;
		height: 10rpx;
		border-radius: 30rpx;
		background: linear-gradient(to right, #166ae7, #12b4ca);
	}

	.totle-price {
		align-items: center;
		justify-content: space-between;
		display: flex;
		font-size: 42rpx;
		color: #0f63d4;
		margin-top: 20rpx;
		z-index: 999;
	}

	.item-btn {
		margin: 0 10rpx;
		font-size: 24rpx;
		padding: 13rpx 24rpx;
		border: 1rpx solid #007aff;
		border-radius: 20rpx;
	}


	.price {
		font-size: 42rpx;
		color: #0f63d4;

	}
</style>