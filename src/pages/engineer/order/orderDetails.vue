<template>
	<view class="page-wrap">
		<AppHeader title="订单详情" content="工程师订单详情" :back="true"></AppHeader>
		<!-- 顶部进度提示框 -->
		<view class="top-tip">
			<text class="tip-text">当前进度：师傅已到场，正在检测高压保护和冷凝风机。</text>
		</view>

		<!-- 工单详情卡片 -->
		<view class="order-card" >
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
					<div class="cancel-btn">
						取消
					</div>
					<div class="edit-btn">
						修改订单
					</div>
				</view>
			
			</div>
		</view>
		<!-- 工单进度流程卡片 -->
		<view class="progress-card">
			<text class="card-title">工单进度</text>
			<view class="step-list">
				<!-- 步骤1 -->
				<view class="step-item">
					<view class="step-dot active"></view>
					<view class="step-content">
						<text class="step-title">已发布</text>
						<text class="step-desc">06-16 10:20 客户发布空调维修工单</text>
					</view>
				</view>
				<!-- 步骤2 -->
				<view class="step-item">
					<view class="step-dot active"></view>
					<view class="step-content">
						<text class="step-title">已接单</text>
						<text class="step-desc">06-16 10:36 李师傅接单</text>
					</view>
				</view>
				<!-- 步骤3 -->
				<view class="step-item">
					<view class="step-dot active"></view>
					<view class="step-content">
						<text class="step-title">已签到</text>
						<text class="step-desc">06-18 09:26 已到达数据中心</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import AppHeader from '@/components/header.vue'
</script>

<style scoped>


	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		padding: 0 0rpx 30rpx;
		box-sizing: border-box;
	}

	/* 顶部提示框 */
	.top-tip {
		margin: 0 30rpx 30rpx;
		background: #e8f3ff;
		border-radius: 20rpx;
		padding: 20rpx;
		border: 1rpx solid #1898db;
	}

	.tip-text {
		font-size: 26rpx;
		color: #0f63d4;
		line-height: 48rpx;
	}


	/* 分段进度条 */
	.progress-bar {
		display: flex;
		margin: 40rpx 0;
	}

	.progress-item {
		height: 10rpx;
		flex: 1;
		background: #e5edf7;
		border-radius: 6rpx;
		margin-right: 12rpx;
	}

	.progress-item:last-child {
		margin-right: 0;
	}

	.progress-item.fill {
		background: linear-gradient(90deg, #00b4d8, #007aff);
	}

	/* 价格与按钮区域 */
	.price-btn-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.price {
		font-size: 52rpx;
		color: #007aff;
		font-weight: 600;
	}

	.btn-outline {
		width: 200rpx;
		height: 80rpx;
		border: 2rpx solid #cce0ff;
		background: #fff;
		color: #007aff;
		font-size: 30rpx;
		border-radius: 40rpx;
	}

	.btn-outline::after {
		border: none;
	}

	/* 工单进度卡片 */
	.progress-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin: 0 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.card-title {
		font-size: 34rpx;
		color: #1d2939;
		font-weight: 600;
		display: block;
		margin-bottom: 40rpx;
	}

	.step-list {
		position: relative;
	}

	.step-item {
		display: flex;
		margin-bottom: 30rpx;
		position: relative;
	}

	.step-item:last-child {
		margin-bottom: 0;
	}

	/* 步骤竖线 */
	.step-item::before {
		content: "";
		position: absolute;
		left: 26rpx;
		top: 46rpx;
		width: 2rpx;
		height: calc(100% + 60rpx);
		background: #cce0ff;
	}

	.step-item:last-child::before {
		display: none;
	}

	.step-dot {
		width: 38rpx;
		height: 38rpx;
		border-radius: 50%;
		border: 6rpx solid #e8f3ff;
		background: #fff;
		margin-right: 30rpx;
		flex-shrink: 0;
	}

	.step-dot.active {
		background: #007aff;
	}

	.step-content {
		flex: 1;
	}

	.step-title {
		font-size: 28rpx;
		color: #1d2939;
		font-weight: 500;
		display: block;
		margin-bottom: 12rpx;
	}

	.step-desc {
		font-size: 26rpx;
		color: #667085;
	}
	
	
	/* 工单卡片 */
	.order-card {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
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
	}
	.cancel-btn {
		margin: 0 10rpx;
		font-size: 24rpx;
		padding: 13rpx 24rpx;
		border: 1rpx solid #007aff;
		border-radius: 20rpx;
	}
	
	.edit-btn{
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