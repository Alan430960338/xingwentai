<template>
	<view class="page-wrap">
		<AppHeader title="我的" :content="userIdentityTitle"></AppHeader>



		<!-- 用户信息卡片 -->
		<view class="user-card" >
			<view class="user-avatar">
				<image v-if="avatarUrl" class="avatar-image" :src="avatarUrl" mode="aspectFill" />
				<text v-else class="avatar-text">{{ avatarText }}</text>
			</view>
			<view class="user-info">
				<view class="name-row">
					<text class="user-name">{{ displayName }}</text>
				</view>
				<text class="auth-tip">{{ authTip }}</text>
			</view>
		</view>

		<!-- 我的订单模块 -->
		<view class="order-card">
			<text class="card-title">我的订单</text>
			<view class="order-grid">
				<view class="order-item">
					<text class="order-num">2</text>
					<text class="order-label">待接单</text>
					<text class="order-sub">查看</text>
				</view>
				<view class="order-item">
					<text class="order-num">1</text>
					<text class="order-label">待开始</text>
					<text class="order-sub">查看</text>
				</view>
				<view class="order-item">
					<text class="order-num">1</text>
					<text class="order-label">进行中</text>
					<text class="order-sub">进度</text>
				</view>
				<view class="order-item">
					<text class="order-num">1</text>
					<text class="order-label">已超时</text>
					<text class="order-sub">处理</text>
				</view>
				<view class="order-item">
					<text class="order-num">6</text>
					<text class="order-label">已完成</text>
					<text class="order-sub">发票</text>
				</view>
				<view class="order-item">
					<text class="order-num">1</text>
					<text class="order-label">已取消</text>
					<text class="order-sub">详情</text>
				</view>
			</view>
		</view>

		<!-- 功能菜单列表 -->
		<view class="menu-card">
			<view class="menu-item" @click="gotoAddress">
				<view class="menu-icon orange">
					<uni-icons type="location" size="30" color="#ff9500" />
				</view>
				<view class="menu-text">
					<text class="menu-title">常用机房地址</text>
					<text class="menu-desc">管理常用机房地址</text>
				</view>
				<text class="menu-right">5 个</text>
			</view>
			<view class="divider"></view>

		<!-- 	<view class="menu-item" @click="gotoFpInfo">
				<view class="menu-icon green">
					<uni-icons type="paper" size="30" color="#34c759" />
				</view>
				<view class="menu-text">
					<text class="menu-title">发票信息</text>
					<text class="menu-desc">管理发票抬头和开票信息</text>
				</view>
				<text class="menu-right">已设置</text>
			</view> -->
			<view class="divider"></view>

			<view class="menu-item" @click="gotoInvoiceManagemrnt">
				<view class="menu-icon light-blue">
					<uni-icons type="document" size="30" color="#5090ff" />
				</view>
				<view class="menu-text">
					<text class="menu-title">发票管理</text>
					<text class="menu-desc">查看开票进度和历史发票</text>
				</view>
				<text class="menu-right">查看</text>
			</view>
			<view class="divider"></view>

			<view class="menu-item">
				<view class="menu-icon peach">
					<uni-icons type="gear" size="30" color="#ffb067" />
				</view>
				<view class="menu-text" @click="">
					<text class="menu-title">售后管理</text>
					<text class="menu-desc">处理售后申请和服务评价</text>
				</view>
				<text class="menu-right">进入</text>
			</view>
			<view class="divider"></view>

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
		</view>
		<bar tabname="mine"></bar>
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue';
	import { baseUrl } from '@/api/config/config.js'
	import { getUserInfo } from '@/api/user.js'
	import bar from '@/components/tabBer/index.vue'
	import AppHeader from '@/components/header.vue'
	import {
		onShow
	} from '@dcloudio/uni-app';

	const userInfo = ref({})
	const profileInfo = ref({})

	onShow(async () => {
		userInfo.value = uni.getStorageSync('userinfo')
		await fetchUserInfo()
	})

	const userIdentityTitle = computed(() => '个人账户')
	const displayName = computed(() => profileInfo.value?.nickname || userInfo.value?.nickname || userInfo.value?.username || '未设置名称')
	const authTip = computed(() => '普通用户账户')
	const avatarText = computed(() => (displayName.value || '').slice(0, 1) || '我')
	const avatarUrl = computed(() => {
		const avatar = profileInfo.value?.avatar
		if (!avatar) {
			return ''
		}

		if (/^https?:\/\//.test(avatar)) {
			return avatar
		}

		const apiOrigin = baseUrl.replace(/\/api\/?$/, '')
		return `${apiOrigin}${avatar}`
	})

	const fetchUserInfo = async () => {
		try {
			const res = await getUserInfo()
			if (res.code !== 1) {
				return
			}

			profileInfo.value = res.data || {}
		} catch (error) {
			profileInfo.value = {}
		}
	}


	//本地缓存信息示例:
	// {
	// 	"type": "object",
	// 	"data": {
	// 		"id": 1,
	// 		"group_id": 1,
	// 		"username": "admin",
	// 		"nickname": "admin",
	// 		"mobile": "13000000000",
	// 		"avatar": "/assets/img/avatar.png",
	// 		"score": 0,
	// 		"token": "880fe9bd-51f8-42fb-a818-f4ee8816d124",
	// 		"user_id": 1,
	// 		"createtime": 1784518820,
	// 		"expiretime": 1787110820,
	// 		"expires_in": 2592000
	// 	}
	// }
	const gotoAddress = () => {
		uni.navigateTo({
			url: '/pages/user/address/address'
		})
	}
	const gotoInvoiceManagemrnt = () => {
		uni.navigateTo({
			url: '/pages/user/order/invoceManagement'
		})
	}
	const gotoFpInfo = () => {
		uni.navigateTo({
			url: '/pages/user/order/invoceManagement'
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
		width: 750rpx;
		min-height: 100vh;
		background-color: #f0f7ff;
		box-sizing: border-box;
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
		align-items: center;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
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
		overflow: hidden;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
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
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
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
