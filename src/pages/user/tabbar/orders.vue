<template>
	<view class="page-wrap">

		<AppHeader title="订单管理" content="工单管理"  ></AppHeader>

		<view class="filter-wrap">
			<!-- 搜索框 -->
			<view class="search-input">
				<uni-icons type="search" size="20" color="#999" />
				<input class="search-placeholder" placeholder="搜索标题、故障内容、师傅" v-model="searchKeyword" @input="handleSearch" />
			</view>

			<!-- 状态标签栏 -->
			<view class="tab-group">
				<view class="tab-item" v-for="(tab, index) in tabList" :key="index" 
					:class="{ active: currentTab === tab.key }" @click="switchTab(tab.key)">
					{{ tab.label }}
				</view>
			</view>
		</view>

		<view class="orderList">
			<!-- 空状态 -->
			<view v-if="orderList.length === 0 && !loading" class="empty-state">
				<uni-icons type="document" size="80" color="#ccc" />
				<text class="empty-text">暂无工单</text>
			</view>

			<!-- 工单详情卡片 -->
			<view class="order-card" v-for="order in orderList" :key="order.id" @click="gotoDetail(order)">
				<view class="order-title-row">
					<text class="order-title">{{ order.title || '未命名工单' }}</text>
					<view class="order-tag" :style="{ backgroundColor: getStatusColor(order.status).bg }">
						<text class="tag-text" :style="{ color: getStatusColor(order.status).color }">
							{{ formatStatus(order.status) }}
						</text>
					</view>
				</view>

				<view class="order-title-row-tag">
					<view class="tag1">SLA {{ formatHours(order.hours) }}</view>
					<view class="tag2">{{ order.category_name || '暂无分类' }}</view>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务地址</text>
					<text class="info-value">{{ formatAddress(order) }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务时间</text>
					<text class="info-value">{{ formatTime(order.planned_start_time) }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">联系人</text>
					<text class="info-value">{{ formatContact(order.address_data) }}</text>
				</view>

				<view class="order-info-row no-border">
					<text class="info-label">服务商</text>
					<text class="info-value">{{ order.service_name || '暂未分配' }}</text>
				</view>

				<view class="order-footer">
					<text class="order-no">订单编号：{{ order.order_sn }}</text>
					<view class="order-actions">
						<view class="item-btn" v-if="[0, 1].includes(order.status)" @click.stop="cancelOrder(order)">
							取消
						</view>
						<view class="item-btn" v-if="[0, 1].includes(order.status)" @click.stop="editOrder(order)">
							修改订单
						</view>
						<view class="item-btn" v-if="order.status === 5" @click.stop="invoice(order)">
							申请发票
						</view>
						<view class="item-btn" v-if="[2, 3, 6].includes(order.status)" @click.stop="viewProgress(order)">
							查看进度
						</view>
						
					</view>
				</view>
			</view>

			<view v-if="loading" class="list-footer">加载中...</view>
			<view v-else-if="orderList.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
		</view>

		<bar tabname="order"></bar>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import bar from '@/components/tabBer/index.vue'
import AppHeader from '@/components/header.vue'
import { cancelUserOrder, getUserOrderList } from '@/api/user.js'
// ============ 搜索和筛选 ============
const searchKeyword = ref('')
const currentTab = ref('')
const orderList = ref([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const limit = 10
const hasMore = ref(true)
let searchTimer = null
let pendingRefresh = false

// 标签列表
const tabList = [
	{ label: '全部', key: '' },
	{ label: '未支付', key: 0 },
	{ label: '待接单', key: 1 },
	{ label: '待开始', key: 2 },
	{ label: '进行中', key: 3 },
	{ label: '已取消', key: 4 },
	{ label: '已完成', key: 5 },
	{ label: '超时', key: 6 }
]

// ============ 方法 ============

const statusMap = {
	0: '未支付',
	1: '待接单',
	2: '待开始',
	3: '进行中',
	4: '已取消',
	5: '已完成',
	6: '超时'
}

const formatStatus = (status) => {
	return statusMap[status] || `状态${status ?? '--'}`
}

const padZero = (value) => String(value).padStart(2, '0')

const formatTime = (timestamp) => {
	if (!timestamp) {
		return '--'
	}

	const normalizedTimestamp = timestamp.toString().length === 13 ? Number(timestamp) : Number(timestamp) * 1000
	const date = new Date(normalizedTimestamp)

	if (Number.isNaN(date.getTime())) {
		return '--'
	}

	return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
}

const formatHours = (hours) => {
	if (hours === null || hours === undefined || hours === '') {
		return '--小时'
	}

	return `${hours}小时`
}

const formatAddress = (order) => {
	return order.address || order.address_data?.address || '--'
}

const formatContact = (addressData) => {
	const safeAddressData = addressData || {}

	if (!safeAddressData.contact_name && !safeAddressData.contact_phone) {
		return '--'
	}

	return [safeAddressData.contact_name, safeAddressData.contact_phone].filter(Boolean).join(' ')
}

const normalizeOrderList = (list = []) => {
	return list.map(item => ({
		...item,
		status: item.status === '' || item.status === null || item.status === undefined ? item.status : Number(item.status),
		address_data: item.address_data || {}
	}))
}

const fetchOrderList = async (reset = false) => {
	if (loading.value) {
		if (reset) {
			pendingRefresh = true
		}
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
		const res = await getUserOrderList({
			search: searchKeyword.value.trim(),
			status: currentTab.value,
			page: page.value,
			limit
		})

		if (res.code !== 1) {
			uni.showToast({
				title: res.msg || '订单获取失败',
				icon: 'none'
			})
			return
		}

		const listData = normalizeOrderList(res.data?.data || [])
		total.value = Number(res.data?.total || 0)
		orderList.value = reset ? listData : [...orderList.value, ...listData]
		hasMore.value = page.value < Number(res.data?.last_page || 0)

		if (hasMore.value) {
			page.value += 1
		}
	} catch (error) {
		uni.showToast({
			title: '订单获取失败',
			icon: 'none'
		})
	} finally {
		loading.value = false

		if (pendingRefresh) {
			pendingRefresh = false
			fetchOrderList(true)
		}
	}
}

// 获取状态颜色
const getStatusColor = (status) => {
	const colorMap = {
		'未支付': { bg: '#fff7e6', color: '#ff7d00' },
		'待接单': { bg: '#fff7e6', color: '#ff7d00' },
		'待开始': { bg: '#e8f3ff', color: '#007aff' },
		'进行中': { bg: '#e8f3ff', color: '#007aff' },
		'已完成': { bg: '#e6f9ef', color: '#039855' },
		'已取消': { bg: '#f5f5f5', color: '#999' },
		'超时': { bg: '#ffe8e6', color: '#ff3b30' }
	}
	return colorMap[formatStatus(status)] || { bg: '#f5f5f5', color: '#999' }
}

// 切换标签
const switchTab = (key) => {
	currentTab.value = key
	fetchOrderList(true)
}

// 搜索
const handleSearch = () => {
	if (searchTimer) {
		clearTimeout(searchTimer)
	}

	searchTimer = setTimeout(() => {
		fetchOrderList(true)
	}, 300)
}

// 跳转详情
const gotoDetail = (order) => {
	uni.navigateTo({
		url: `/pages/user/order/orderDetail?id=${order.id}`
	})
}

// 取消订单
const cancelOrder = (order) => {
	uni.showModal({
		title: '取消订单',
		content: '',
		editable: true,
		placeholderText: '取消订单原因',
		success: async res => {
			if (!res.confirm) {
				return
			}

			const cancelRemark = (res.content || '').trim()
			if (!cancelRemark) {
				uni.showToast({
					title: '请输入取消原因',
					icon: 'none'
				})
				return
			}

			try {
				const cancelRes = await cancelUserOrder({
					id: order.id,
					cancel_remark: cancelRemark
				})

				if (cancelRes.code !== 1) {
					uni.showToast({
						title: cancelRes.msg || '取消订单失败',
						icon: 'none'
					})
					return
				}

				uni.showToast({
					title: cancelRes.msg || '取消成功',
					icon: 'success'
				})
				fetchOrderList(true)
			} catch (error) {
				uni.showToast({
					title: '取消订单失败',
					icon: 'none'
				})
			}
		}
	})
}

// 申请发票
const invoice = (order) => {
	uni.navigateTo({
		url: `/pages/user/order/requestInvoice?id=${order.id}`
	})
}

const editOrder = (order) => {
	if (!order?.id) {
		return
	}

	uni.navigateTo({
		url: `/pages/user/order/editOrder?id=${order.id}`
	})
}

// 查看进度
const viewProgress = (order) => {
	uni.navigateTo({
		url: `/pages/user/order/orderDetail?id=${order.id}`
	})
}

onShow(() => {
	fetchOrderList(true)
})

onReachBottom(() => {
	fetchOrderList()
})
</script>

<style scoped>
.page-wrap {
	background-color: #edf4fa;
	min-height: 100vh;
}

.filter-wrap {
	width: 100%;
}

.header-row1 {
	display: flex;
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

/* 搜索框 */
.search-input {
	background: #ffffff;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	margin: 0 30rpx 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	padding: 20rpx;
}

.search-placeholder {
	font-size: 28rpx;
	color: #888;
	margin-left: 24rpx;
	flex: 1;
}

/* 标签栏 */
.tab-group {
	display: flex;
	margin: 20rpx 30rpx;
	overflow-x: auto;
	padding-bottom: 10rpx;
}

.tab-group::-webkit-scrollbar {
	display: none;
}

.tab-item {
	padding: 12rpx 28rpx;
	border-radius: 60rpx;
	font-size: 28rpx;
	color: #555;
	background: #fff;
	margin-right: 20rpx;
	white-space: nowrap;
	flex-shrink: 0;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}

.tab-item.active {
	background-color: #edf4fa;
	border: 2rpx solid #007aff;
	color: #007aff;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;
}

.empty-text {
	font-size: 32rpx;
	color: #999;
	margin-top: 30rpx;
}

/* 工单卡片 */
.order-card {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin: 0 30rpx 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.tag1 {
	font-size: 20rpx;
	background-color: #eaf1fc;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	text-align: center;
	color: #1265d9;
	border: 1rpx solid #c1d7f5;
	margin-right: 10rpx;
}

.tag2 {
	font-size: 20rpx;
	background-color: #eaf7f2;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	text-align: center;
	border: 1rpx solid #c1d7f5;
	color: #12a96a;
}

.order-title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.order-title-row-tag {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.order-title {
	font-size: 30rpx;
	color: #1d2939;
	font-weight: 600;
	flex: 1;
	margin-right: 20rpx;
}

.order-tag {
	border-radius: 20rpx;
	padding: 6rpx 16rpx;
	font-size: 20rpx;
	flex-shrink: 0;
}

.tag-text {
	font-size: 20rpx;
}

.order-info-row {
	margin-bottom: 18rpx;
	border-bottom: 1rpx dashed #e5edf7;
	padding-bottom: 15rpx;
	display: flex;
	justify-content: space-between;
	gap: 24rpx;
}

.no-border {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.info-label {
	font-size: 20rpx;
	color: #667085;
	display: block;
	margin-bottom: 6rpx;
	flex-shrink: 0;
}

.info-value {
	font-size: 22rpx;
	color: #1d2939;
	line-height: 32rpx;
	text-align: right;
	flex: 1;
}

/* 进度条 */
.order-footer {
	align-items: center;
	justify-content: space-between;
	display: flex;
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #eef2f6;
}

.order-no {
	font-size: 22rpx;
	color: #667085;
}

.order-actions {
	display: flex;
	align-items: center;
}

.item-btn {
	margin: 0 10rpx;
	font-size: 24rpx;
	padding: 13rpx 24rpx;
	border: 1rpx solid #007aff;
	border-radius: 20rpx;
	color: #007aff;
	background: #fff;
	flex-shrink: 0;
}

.primary-btn {
	background: #007aff;
	color: #fff;
	border: none;
}

.list-footer {
	text-align: center;
	font-size: 24rpx;
	color: #98a2b3;
	padding: 10rpx 0 140rpx;
}
</style>
