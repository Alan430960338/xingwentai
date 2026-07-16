<template>
	<view style="page-wrap">
		<AppHeader title="发起结算" content="发起结算" :back="true" :imageType=2 ></AppHeader>
		<!-- 顶部提示栏 -->
		<view class="tip-box">
			<text class="tip-text">请上传前后对比照片，并填写本次服务完成情况。</text>
		</view>

		<!-- 基础信息表单 -->
		<view class="form-list">
			<view class="form-item" v-for="(item, index) in baseInfo" :key="index">
				<text class="label">{{ item.label }}</text>
				<text class="value">{{ item.value }}</text>
			</view>

			<!-- 证书上传区域 -->
			<view class="upload-wrap">
				<text class="value">已上传 3 张</text>
				<view class="upload-row">
					<view class="upload-card">
						<text class="upload-card-text">门头</text>
					</view>
					<view class="upload-card">
						<text class="upload-card-text">设备</text>
					</view>
					<view class="upload-add">
						<text class="add-icon">+</text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-btn">提交</view>
	</view>
</template>

<script setup>
import AppHeader from '@/components/header.vue'

const baseInfo = [
  { label: '完成说明', value: '已完成精密空调检修及运行调试，设备恢复正' },
  { label: '实际工时', value: '7.5小时' },
]
</script>

<style scoped>


	.page-wrap {
		margin: 0 auto;
		background-color: #f0f7ff;
		padding-bottom: 120rpx;
		min-height: 100vh;
		width: 750rpx;
		box-sizing: border-box;
	}

	/* 顶部提示框 */
	.tip-box {
		background-color: #f2f8ff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: 0 30rpx 30rpx;
		border: 1rpx solid #bddaff;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	}
	.bottom-btn{
		position: absolute;
		left: 30rpx;
		right: 30rpx;
		margin-top: 20rpx;
		background: linear-gradient(to right,#1d73ea,#145dd7);
		color: #fff;
		padding: 20rpx;
		text-align: center;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	}
	.tip-text {
		font-size: 24rpx;
		color: #1765de;
		line-height: 48rpx;
	}

	/* 表单列表 */
	.form-list {
		margin: 0 30rpx;
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
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		background: #ffffff;
		border-radius: 20rpx;
		padding: 36rpx 32rpx;
		margin-bottom: 24rpx;
	}

	.upload-row {
		display: flex;
		margin-top: 30rpx;
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
</style>