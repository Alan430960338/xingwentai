<template>
	<view class="page-wrap">
		<AppHeader title="我的" content="我的"></AppHeader>

		

		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-avatar">
				<text class="avatar-text">文</text>
			</view>
			<view class="user-info">
				<view class="name-row">
					<text class="user-name">蔡徐坤</text>
					<uni-icons type="checkmarkempty" size="20" color="#007aff" />
				</view>
				<text class="auth-tip">唱跳王子 · 认证通过</text>
			</view>
		</view>


		<!-- 顶部金额统计卡片 -->
		<view class="stat-row">
			<view class="stat-item" v-for="(item, idx) in statData" :key="idx">
				<text class="stat-money">{{ item.money }}</text>
				<text class="stat-label">{{ item.label }}</text>
			</view>
		</view>


		<!-- 功能菜单列表 -->
		<view class="menu-card">
			<view class="menu-item">
				<view class="menu-icon blue">
					<uni-icons type="list" size="30" color="#007aff" />
				</view>
				<view class="menu-text" >
					<text class="menu-title">身份认证</text>
					<text class="menu-desc">完善实名认证信息</text>
				</view>
				<text class="menu-right">已通过</text>
			</view>
			<view class="divider"></view>

			<view class="menu-item" @click="qualificationCertification">
				<view class="menu-icon orange">
					<uni-icons type="location" size="30" color="#ff9500" />
				</view>
				<view class="menu-text">
					<text class="menu-title">资质认证</text>
					<text class="menu-desc">上传证书与从业资质</text>
				</view>
				<text class="menu-right">去完善</text>
			</view>
			<view class="divider"></view>

			<view class="menu-item">
				<view class="menu-icon green">
					<uni-icons type="paper" size="30" color="#34c759" />
				</view>
				<view class="menu-text">
					<text class="menu-title">服务区域</text>
					<text class="menu-desc">设置您的服务范围</text>
				</view>
				<text class="menu-right">杭州、绍兴</text>
			</view>

			<view class="menu-item" @click="gotoServiceCenter">
				<view class="menu-icon pale-blue">
					<uni-icons type="email" size="30" color="#82aaff" />
				</view>
				<view class="menu-text">
					<text class="menu-title">联系客服</text>
					<text class="menu-desc">专属客服为您服务</text>
				</view>
				<text class="menu-right">9:00-18:00</text>
			</view>

			<view class="divider"></view>

			<view class="menu-item" @click="gotoSkillTags">
				<view class="menu-icon light-blue">
					<uni-icons type="document" size="30" color="#5090ff" />
				</view>
				<view class="menu-text">
					<text class="menu-title">技能标签</text>
					<text class="menu-desc">管理您的技能标签</text>
				</view>
				<text class="menu-right">监控</text>
			</view>
			<view class="divider"></view>

			<view class="menu-item" @click="uploadCase">
				<view class="menu-icon peach">
					<uni-icons type="gear" size="30" color="#ffb067" />
				</view>
				<view class="menu-text">
					<text class="menu-title">服务案例上传</text>
					<text class="menu-desc">上传施工案例和现场图片</text>
				</view>
				<text class="menu-right">上传</text>
			</view>
			<view class="divider"></view>

			<view class="menu-item" @click="">
				<view class="menu-icon pale-blue">
					<uni-icons type="email" size="30" color="#82aaff" />
				</view>
				<view class="menu-text">
					<text class="menu-title">收款账户</text>
					<text class="menu-desc">设置收款账户信息</text>
				</view>
				<text class="menu-right">已绑定</text>
			</view>
		</view>
		<bar tabname="mine"></bar>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import bar from '@/components/tabBer/engineer.vue'
	import AppHeader from '@/components/header.vue'
	const gotoInvoiceManagemrnt = () => {
		uni.navigateTo({
			url: '/pages/user/order/invoceManagement'
		})
	}
	const qualificationCertification = () => {
		uni.navigateTo({
			url: '/pages/engineer/certification/qualificationCertification'
		})
	}

	const gotoAddress = () => {
		uni.navigateTo({
			url: '/pages/user/address/address'
		})
	}
	const gotoServiceCenter = () => {
		uni.navigateTo({
			url: '/pages/engineer/serviceCenter/serviceCenter'
		})
	}

	const gotoSkillTags = () => {
		uni.navigateTo({
			url: '/pages/engineer/tag/skillTags'
		})
	}
	const uploadCase = () => {
		uni.navigateTo({
			url: '/pages/engineer/order/serviceCase'
		})
	}



	const statData = ref([{
			money: '96%',
			label: '资料完整度'
		},
		{
			money: '4.9',
			label: '服务评分'
		},
		{
			money: '18',
			label: '本月接单'
		},
	])
</script>

<style scoped>

	.page-wrap {
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		box-sizing: border-box;
	}
	/* 顶部统计三栏 */
	.stat-row {
		
		margin: 0 30rpx 30rpx;
		display: flex;
	}

	.stat-item {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		width: 31%;
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx 0;
		text-align: center;
		margin-right: 3.5%;
	}

	.stat-item:last-child {
		margin-right: 0;
	}

	.stat-money {
		font-size: 38rpx;
		color: #0052cc;
		font-weight: 600;
		display: block;
	}

	.stat-label {
		font-size: 26rpx;
		color: #667085;
		display: block;
		margin-top: 12rpx;
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
		margin-right: 480rpx;
		color: #fff;
		margin-bottom: 40rpx;
		margin-top: 40rpx;
	}


	/* 用户头部卡片 */
	.user-card {
		margin: 0 30rpx 30rpx;
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		display: flex;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		align-items: center;
	}

	.user-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 24rpx;
		background: linear-gradient(135deg, #007aff, #00c9cc);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 32rpx;
	}

	.avatar-text {
		font-size: 46rpx;
		color: #fff;
		font-weight: bold;
	}

	.name-row {
		display: flex;
		align-items: center;
	}

	.user-name {
		font-size: 32rpx;
		color: #1d2939;
		font-weight: 600;
		margin-right: 12rpx;
	}

	.auth-tip {
		font-size: 26rpx;
		color: #667085;
		display: block;
		margin-top: 8rpx;
	}

	/* 订单模块 */
	.order-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		margin: 0 30rpx 30rpx;
	}

	.card-title {
		font-size: 36rpx;
		color: #1d2939;
		font-weight: 600;
		display: block;
		margin-bottom: 36rpx;
	}

	.order-grid {
		display: flex;
		flex-wrap: wrap;
	}

	.order-item {
		width: 30%;
		text-align: center;
		box-sizing: border-box;
		background: #f5f9ff;
		border: 1rpx solid #e3ecf6;
		border-radius: 20rpx;
		padding: 32rpx 0;
		margin-bottom: 24rpx;
		margin-right: 5%;
	}

	/* 每行第三个清除右边距 */
	.order-item:nth-child(3n) {
		margin-right: 0;
	}

	.order-num {
		font-size: 32rpx;
		color: #007aff;
		font-weight: 600;
		display: block;
	}

	.order-label {
		font-size: 30rpx;
		color: #1d2939;
		display: block;
	}

	.order-sub {
		font-size: 26rpx;
		color: #667085;
	}

	/* 菜单列表卡片 */
	.menu-card {
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		margin: 0 30rpx;
		margin-bottom: 120rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
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
</style>