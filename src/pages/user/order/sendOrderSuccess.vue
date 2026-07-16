<template>
	<view class="page-wrap">
		<AppHeader title="发布成功" content="发布成功"   :imageType=2></AppHeader>
		<!-- 成功提示卡片 -->
		<view class="success-card">
			<view class="success-icon">
				<uni-icons type="checkmarkempty" size="20" color="#34c759" />
			</view>
			<text class="success-text">已发布至大厅</text>
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

		<!-- 底部返回首页按钮 -->
		<mybtn text="回到首页"@click="gohome" type="primary" style="position: absolute; bottom: 30rpx; left: 30rpx;right: 30rpx;"></mybtn>
	</view>
</template>

<script setup>
	import AppHeader from '@/components/header.vue'
	import mybtn from '@/components/button/btmBtn.vue'
	const gohome = ()=>{
		uni.navigateTo({
			url:'/pages/user/tabbar/index'
		})
	}
	
</script>

<style scoped>

	.page-wrap {
		background-color: #f0f7ff;
		width: 750rpx;
		box-sizing: border-box;
		padding: 0 0rpx 30rpx;
	}



	.header-row1 {
		width: 100%;
		text-align: center;
	}

	/* 移除gap，用margin-right实现圆点间距 */
	.hearder-point {
		width: 8rpx;
		height: 8rpx;
		background-color: #ffffff;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	/* 最后一个圆点清除右边距 */
	.hearder-point.last-point {
		margin-right: 0;
	}

	.hearder-point-container {
		display: flex;
		justify-content: center;
		align-items: center;
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
		background-color: #deac44;
		border: 2rpx solid #e7c67f;
		border-radius: 50%;
	}

	.page-title {
		margin-top: 40rpx;
		font-size: 38rpx;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
		color: #ffffff;
	}

	.greeting {
		font-weight: 700;
		font-size: 40rpx;
		color: #fff;
		margin-top: 40rpx;
		align-self: flex-start;
	}

	/* 成功提示卡片 */
	.success-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 60rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 30rpx 30rpx;
	}

	.success-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
		background-color: #e6f9ef;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 30rpx;
	}

	.success-text {
		font-size: 38rpx;
		color: #1d2939;
		font-weight: 500;
	}

	/* 工单卡片 */
	.order-card {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 80rpx;
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
	}

	.price {
		font-size: 42rpx;
		color: #0f63d4;
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
	/* 底部首页按钮 */
	.home-btn {
		margin-bottom: 30rpx;
		text-align: center;
		padding: 20rpx 30rpx;
		background: #007aff;
		color: #fff;
		font-size: 34rpx;
		border-radius: 20rpx;
		border: none;
	}
</style>