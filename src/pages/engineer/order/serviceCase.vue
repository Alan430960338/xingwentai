<template>
	<view class="page-wrap">
		<AppHeader title="服务案例列表" content="服务案例列表" :back="true" :imageType=1 ></AppHeader>

		<!-- 基础信息表单 -->
		<view class="form-list">
			<view class="form-item" v-for="(item, index) in baseInfo" :key="index">
				<view class="item-content">
					<text class="label">{{ item.label }}</text>
					<text class="value">{{ item.value }}</text>
				</view>
				<!-- 操作按钮区域 -->
				<view class="item-actions">
					<text class="action-btn edit-btn" @click="handleEdit(index)">编辑</text>
					<text class="action-btn delete-btn" @click="handleDelete(index)">删除</text>
				</view>
			</view>
		</view>
		
		<mybtn text="新增案例" type="primary" style="position: absolute;bottom: 30rpx;left: 30rpx;right: 30rpx;" @click="addServiceCase"></mybtn>
	</view>
</template>

<script setup>
import AppHeader from '@/components/header.vue'
import mybtn from '@/components/button/btmBtn.vue'

// 定义基础信息数组，包含提现相关的各项信息
const baseInfo = [
  { label: '文泰科技园监控升级', value: '2026-08-26' },
  { label: '滨江数据中心弱电巡检', value: '2026-04-12' },
  { label: '黄山办公楼侧门禁链条', value: '2026-06-12' },
]

const addServiceCase = () => {
	uni.navigateTo({
		url: '/pages/engineer/order/addServiceCase'
	})
}

// 编辑功能
const handleEdit = (index) => {
	const item = baseInfo[index]
	uni.navigateTo({
		url: `/pages/engineer/order/addServiceCase?editIndex=${index}&label=${encodeURIComponent(item.label)}&value=${item.value}`
	})
}

// 删除功能
const handleDelete = (index) => {
	const item = baseInfo[index]
	uni.showModal({
		title: '删除确认',
		content: `确定要删除「${item.label}」吗？`,
		success: (res) => {
			if (res.confirm) {
				// 从数组中移除该项
				baseInfo.splice(index, 1)
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})
			}
		}
	})
}
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

	.form-list {
		margin: 0 30rpx;
	}

	.form-item {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-content {
		flex: 1;
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

	/* 操作按钮样式 */
	.item-actions {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
		margin-left: 20rpx;
	}

	.action-btn {
		font-size: 26rpx;
		padding: 8rpx 24rpx;
		border-radius: 12rpx;
		text-align: center;
		min-width: 80rpx;
	}

	.edit-btn {
		color: #1765de;
		background-color: #e8f0fe;
		border: 1rpx solid #bddaff;
	}

	.delete-btn {
		color: #ff4d4f;
		background-color: #fff1f0;
		border: 1rpx solid #ffccc7;
	}

	/* 点击反馈 */
	.action-btn:active {
		opacity: 0.6;
	}

	.bottom-btn {
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
</style>