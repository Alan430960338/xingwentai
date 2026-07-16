<template>
	<view class="page-wrap">
		<AppHeader title="客户首页" content="上午好，文泰科技园"></AppHeader>


		<!-- 提示卡片 -->
		<view class="tip-card">
			<text class="tip-text">订单状态有变化。</text>
		</view>

		<!-- 数据卡片 -->
		<view class="data-card">
			<view class="data-item">
				<text class="data-num">12</text>
				<text class="data-label">本用提醒</text>
			</view>
			<view class="data-item">
				<text class="data-num">3</text>
				<text class="data-label">待处理</text>
			</view>
			<view class="data-item">
				<text class="data-num">¥8.6万</text>
				<text class="data-label">累计结算</text>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-grid">
			<view class="quick-item" @click="gotoSendOrder">
				<view class="quick-icon">
					<text class="icon-inner">📋</text>
				</view>
				<text class="quick-text">立即报修</text>
			</view>
			<view class="quick-item" @click="gotoOrders">
				<view class="quick-icon">
					<text class="icon-inner">🔧</text>
				</view>
				<text class="quick-text">工单管理</text>
			</view>
			<view class="quick-item" @click="gotoInvoiceManagemrnt">
				<view class="quick-icon">
					<text class="icon-inner">📑</text>
				</view>
				<text class="quick-text">发票管理</text>
			</view>
			<view class="quick-item" @click="gotoServiceCenter">
				<view class="quick-icon">
					<text class="icon-inner">📞</text>
				</view>
				<text class="quick-text">联系客服</text>
			</view>
		</view>

		<!-- 服务数据 -->
		<view class="service-data">
			<view class="service-item">
				<text class="service-num">98%</text>
				<text class="service-label">本月按时响应率</text>
			</view>
			<view class="service-item">
				<text class="service-num">16分钟</text>
				<text class="service-label">平均接单耗时</text>
			</view>
			<view class="service-item">
				<text class="service-num">4.8</text>
				<text class="service-label">服务评价</text>
			</view>
		</view>

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
				￥<span class="price">8,600.00</span>
			</div>
		</view>
		<bar tabname="home" />
	</view>
</template>

<script setup>
	import bar from '@/components/tabBer/index.vue'
	import AppHeader from '@/components/header.vue'
	const gotoInvoiceManagemrnt = () => {
		uni.navigateTo({
			url: '/pages/user/order/invoceManagement'
		})
	}
	
	
	
	const gotoSendOrder = () => {
		uni.navigateTo({
			url: '/pages/user/tabbar/sendOrder'
		})
	}
	
	const gotoOrders = () => {
		uni.navigateTo({
			url: '/pages/user/tabbar/orders'
		})
	}
	
	const gotoServiceCenter = () => {
		uni.navigateTo({
			url: '/pages/user/serviceCenter/serviceCenter'
		})
	}
</script>

<style scoped>


	.page-wrap {
		background-color: #e8f0f8;
		margin: 0 auto;
		min-height: 100vh;
		width: 750rpx;
		box-sizing: border-box;
		padding-bottom: 120rpx;
	}

	/* 状态栏 */
	.status-bar {
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}

	.time {
		font-size: 24rpx;
		color: #1d2939;
		font-weight: 500;
	}

	.status-icons {
		display: flex;
		align-items: center;
	}

	.icon-text {
		font-size: 22rpx;
		color: #1d2939;
		margin-left: 12rpx;
	}

	/* 头部信息 */

	.header-row1 {
		display: flex;
	}

	.header-section {
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 24rpx;
		height: 2cqw;
		background-color: #1781e1;
	}

	.hearder-point {
		width: 8rpx;
		height: 8rpx;
		background-color: #ffffff;
		border-radius: 50%;
	}

	.hearder-point-container {
		display: flex;
		justify-content: space-between;
		gap: 10rpx;
	}

	.headerright {
		position: absolute;
		right: 30rpx;
		top: 60rpx;
		width: 68rpx;
		height: 68rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #3a8de7;
		border: 2rpx solid #8bd4ea;
		border-radius: 50%;
	}

	.page-title {
		margin-top: 40rpx;
		font-size: 38rpx;
		color: #1d2939;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
		color: #ffffff;
	}

	.greeting {
		font-weight: 700;
		font-size: 40rpx;
		margin-right: 280rpx;
		color: #fff;
		margin-bottom: 40rpx;
		margin-top: 40rpx;
	}

	/* 提示卡片 */
	.tip-card {
		display: flex;
		align-items: center;
		background-color: #f2f8ff;
		border-radius: 20rpx;
		padding: 24rpx;
		margin: 0 30rpx;
		border: 1rpx solid #bddaff;
	}

	.tip-text {
		font-size: 22rpx;
		color: #0d4a93;
	}

	/* 数据卡片 */
	.data-card {
		border-radius: 24rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
	}

	.data-item {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		text-align: center;
		width: 200rpx;
		background-color: #ffffff;
		padding: 20rpx 0;
		border-radius: 20rpx;
	}

	.data-num {
		font-size: 32rpx;
		color: #0d4a93;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
	}

	.data-label {
		font-size: 20rpx;
		color: #667085;
	}

	/* 快捷入口 */
	.quick-grid {
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: #ffffff;
		margin: 0rpx 30rpx 0rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		padding: 20rpx;
	}

	.quick-item {
		width: 22%;
		text-align: center;
		border: 1rpx solid #e5edf7;
		padding: 10rpx 0;
		border-radius: 20rpx;
	}

	.quick-icon {
		width: 88rpx;
		height: 88rpx;
		border-radius: 20rpx;
		background-color: #e9faf5;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 12rpx;
	}

	.icon-inner {
		font-size: 44rpx;
	}

	.quick-text {
		font-size: 20rpx;
		color: #1d2939;
	}

	/* 服务数据 */
	.service-data {
		border-radius: 24rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
	}

	.service-item {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		text-align: center;
		background-color: #ffffff;
		padding: 20rpx 0;
		width: 200rpx;
		border-radius: 20rpx;
	}

	.service-num {
		font-size: 38rpx;
		color: #0d4a93;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
	}

	.service-label {
		font-size: 20rpx;
		color: #667085;
	}

	/* 工单卡片 */
	.order-card {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin: 0 30rpx 24rpx;
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
		font-size: 42rpx;
		color: #0f63d4;
		margin-top: 20rpx;
	}

	.price {
		font-size: 42rpx;
		color: #0f63d4;
	}
</style>