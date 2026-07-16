<template>
	<view class="page-wrap">
		<AppHeader title="发单" content="发布IT运维需求" :imageType=2></AppHeader>



		<!-- 表单区域 -->
		<view class="form-box">
			<!-- 项目类型 -->
			<view class="form-item">
				<text class="label">项目类型</text>
				<text class="value">监控</text>
			</view>
			<!-- 故障描述 -->
			<view class="form-item">
				<text class="label">故障描述</text>
				<text class="value">机房精密空调高压告警，出风温度异常，需现场排查冷媒、滤网和传感器。</text>
			</view>
			<!-- 服务地址 -->
			<view class="form-item">
				<text class="label">服务地址</text>
				<text class="value">杭州市滨江区江南大道 88 号数据中心 3F</text>
			</view>
			<!-- 计划开始时间 -->
			<view class="form-item">
				<text class="label">计划开始时间</text>
				<text class="value">06-18 09:30</text>
			</view>
			<!-- 预算价格 -->
			<view class="form-item">
				<text class="label">预算价格</text>
				<text class="value">¥1,680</text>
			</view>
			<!-- 响应时限 -->
			<view class="form-item">
				<text class="label">响应时限</text>
				<text class="value">4 小时内到场</text>
			</view>
			<!-- 现场联系人 -->
			<view class="form-item">
				<text class="label">现场联系人</text>
				<text class="value">王经理 138****5621</text>
			</view>

			<!-- 附件上传区域 -->
			<view class="upload-wrap">
				<text class="upload-title">工程量/设备清单（可上传附件）</text>
				<view class="upload-box">
					<text class="upload-text">上传附件</text>
				</view>
			</view>

			<!-- 发票需求 -->
			<view class="form-item arrow-item">
				<text style="font-weight: 700;">发票需求</text>
				<view class="fp-list">
					<text class="fp-item">增值税专用发票</text>
					<text class="fp-item">增值税普通发票</text>
				</view>
			</view>
		</view>

		<!-- 协议勾选 -->
		<view class="agree-row">
			<checkbox checked color="#007aff" />
			<text class="agree-text">我已阅读《平台交易规则与协议》</text>
		</view>

		<!-- 提交按钮 -->

		<mybtn text="提交"  @click="commitOrder" type="primary" 
			style="position: absolute;  left: 30rpx;right: 30rpx;"></mybtn>

		<bar tabname="sendOrder" />
	</view>
</template>

<script setup>
	import bar from '@/components/tabBer/index.vue'
	import mybtn from '@/components/button/btmBtn.vue'
	import AppHeader from '@/components/header.vue'
	const commitOrder = () => {
		uni.navigateTo({
			url: '/pages/user/order/sendOrderSuccess'
		})
	}
</script>

<style scoped>
	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f6fc;
		width: 750rpx;
		box-sizing: border-box;
		padding-bottom: 140rpx;
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
		margin-bottom: 40rpx;
		align-self: flex-start;
	}


	/* 表单通用项 */
	.form-box {
		margin: 0 30rpx;
	}

	.form-item {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		background: #fff;
		border-radius: 20rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
	}

	.arrow-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		font-size: 26rpx;
		color: #888;
		display: block;
		margin-bottom: 12rpx;
	}

	.value {
		font-size: 32rpx;
		color: #111;
	}

	.row-right {
		display: flex;
		align-items: center;
	}

	.row-right .value {
		margin-right: 12rpx;
	}

	/* 上传附件区域 */
	.upload-wrap {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		margin-bottom: 24rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
	}

	.upload-title {
		font-size: 36rpx;
		color: #111;
		font-weight: 500;
		display: block;
		margin-bottom: 20rpx;
	}

	.upload-box {
		width: 100%;
		height: 460rpx;
		border: 2rpx dashed #94c0ff;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-text {
		font-size: 36rpx;
		color: #007aff;
	}

	/* 协议勾选 */
	.agree-row {
		display: flex;
		align-items: center;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
		justify-content: center;
	}

	.agree-text {
		font-size: 28rpx;
		color: #444;
		margin-left: 16rpx;
	}

	/* 提交按钮 */
	.submit-btn {
		text-align: center;
		padding: 30rpx 30rpx;
		background: #007aff;
		color: #fff;
		font-size: 34rpx;
		border-radius: 60rpx;
		border: none;
	}

	.submit-btn::after {
		border: none;
	}

	/* 底部Tab */
	.tab-bar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 750rpx;
		height: 120rpx;
		background: #fff;
		display: flex;
		border-top: 1rpx solid #eee;
	}

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.tab-text {
		font-size: 26rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.tab-text.active {
		color: #007aff;
	}
</style>