<template>
	<view class="page-wrap">
		<AppHeader title="发票抬头" content="发票抬头管理" :back="true"></AppHeader>

		<view class="list-wrap">
			<view v-if="selectMode" class="select-tip">选择一个发票抬头后将自动返回申请页</view>

			<view v-if="titleList.length === 0 && !loading" class="empty-state">
				<text class="empty-text">暂无发票抬头</text>
			</view>

			<view class="title-card" v-for="item in titleList" :key="item.id" @click="selectTitle(item)">
				<view class="title-row">
					<view class="title-main">
						<text class="title-text">{{ item.title || '未命名抬头' }}</text>
						<text v-if="item.is_default_data === 1" class="default-tag">默认</text>
					</view>
					<view class="type-tag" :class="{ 'vat-tag': item.owner_date === 2 }">
						{{ formatOwnerType(item.owner_date) }}
					</view>
				</view>

				<view v-if="item.owner_date==2" class="info-row">
					<text class="info-label">税号</text>
					<text class="info-value">{{ item.tax_no || '--' }}</text>
				</view>

				<view class="info-row no-border">
					<text class="info-label">接收邮箱</text>
					<text class="info-value">{{ item.email || '--' }}</text>
				</view>

				<view v-if="!selectMode" class="action-row">
					<view class="action-btn edit-btn" @click.stop="editTitle(item)">编辑</view>
					<view class="action-btn delete-btn" @click.stop="deleteTitle(item)">删除</view>
				</view>
			</view>

			<view v-if="loading" class="list-footer">加载中...</view>
			<view v-else-if="titleList.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
		</view>

		<myBtn v-if="!selectMode" text="新增发票抬头" @click="goAddPage" type="primary"
			style="position: fixed;  left: 30rpx; right: 30rpx; bottom: 30rpx;"></myBtn>
	</view>
</template>

<script setup>
	import { getCurrentInstance, ref } from 'vue'
	import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import myBtn from '@/components/button/btmBtn.vue'
	import { getInvoiceTitleList ,deleteInvoiceTitle} from '@/api/user.js'

	const titleList = ref([])
	const loading = ref(false)
	const page = ref(1)
	const limit = 10
	const hasMore = ref(true)
	const selectMode = ref(false)
	const instance = getCurrentInstance()
	let navigating = false

	const formatOwnerType = type => {
		const typeMap = {
			1: '普通发票',
			2: '增值发票'
		}

		return typeMap[type] || '未知类型'
	}

	const normalizeTitleList = (list = []) => {
		return list.map(item => ({
			...item,
			owner_date: item.owner_date === '' || item.owner_date === null || item.owner_date === undefined ? item.owner_date : Number(item.owner_date),
			is_default_data: item.is_default_data === '' || item.is_default_data === null || item.is_default_data === undefined ? item.is_default_data : Number(item.is_default_data)
		}))
	}

	const fetchTitleList = async (reset = false) => {
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
			const res = await getInvoiceTitleList({
				page: page.value,
				limit
			})

			if (res.code !== 1) {
				uni.showToast({
					title: res.msg || '发票抬头获取失败',
					icon: 'none'
				})
				return
			}

			const listData = normalizeTitleList(res.data?.data || [])
			titleList.value = reset ? listData : [...titleList.value, ...listData]
			hasMore.value = page.value < Number(res.data?.last_page || 0)

			if (hasMore.value) {
				page.value += 1
			}
		} catch (error) {
			uni.showToast({
				title: '发票抬头获取失败',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}

	const goAddPage = () => {
		if (navigating) {
			return
		}

		navigating = true
		uni.navigateTo({
			url: '/pages/user/order/addInvoiceTitle',
			complete: () => {
				setTimeout(() => {
					navigating = false
				}, 300)
			}
		})
	}

	const editTitle = item => {
		if (navigating) {
			return
		}

		navigating = true
		uni.navigateTo({
			url: `/pages/user/order/addInvoiceTitle?id=${item.id}`,
			complete: () => {
				setTimeout(() => {
					navigating = false
				}, 300)
			}
		})
	}

	const deleteTitle = async item => {
		uni.showModal({
			title: '删除发票抬头',
			content: '确定删除该发票抬头吗？',
			success: async modalRes => {
				if (!modalRes.confirm) {
					return
				}

				try {
					const deleteRes = await deleteInvoiceTitle({
						id: item.id
					})

					if (deleteRes.code !== 1) {
						uni.showToast({
							title: deleteRes.msg || '删除失败',
							icon: 'none'
						})
						return
					}

					uni.showToast({
						title: deleteRes.msg || '删除成功',
						icon: 'success'
					})

					fetchTitleList(true)
				} catch (error) {
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					})
				}
			}
		})
	}

	const selectTitle = item => {
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

		eventChannel.emit('selectInvoiceTitle', item)
		uni.navigateBack()
	}

	onLoad(options => {
		selectMode.value = options?.select === '1'
	})

	onShow(() => {
		fetchTitleList(true)
	})

	onReachBottom(() => {
		fetchTitleList()
	})
</script>

<style scoped>
	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		box-sizing: border-box;
		padding-bottom: 140rpx;
	}

	.list-wrap {
		padding: 0 30rpx 30rpx;
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

	.empty-state {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 100rpx 30rpx;
		text-align: center;
	}

	.empty-text {
		font-size: 28rpx;
		color: #98a2b3;
	}

	.title-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
		margin-bottom: 24rpx;
	}

	.title-main {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 12rpx;
		min-width: 0;
	}

	.title-text {
		font-size: 30rpx;
		font-weight: 600;
		color: #1d2939;
		flex: 1;
	}

	.default-tag {
		flex-shrink: 0;
		padding: 6rpx 14rpx;
		border-radius: 999rpx;
		background: #e8f3ff;
		color: #007aff;
		font-size: 20rpx;
		line-height: 1.2;
	}

	.type-tag {
		flex-shrink: 0;
		padding: 8rpx 18rpx;
		border-radius: 999rpx;
		background: #fff7e6;
		color: #ff7d00;
		font-size: 22rpx;
	}

	.vat-tag {
		background: #e8f3ff;
		color: #007aff;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		gap: 24rpx;
		padding-bottom: 16rpx;
		margin-bottom: 16rpx;
		border-bottom: 1rpx dashed #e5edf7;
	}

	.no-border {
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: 0;
	}

	.action-row {
		display: flex;
		justify-content: flex-end;
		gap: 16rpx;
		margin-top: 24rpx;
		padding-top: 24rpx;
		border-top: 1rpx solid #eef2f6;
	}

	.action-btn {
		padding: 12rpx 24rpx;
		border-radius: 18rpx;
		font-size: 24rpx;
		line-height: 1;
	}

	.edit-btn {
		background: #e8f3ff;
		color: #007aff;
	}

	.delete-btn {
		background: #fff1f0;
		color: #ff4d4f;
	}

	.info-label {
		font-size: 24rpx;
		color: #667085;
	}

	.info-value {
		flex: 1;
		text-align: right;
		font-size: 24rpx;
		color: #1d2939;
		line-height: 36rpx;
	}

	.list-footer {
		text-align: center;
		font-size: 24rpx;
		color: #98a2b3;
		padding: 10rpx 0 30rpx;
	}
</style>
