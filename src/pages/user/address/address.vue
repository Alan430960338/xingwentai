<template>
	<view class="page-wrap">
		<AppHeader :title="pageTitle" :content="pageContent" :back="true"></AppHeader>

		<view class="form-list">
			<view v-if="selectMode" class="select-tip">选择一个地址后将自动返回发单页</view>

			<view v-if="addressList.length === 0 && !loading" class="empty-state">
				<text class="empty-text">暂无地址</text>
			</view>

			<view class="form-item" v-for="(item, index) in addressList" :key="item.id" @click="selectAddress(item)">
				<view class="item-content">
					<view class="item-info">
						<view class="label-row">
							<text class="label">{{ item.contact_name || '未命名联系人' }}</text>
							<text v-if="item.is_default === 1" class="default-tag">默认</text>
						</view>
						<text class="phone">{{ item.contact_phone || '--' }}</text>
						<text class="value">{{ formatAddress(item) }}</text>
					</view>
					<view v-if="!selectMode" class="item-actions">
						<text class="action-btn edit-btn" @click="handleEdit(index)">编辑</text>
						<text class="action-btn delete-btn" @click="handleDelete(index)">删除</text>
					</view>
				</view>
			</view>

			<view v-if="loading" class="list-footer">加载中...</view>
			<view v-else-if="addressList.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
		</view>

		<!-- 底部新增按钮 -->
		<myBtn v-if="!selectMode" text="新增地址" @click="handleAdd" type="primary"
			style="position: fixed;bottom: 30rpx;left: 30rpx;right: 30rpx;"></myBtn>
	</view>
</template>

<script setup>
	import { computed, getCurrentInstance, ref } from 'vue'
	import {
		onLoad,
		onReachBottom,
		onShow
	} from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import myBtn from '@/components/button/btmBtn.vue'
	import {
		getAddressList,
		deleteAddress
	} from '@/api/user.js'

	const addressList = ref([])
	const loading = ref(false)
	const page = ref(1)
	const limit = 10
	const hasMore = ref(true)
	const selectMode = ref(false)
	const instance = getCurrentInstance()
	let navigatingToAdd = false

	const pageTitle = computed(() => selectMode.value ? '选择地址' : '常用地址')
	const pageContent = computed(() => selectMode.value ? '选择服务地址' : '常用地址')

	const formatAddress = item => {
		return [item.province, item.city, item.district, item.address].filter(Boolean).join(' ')
	}

	const selectAddress = item => {
		if (!selectMode.value) {
			return
		}

		const eventChannel = instance?.proxy?.getOpenerEventChannel?.()
		if (!eventChannel) {
			uni.showToast({
				title: '页面通信失败',
				icon: 'none'
			})
			return
		}

		eventChannel.emit('selectAddress', item)
		uni.navigateBack()
	}

	const fetchAddressList = async (reset = false) => {
		if (loading.value) {
			return
		}

		if (reset) {
			page.value = 1
			hasMore.value = true
		}

		if (!hasMore.value) {
			return
		}

		loading.value = true

		try {
			const res = await getAddressList({
				page: page.value,
				limit
			})

			if (res.code !== 1) {
				uni.showToast({
					title: res.msg || '地址获取失败',
					icon: 'none'
				})
				return
			}

			const listData = Array.isArray(res.data) ? res.data : []
			addressList.value = reset ? listData : [...addressList.value, ...listData]
			hasMore.value = listData.length >= limit

			if (hasMore.value) {
				page.value += 1
			}
		} catch (error) {
			uni.showToast({
				title: '地址获取失败',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}

	// 删除
	const handleDelete = (index) => {
		const item = addressList.value[index]

		if (!item?.id) {
			return
		}

		uni.showModal({
			title: '提示',
			content: '确定要删除该地址吗？',
			success: async (res) => {
				if (!res.confirm) {
					return
				}

				try {
					const response = await deleteAddress({
						id: item.id
					})

					if (response.code !== 1) {
						uni.showToast({
							title: response.msg || '删除地址失败',
							icon: 'none'
						})
						return
					}

					uni.showToast({
						title: response.msg || '删除成功',
						icon: 'success'
					})
					fetchAddressList(true)
				} catch (error) {
					uni.showToast({
						title: '删除地址失败',
						icon: 'none'
					})
				}
			}
		})
	}

	// 编辑
	const handleEdit = (index) => {
		const item = addressList.value[index]

		if (!item?.id || navigatingToAdd) {
			return
		}

		navigatingToAdd = true
		uni.navigateTo({
			url: `/pages/user/address/add?id=${item.id}`,
			complete: () => {
				setTimeout(() => {
					navigatingToAdd = false
				}, 300)
			}
		})
	}

	// 新增
	const handleAdd = () => {
		if (navigatingToAdd) {
			return
		}

		navigatingToAdd = true
		uni.navigateTo({
			url: '/pages/user/address/add',
			complete: () => {
				setTimeout(() => {
					navigatingToAdd = false
				}, 300)
			}
		})

		// 方式2: 跳转到新增页面（推荐）
		// uni.navigateTo({
		//   url: '/pages/user/address/add'
		// })
	}

	onLoad(options => {
		selectMode.value = options?.select === '1'
	})

	onShow(() => {
		fetchAddressList(true)
	})

	onReachBottom(() => {
		fetchAddressList()
	})
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

	.select-tip {
		background: #e8f3ff;
		border: 1rpx solid #bcdbff;
		border-radius: 20rpx;
		padding: 20rpx 24rpx;
		font-size: 24rpx;
		color: #0f63d4;
		margin-bottom: 24rpx;
	}

	.form-item {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
	}

	.empty-state {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 80rpx 30rpx;
		text-align: center;
		margin-bottom: 24rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #98a2b3;
	}

	.item-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-info {
		flex: 1;
	}

	.label-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 12rpx;
	}

	.label {
		font-size: 28rpx;
		color: #111;
		font-weight: 500;
	}

	.default-tag {
		font-size: 20rpx;
		line-height: 32rpx;
		padding: 0 14rpx;
		border-radius: 16rpx;
		background: #e8f3ff;
		color: #007aff;
	}

	.phone {
		font-size: 24rpx;
		color: #667085;
		display: block;
		margin-bottom: 10rpx;
	}

	.value {
		font-size: 26rpx;
		color: #111;
		line-height: 38rpx;
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

	.list-footer {
		text-align: center;
		font-size: 24rpx;
		color: #98a2b3;
		padding: 10rpx 0 20rpx;
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
