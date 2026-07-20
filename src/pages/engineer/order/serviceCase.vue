<template>
	<view class="page-wrap">
		<AppHeader title="服务案例列表" content="服务案例列表" :back="true" :imageType="1"></AppHeader>

		<view class="form-list">
			<view v-if="caseList.length === 0 && !loading" class="empty-state">暂无服务案例</view>

			<view class="form-item" v-for="(item, index) in caseList" :key="item.id || index">
				<view class="item-content">
					<text class="label">{{ item.title || '未命名案例' }}</text>
					<text class="value">{{ formatTime(item.project_time) }}</text>
					<text class="desc">{{ item.content || '--' }}</text>
				</view>
				<view class="item-actions">
					<text class="action-btn edit-btn" @click="handleEdit(item)">编辑</text>
					<text class="action-btn delete-btn" @click="handleDelete(item, index)">删除</text>
				</view>
			</view>

			<view v-if="loading" class="list-footer">加载中...</view>
			<view v-else-if="caseList.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
		</view>
		
		<mybtn text="新增案例" type="primary" style="position: fixed;bottom: 30rpx;left: 30rpx;right: 30rpx;" @click="addServiceCase"></mybtn>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import mybtn from '@/components/button/btmBtn.vue'
import { deleteServiceCase, getServiceCaseList } from '@/api/engineer.js'

const caseList = ref([])
const page = ref(1)
const limit = 10
const hasMore = ref(true)
const loading = ref(false)
const deletingId = ref('')

const padZero = value => String(value).padStart(2, '0')

const formatTime = timestamp => {
	if (!timestamp) {
		return '--'
	}

	const normalizedTimestamp = String(timestamp).length === 13 ? Number(timestamp) : Number(timestamp) * 1000
	const date = new Date(normalizedTimestamp)
	if (Number.isNaN(date.getTime())) {
		return '--'
	}

	return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`
}

const fetchServiceCaseList = async (reset = false) => {
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
		const res = await getServiceCaseList({
			page: page.value,
			limit
		})

		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '案例获取失败', icon: 'none' })
			return
		}

		const listData = Array.isArray(res.data?.data) ? res.data.data : []
		caseList.value = reset ? listData : [...caseList.value, ...listData]
		hasMore.value = page.value < Number(res.data?.last_page || 0)

		if (hasMore.value) {
			page.value += 1
		}
	} catch (error) {
		uni.showToast({ title: '案例获取失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

const addServiceCase = () => {
	uni.navigateTo({
		url: '/pages/engineer/order/addServiceCase'
	})
}

const handleEdit = item => {
	uni.navigateTo({
		url: `/pages/engineer/order/addServiceCase?id=${item.id}`
	})
}

const handleDelete = (item, index) => {
	uni.showModal({
		title: '删除确认',
		content: `确定要删除「${item.title || '未命名案例'}」吗？`,
		success: async res => {
			if (!res.confirm) {
				return
			}

			if (deletingId.value) {
				return
			}

			deletingId.value = item.id || ''

			try {
				const result = await deleteServiceCase({ id: item.id })
				if (result.code !== 1) {
					uni.showToast({ title: result.msg || '删除失败', icon: 'none' })
					return
				}

				caseList.value.splice(index, 1)
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})

				if (caseList.value.length === 0) {
					fetchServiceCaseList(true)
				}
			} catch (error) {
				uni.showToast({ title: '删除失败', icon: 'none' })
			} finally {
				deletingId.value = ''
			}
		}
	})
}

onShow(() => {
	fetchServiceCaseList(true)
})

onReachBottom(() => {
	fetchServiceCaseList()
})
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

.empty-state,
.list-footer {
	text-align: center;
	font-size: 26rpx;
	color: #98a2b3;
	padding: 30rpx 0;
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
	color: #1d2939;
	font-weight: 600;
	display: block;
	margin-bottom: 12rpx;
}

.value {
	font-size: 26rpx;
	color: #667085;
	display: block;
	margin-bottom: 10rpx;
}

.desc {
	font-size: 26rpx;
	color: #111;
	line-height: 38rpx;
	display: block;
}

.item-actions {
	display: flex;
	flex-direction: column;
	margin-left: 20rpx;
}

.action-btn {
	font-size: 26rpx;
	padding: 8rpx 24rpx;
	border-radius: 12rpx;
	text-align: center;
	min-width: 80rpx;
	margin-bottom: 12rpx;
}

.action-btn:last-child {
	margin-bottom: 0;
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

.action-btn:active {
	opacity: 0.6;
}
</style>
