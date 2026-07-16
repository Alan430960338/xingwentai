<template>
	<view class="page-wrap">
		<AppHeader title="公司审核" content="公司审核" :back=2></AppHeader>
		<!-- 顶部提示栏 -->
		<view class="tip-box">
			<text class="tip-text">营业执照、对公账户、联系人等信息通过后即可使用公司派工。</text>
		</view>

		<!-- 基础信息表单 -->
		<view class="form-list">
			<view class="form-item" v-for="(item, index) in baseInfo" :key="index">
				<text class="label">{{ item.label }}</text>
				<text class="value">{{ item.value }}</text>
			</view>

			<!-- 证书上传区域 -->
			<view class="upload-wrap">
				<view class="upload-row">
					<view class="upload-add">
						<text class="add-icon">+</text>
					</view>
				</view>
			</view>
		</view>


		<!-- 提交按钮 -->
		<btnBtn style="position: absolute;left: 30rpx;right: 30rpx;bottom: 30rpx;" text="提交" type="primary">立即提交</btnBtn>
	</view>
</template>

<script setup>
	import AppHeader from '@/components/header.vue'
	import btnBtn from '@/components/button/btmBtn.vue'
	// 模拟基础信息数据
	const baseInfo = [{
			label: '公司名称',
			value: '新文泰运维服务商优先服务公司'
		},
		{
			label: '统一社会信用代码',
			value: '654546456MAS58'
		},
		{
			label: '负责人',
			value: '刘总'
		},
		{
			label: '服务区域',
			value: '杭州 / 绍兴 / Jiaxing'
		},
	]
</script>

<style scoped>
	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		padding: 0 0rpx 120rpx;
		box-sizing: border-box;
	}

	/* 顶部提示框 */
	.tip-box {
		background-color: #fff8ed;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: 0 30rpx 30rpx; 
		border: 1rpx solid #ffd49a;
	}

	.tip-text {
		font-size: 26rpx;
		color: #945c00;
		line-height: 48rpx;
	}

	/* 表单列表 */
	.form-list {
		margin: 0 30rpx;
		width: 100%;
	}

	.form-item {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	}

	.label {
		font-size: 28rpx;
		color: #888;
		display: block;
		margin-bottom: 12rpx;
	}

	.value {
		font-size: 30rpx;
		color: #111;
		font-weight: 500;
	}

	/* 证书上传模块 */
	.upload-wrap {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 36rpx 32rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	}

	.upload-row {
		display: flex;
	}

	.upload-card {
		
		width: 160rpx;
		height: 160rpx;
		background: #d8e3f2;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 24rpx;
	}

	.upload-card-text {
		font-size: 36rpx;
		color: #fff;
	}

	.upload-add {
		width: 160rpx;
		height: 160rpx;
		border: 2rpx dashed #94c0ff;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-icon {
		font-size: 60rpx;
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

	.submit-btn {
		background: #007aff;
		color: #fff;
		font-size: 30rpx;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		/* 文字垂直居中 */
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>