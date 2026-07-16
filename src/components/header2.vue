<template>
	<view>
		<!-- 使用背景图方式 -->
		<view class="header-section" :style="{ backgroundImage: `url(${headerImage})` }">
			<view class="header-row1">
				<text class="page-title">{{ title }}</text>

				<view v-if="back" class="headerleft" @click="goBack">
					<uni-icons type="left" size="18" color="#ffffff" />
				</view>

				<view class="headerright">
					<div class="hearder-point-container">
						<view class="hearder-point" />
						<view class="hearder-point" />
						<view class="hearder-point" />
					</div>
				</view>
			</view>

			<view style="width: 100%; margin-bottom: 20rpx;">
				<text class="greeting">{{ content }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import globalDataMixin from "@/mixins/globalData.js";

export default {
	mixins: [globalDataMixin],
	name: "AppHeader",
	props: {
		title: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			default: ''
		},
		back: {
			type: Boolean,
			default: false
		},
		// 图片类型：1-蓝色，2-黄色
		imageType: {
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			// 图片路径（注意：uni-app 中静态资源放在 static 目录）
			blueImage: '/static/header/1.png',
			yellowImage: '/static/header/2.png'
		}
	},
	computed: {
		headerImage() {
			return this.imageType === 2 ? this.yellowImage : this.blueImage
		}
	},
	methods: {
		goBack() {
			uni.navigateBack({
				delta: 1,
				fail: (err) => {
					console.error('返回失败:', err)
				}
			})
		}
	}
}
</script>

<style scoped>
.header-section {
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 24rpx;
	min-height: 200rpx;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-color: #1781e1; /* 备用背景色 */
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

.headerleft {
	position: absolute;
	left: 30rpx;
	top: 60rpx;
	width: 68rpx;
	height: 68rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.15);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	z-index: 10;
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
	background-color: rgba(255, 255, 255, 0.15);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	z-index: 10;
}

.page-title {
	margin-top: 40rpx;
	font-size: 38rpx;
	color: #ffffff;
	font-weight: 600;
	display: block;
	margin-bottom: 40rpx;
}

.greeting {
	font-weight: 700;
	font-size: 40rpx;
	color: #fff;
	margin-bottom: 40rpx;
	margin-top: 40rpx;
	display: block;
}
</style>