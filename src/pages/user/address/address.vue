<template>
	<view class="page-wrap">
		<AppHeader title="企业资料" content="企业资料" :back="true"></AppHeader>

		<view class="form-list">
			<view class="form-item" v-for="(item, index) in invoiceData" :key="index">
				<view class="item-content">
					<view class="item-info">
						<text class="label">{{ item.label }}</text>
						<text class="value">{{ item.value }}</text>
					</view>
					<view class="item-actions">
						<text class="action-btn edit-btn" @click="handleEdit(index)">编辑</text>
						<text class="action-btn delete-btn" @click="handleDelete(index)">删除</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部新增按钮 -->
		<myBtn text="新增地址" @click="handleAdd" type="primary" style="position: absolute;bottom: 30rpx;left: 30rpx;right: 30rpx;"></myBtn>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import AppHeader from '@/components/header.vue'
	import myBtn from '@/components/button/btmBtn.vue'

	// 数据
	const invoiceData = ref([{
			label: '滨江数据中心',
			value: '杭州市滨江区江南大道88号'
		},
		{
			label: '黄山机房',
			value: '杭州市萧山区建设一路168号'
		},
		{
			label: '西湖办公区',
			value: '杭州市西湖区文三路66号'
		}
	])

	// 删除
	const handleDelete = (index) => {
		uni.showModal({
			title: '提示',
			content: '确定要删除该地址吗？',
			success: (res) => {
				if (res.confirm) {
					invoiceData.value.splice(index, 1)
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					})
				}
			}
		})
	}

	// 编辑
	const handleEdit = (index) => {
		const item = invoiceData.value[index]
		// 方式1: 弹窗编辑（简单）
		uni.showModal({
			title: '编辑地址',
			content: '请输入新的地址',
			editable: true,
			placeholderText: '请输入详细地址',
			success: (res) => {
				if (res.confirm && res.content) {
					invoiceData.value[index].value = res.content
					uni.showToast({
						title: '修改成功',
						icon: 'success'
					})
				}
			}
		})

		// 方式2: 跳转到编辑页面（推荐，适合复杂表单）
		// uni.navigateTo({
		//   url: `/pages/user/address/edit?index=${index}`
		// })
	}

	// 新增
	const handleAdd = () => {
		// 方式1: 弹窗新增（简单）
		uni.showModal({
			title: '新增地址',
			content: '请输入地址名称',
			editable: true,
			placeholderText: '例如：滨江数据中心',
			success: (res) => {
				if (res.confirm && res.content) {
					// 继续输入详细地址
					uni.showModal({
						title: '新增地址',
						content: '请输入详细地址',
						editable: true,
						placeholderText: '请输入详细地址',
						success: (res2) => {
							if (res2.confirm && res2.content) {
								invoiceData.value.push({
									label: res.content,
									value: res2.content
								})
								uni.showToast({
									title: '添加成功',
									icon: 'success'
								})
							}
						}
					})
				}
			}
		})

		// 方式2: 跳转到新增页面（推荐）
		// uni.navigateTo({
		//   url: '/pages/user/address/add'
		// })
	}
</script>

<style scoped>

	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		padding: 0 0rpx 140rpx;
		/* 底部留出按钮空间 */
		box-sizing: border-box;
	}

	.form-list {
		margin: 0 30rpx;
	}

	.form-item {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
	}

	.item-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-info {
		flex: 1;
	}

	.label {
		font-size: 28rpx;
		color: #888;
		display: block;
		margin-bottom: 12rpx;
	}

	.value {
		font-size: 28rpx;
		color: #111;
		font-weight: 500;
	}

	.item-actions {
		display: flex;
		flex-shrink: 0;
		margin-left: 20rpx;
	}

	.action-btn {
		font-size: 26rpx;
		padding: 12rpx 24rpx;
		border-radius: 16rpx;
		margin-left: 16rpx;
		cursor: pointer;
	}

	.edit-btn {
		color: #007aff;
		background: #e8f3ff;
	}

	.delete-btn {
		color: #ff3b30;
		background: #ffe8e6;
	}

	/* 底部新增按钮 */
	.add-btn-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		padding: 20rpx 30rpx 40rpx;
		background: #f0f7ff;
		box-sizing: border-box;
		z-index: 100;
	}

	.add-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #007aff, #00c9cc);
		color: #ffffff;
		border-radius: 44rpx;
		font-size: 32rpx;
		font-weight: 500;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-btn::after {
		border: none;
	}

	.add-btn:active {
		opacity: 0.8;
	}
</style>