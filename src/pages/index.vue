<template>
	<view class="page-wrap">
		<!-- 顶部标题区域 -->
		<view class="title-box">
			<text class="main-title">新文泰运维</text>
			<text class="sub-title">客户、工程师、服务商一站式入口</text>
		</view>

		<!-- 登录方式卡片 -->
		<view class="login-card">
			<!-- 微信登录 -->
			<view class="login-item" @click="wxLogin">
				<view class="icon-box green">
					<uni-icons type="person" size="40" color="#fff" />
				</view>
				<text class="item-text">微信授权登录</text>
				<view class="tip-right">
					<text class="tip-text">推荐</text>
					<uni-icons type="right" size="15" color="#007aff" />
				</view>
			</view>
			<view class="divider" />

			<!-- 手机号登录 -->
			<view class="login-item" @click="gotoEngineer">
				<view class="icon-box blue">
					<uni-icons type="phone" size="30" color="#fff" />
				</view>
				<text class="item-text">手机号验证码登录</text>
				<view class="tip-right">
					<text class="tip-text">企业账号可用</text>
					<uni-icons type="right" size="15" color="#007aff" />
				</view>
			</view>
			<view class="divider" />

			<!-- 员工登录 -->
			<view class="login-item" @click="gotoService">
				<view class="icon-box orange">
					<uni-icons type="briefcase" size="30" color="#fff" />
				</view>
				<text class="item-text">公司员工登录</text>
				<view class="tip-right">
					<text class="tip-text">服务商角色</text>
					<uni-icons type="right" size="15" color="#007aff" />
				</view>
			</view>
		</view>

		<!-- 协议勾选 -->
		<view class="agree-box">
			<view class="radio" @click="change">
				<uni-icons v-if="agree" type="checkmarkempty" size="15" color="#4184eb" />
			</view>

			<text class="agree-text">登录即表示同意《用户协议》和《隐私政策》</text>
		</view>

		<!-- 登录按钮 -->
		<button class="login-btn">
			登录
		</button>

		<!-- 底部小字 -->
		<!-- <text class="bottom-desc">微信授权 / 手机号登录</text> -->
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import { login } from '@/api/user.js'

	let agree = ref(false)

	async function handleLogin(id) {
		try {
			const res = await login({ id })
			if (res.code === 1) {
				const token = res.data.userinfo.token
				uni.setStorageSync('token', token)
				uni.showToast({
					title: '登录成功',
					icon: 'success',
					duration: 1500
				})
				setTimeout(() => {
					if (id === 1) {
						uni.navigateTo({
							url: '/pages/user/tabbar/index',
						})
					} else if (id === 2) {
						uni.navigateTo({
							url: '/pages/engineer/tabbar/home',
						})
					} else if (id === 3) {
						uni.navigateTo({
							url: '/pages/serviceProvider/tabbar/workbench',
						})
					}
				}, 1500)
			} else {
				uni.showToast({
					title: res.msg || '登录失败',
					icon: 'none',
					duration: 1500
				})
			}
		} catch (error) {
			uni.showToast({
				title: '网络请求失败',
				icon: 'none',
				duration: 1500
			})
		}
	}

	function wxLogin() {
		handleLogin(1)
	}

	function gotoEngineer() {
		handleLogin(2)
	}

	function gotoService() {
		handleLogin(3)
	}

	function change() {
		agree.value = !agree.value
	}
</script>

<style scoped>
	.page-wrap {
		padding-left: 100rpx;
		padding-right: 100rpx;
		box-sizing: border-box;
		padding-top: 220rpx;
		background: linear-gradient(150deg, #0078e8 0%, #b8d8f8 100%);
		width: 750rpx;
		margin: 0 auto;
		min-height: 100vh;
	}

	/* 标题区域 */
	.title-box {
		margin-bottom: 120rpx;
		text-align: center;
	}

	.main-title {
		font-size: 46rpx;
		color: #ffffff;
		font-weight: bold;
		display: block;
		margin-bottom: 24rpx;
	}

	.sub-title {
		font-size: 28rpx;
		color: #ffffff;
		opacity: 0.92;
	}

	.radio {
		width: 30rpx;
		height: 30rpx;
		background-color: #fff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 登录卡片 */
	.login-card {
		background-color: rgba(255, 255, 255, 0.92);
		border-radius: 32rpx;
		padding: 30rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.login-item {
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		position: relative;
	}

	.divider {
		width: 100%;
		height: 1rpx;
		background-color: #e5edf7;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	/* 图标容器 */
	.icon-box {
		width: 60rpx;
		height: 60rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 22rpx;
	}

	.icon-box.green {
		background-color: #34c759;
	}

	.icon-box.blue {
		background-color: #0084ff;
	}

	.icon-box.orange {
		background-color: #ff9500;
	}

	.item-text {
		font-size: 24rpx;
		color: #1d2939;
		flex: 1;
	}

	.tip-right {
		display: flex;
		align-items: center;
	}

	.tip-text {
		font-size: 22rpx;
		color: #007aff;
		margin-right: 8rpx;
	}

	/* 协议勾选 */
	.agree-box {
		display: flex;
		align-items: center;
		margin-top: 60rpx;
		margin-bottom: 60rpx;
	}

	.agree-text {
		font-size: 20rpx;
		color: #475467;
		margin-left: 16rpx;
	}

	/* 登录按钮 */
	.login-btn {
		width: 100%;
		background-color: #007aff;
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
		border-radius: 60rpx;
		border: none;
	}

	.login-btn::after {
		border: none;
	}

	/* 底部文字 */
	.bottom-desc {
		display: block;
		text-align: center;
		font-size: 32rpx;
		color: #475467;
		margin-top: 40rpx;
	}
</style>