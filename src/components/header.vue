<template>
	<view>
		<!-- 使用背景图方式，添加安全区域适配 -->
		<view 
			class="header-section" 
			:style="{
				backgroundImage: `url(${headerImage})`,
				paddingTop: gd_statusBarHeight+'px',
			}"
		>
			<view class="header-row1" :style="{ marginTop: statusBarOffset }">
				<text class="page-title">{{ title }}</text>

				<view v-if="back" class="headerleft" @click="goBack">
					<uni-icons type="left" size="18" color="#ffffff" />
				</view>

			<!-- 	<view class="headerright">
					<div class="hearder-point-container">
						<view class="hearder-point" />
						<view class="hearder-point" />
						<view class="hearder-point" />
					</div>
				</view> -->
			</view>

			<view style="width: 100%; margin-bottom: 20rpx;">
				<text class="greeting">{{ content }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import globalDataMixin from "@/mixins/globalData.js";
import safeAreaMixin from "@/mixins/safeArea.js"; // 引入安全区域 mixin

export default {
	mixins: [globalDataMixin], // 使用1个 mixin
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
		imageType: {
			type: Number,
			default: 1
		},
		// 是否需要安全区域适配
		needSafeArea: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			blueImage: '/static/header/1.png',
			yellowImage: '/static/header/2.png'
		}
	},
	computed: {
		headerImage() {
				return this.imageType === 2 ? this.yellowImage : this.blueImage
			},
		// 状态栏偏移（用于调整顶部元素位置）
		statusBarOffset() {
			if (!this.needSafeArea) return '0px'
			// return this.needTopSafe ? `${this.statusBarHeight}px` : '0px'
			return  '0px'
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
	background-color: #1781e1;
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
	margin-top: 20rpx;
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

/* 针对底部安全区域的额外适配 */
.header-section {
	/* 使用 CSS 变量方式，可以配合 mixin 动态设置 */
	--safe-area-inset-bottom: env(safe-area-inset-bottom);
	padding-bottom: calc(30rpx + var(--safe-area-inset-bottom, 0px));
}
</style>