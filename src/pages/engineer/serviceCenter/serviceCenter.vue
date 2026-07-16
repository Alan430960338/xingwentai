<template>
	<view class="page-wrap">
		    <AppHeader title="客服中心" content="客服中心" :back="true"></AppHeader>
		
		<!-- 顶部提示栏 -->
		<view class="tip-box">
			<text class="tip-text">如遇机房门禁或客户不在场，建议立即联系平台协调。</text>
		</view>
		
		<!-- 功能菜单列表 -->
		<view class="menu-card">
			<view class="menu-item">
				<view class="menu-icon blue">
					<uni-icons type="list" size="30" color="#007aff" />
				</view>
				<view class="menu-text" @click="">
					<text class="menu-title">在线客服</text>
					<text class="menu-desc">工单与付款问题</text>
				</view>
				<text class="menu-right">立即咨询</text>
			</view>
			<view class="divider"></view>

			<view class="menu-item">
				<view class="menu-icon orange">
					<uni-icons type="location" size="30" color="#ff9500" />
				</view>
				<view class="menu-text" @click="">
					<text class="menu-title">客服电话</text>
					<text class="menu-desc">工作日9:00-18:00</text>
				</view>
				<text class="menu-right">400-800-6636</text>
			</view>
			<view class="divider"></view>

			<view class="menu-item">
				<view class="menu-icon green">
					<uni-icons type="paper" size="30" color="#34c759" />
				</view>
				<view class="menu-text">
					<text class="menu-title">常见问题</text>
					<text class="menu-desc">报修/支付/开票</text>
				</view>
				<text class="menu-right">查春</text>
			</view>
			<view class="divider"></view>

			<view class="menu-item">
				<view class="menu-icon light-blue">
					<uni-icons type="document" size="30" color="#5090ff" />
				</view>
				<view class="menu-text" @click="">
					<text class="menu-title">投诉与建议</text>
					<text class="menu-desc">提交平台工单</text>
				</view>
				<text class="menu-right">提交</text>
			</view>

			
		</view>
	</view>
</template>

<script setup>
import AppHeader from '@/components/header.vue'
</script>

<style scoped>
	.page-wrap {
		min-height: 100vh;
		width: 750rpx;
		box-sizing: border-box;
		background-color: #eef5fb;
	}
	/* 菜单列表卡片 */
	.menu-card {
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		margin: 0 30rpx 120rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	}
	
	.menu-item {
		display: flex;
		align-items: center;
		padding: 30rpx 30rpx;
	}
	
	.divider {
		width: calc(100% - 80rpx);
		height: 1rpx;
		background: #e8edf7;
		margin-left: 40rpx;
	}
	
	.menu-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 32rpx;
	}
	
	.menu-icon.blue {
		background: #e8f3ff;
	}
	
	.menu-icon.orange {
		background: #fff2e6;
	}
	
	.menu-icon.green {
		background: #e6f9ef;
	}
	
	.menu-icon.light-blue {
		background: #e8f1ff;
	}
	
	.menu-icon.peach {
		background: #fff7e6;
	}
	
	.menu-icon.pale-blue {
		background: #f0f5ff;
	}
	
	.menu-text {
		flex: 1;
	}
	
	.menu-title {
		font-size: 30rpx;
		color: #1d2939;
		display: block;
	}
	
	.menu-desc {
		font-size: 24rpx;
		color: #667085;
		display: block;
		margin-top: 6rpx;
	}
	
	.menu-right {
		font-size: 24rpx;
		color: #667085;
	}
	/* 顶部提示框 */
	.tip-box {
		background-color: #fff8ed;
		border-radius: 20rpx;
		padding: 20rpx;
		border: 1rpx solid #fed39a;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		margin: 0 30rpx 20rpx;
	}
	.tip-text {
		font-size: 24rpx;
		color: #8f5700;
		line-height: 48rpx;
	}
</style>