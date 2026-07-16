<!-- components/MyButton.vue -->
<template>
	<view class="btn-wrap" :class="[type, size]" @click="handleClick">
		<text class="btn-text">{{ text }}</text>
	</view>
</template>

<script>
export default {
	name: "MyButton",
	props: {
		// 按钮文本
		text: {
			type: String,
			default: '按钮'
		},
		// 按钮类型：primary, success, warning, danger, default
		type: {
			type: String,
			default: 'default'
		},
		// 按钮大小：large, medium, small
		size: {
			type: String,
			default: 'medium'
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否全宽
		block: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		handleClick(e) {
			if (this.disabled) return
			this.$emit('click', e)
		}
	}
}
</script>

<style scoped>
.btn-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 24rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	box-sizing: border-box;
}

.btn-wrap:active {
	transform: scale(0.96);
	opacity: 0.8;
}

/* ===== 按钮类型 ===== */
/* 默认 */
.btn-wrap.default {
	background-color: #f5f7fa;
	color: #1d2939;
	border: 2rpx solid #e5edf7;
}

/* 主要 */
.btn-wrap.primary {
	background: linear-gradient(to right, #1c72e9, #145dd7);
	color: #ffffff;
	border: none;
}

/* 成功 */
.btn-wrap.success {
	background: linear-gradient(135deg, #34c759, #28a745);
	color: #ffffff;
	border: none;
}

/* 警告 */
.btn-wrap.warning {
	background: linear-gradient(135deg, #ff9500, #ff6b00);
	color: #ffffff;
	border: none;
}

/* 危险 */
.btn-wrap.danger {
	background: linear-gradient(135deg, #ff3b30, #dc3545);
	color: #ffffff;
	border: none;
}

/* 边框按钮 */
.btn-wrap.outline {
	background: transparent;
	color: #007aff;
	border: 2rpx solid #007aff;
}

/* ===== 按钮大小 ===== */
/* 大 */
.btn-wrap.large {
	padding: 30rpx 80rpx;
	font-size: 34rpx;
	height: 96rpx;
}

/* 中 */
.btn-wrap.medium {
	padding: 22rpx 60rpx;
	font-size: 30rpx;
	height: 80rpx;
}

/* 小 */
.btn-wrap.small {
	padding: 16rpx 40rpx;
	font-size: 26rpx;
	height: 64rpx;
}

/* ===== 全宽 ===== */
.btn-wrap.block {
	width: 100%;
	border-radius: 44rpx;
}

/* ===== 禁用 ===== */
.btn-wrap.disabled {
	opacity: 0.5;
	cursor: not-allowed;
	pointer-events: none;
}

.btn-text {
	font-weight: 500;
}
</style>