<template>
	<view class="page-wrap">
		<AppHeader title="发票管理" content="发票管理" :back="true"></AppHeader>
		<view class="page-action-row">
			<view class="invoice-title-btn" @click="goInvoiceTitlePage">发票抬头</view>
		</view>
		<!-- 顶部标签切换 -->
		<view class="tab-switch">
			<view class="tab-item" v-for="tab in tabList" :key="tab.key"
				:class="{ active: currentTab === tab.key }" @click="switchTab(tab.key)">
				<text>{{ tab.label }}</text>
			</view>
		</view>

		<!-- 工单列表 -->
		<view class="list-wrap">
			<view v-if="orderList.length === 0 && !loading" class="empty-state">
				<text class="empty-text">暂无发票记录</text>
			</view>

			<view class="order-card" v-for="order in orderList" :key="order.id">
				<view class="order-title-row">
					<text class="order-title">{{ order.title || '未命名工单' }}</text>
					<view class="order-tag" :style="{ backgroundColor: getStatusColor(order.qualifications_data).bg }">
						<text class="tag-text" :style="{ color: getStatusColor(order.qualifications_data).color }">{{ formatInvoiceStatus(order.qualifications_data) }}</text>
					</view>
				</view>

				<view class="order-title-row-tag">
					<view class="tag1">SLA {{ formatHours(order.hours) }}</view>

					<view class="tag2">{{ order.category_name || '暂无分类' }}</view>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务地址</text>
					<text class="info-value info-value-right">{{ formatAddress(order) }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务时间</text>
					<text class="info-value info-value-right">{{ formatTime(order.planned_time || order.planned_start_time) }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">联系人</text>
					<text class="info-value info-value-right">{{ formatContact(order.nickname, order.mobile) }}</text>
				</view>

				<view class="order-info-row no-border">
					<text class="info-label">服务商</text>
					<text class="info-value info-value-right">{{ order.service_name || '暂未分配' }}</text>
				</view>

				<view class="line-container">
					<view class="bottom-line" v-for="i in 4" :key="i" />
				</view>
				<view class="totle-price">
					<view>
						￥<text class="price">{{ formatMoney(order.budget_amount) }}</text>
					</view>
					<view style="display: flex;">
						<view v-if="order.qualifications_data === 1" class="item-btn primary-btn" @click.stop="invoice(order)">
							申请开票
						</view>
						<view v-else class="item-btn" @click.stop="invoice(order)">
							查看
						</view>
					</view>

				</view>
			</view>

			<view v-if="loading" class="list-footer">加载中...</view>
			<view v-else-if="orderList.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onReachBottom, onShow } from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import { getQualificationInvoiceList } from '@/api/user.js'

	const currentTab = ref('')
	const orderList = ref([])
	const loading = ref(false)
	const page = ref(1)
	const limit = 10
	const hasMore = ref(true)

	const tabList = [
		{ label: '全部', key: '' },
		{ label: '未开票', key: 1 },
		{ label: '已开票', key: 2 },
		{ label: '开票中', key: 4 }
	]

	const invoiceStatusMap = {
		1: '未开票',
		2: '已开票',
		4: '开票中'
	}

	const formatInvoiceStatus = status => {
		return invoiceStatusMap[status] || `状态${status ?? '--'}`
	}

	const getStatusColor = status => {
		const colorMap = {
			'未开票': { bg: '#fff7e6', color: '#ff7d00' },
			'已开票': { bg: '#e6f9ef', color: '#039855' },
			'开票中': { bg: '#e8f3ff', color: '#007aff' }
		}

		return colorMap[formatInvoiceStatus(status)] || { bg: '#f5f5f5', color: '#999' }
	}

	const padZero = value => String(value).padStart(2, '0')

	const formatTime = timestamp => {
		if (!timestamp) {
			return '--'
		}

		if (typeof timestamp === 'string' && timestamp.includes('-')) {
			return timestamp
		}

		const normalizedTimestamp = timestamp.toString().length === 13 ? Number(timestamp) : Number(timestamp) * 1000
		const date = new Date(normalizedTimestamp)

		if (Number.isNaN(date.getTime())) {
			return '--'
		}

		return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
	}

	const formatHours = hours => {
		if (hours === null || hours === undefined || hours === '') {
			return '--小时'
		}

		return `${hours}小时`
	}

	const formatAddress = order => {
		return order.address || '--'
	}

	const formatContact = (name, mobile) => {
		if (!name && !mobile) {
			return '--'
		}

		return [name, mobile].filter(Boolean).join(' ')
	}

	const formatMoney = amount => {
		if (amount === null || amount === undefined || amount === '') {
			return '--'
		}

		return Number(amount).toFixed(2)
	}

	const normalizeOrderList = (list = []) => {
		return list.map(item => ({
			...item,
			qualifications_data: item.qualifications_data === '' || item.qualifications_data === null || item.qualifications_data === undefined ? item.qualifications_data : Number(item.qualifications_data)
		}))
	}

	const fetchInvoiceList = async (reset = false) => {
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
			const res = await getQualificationInvoiceList({
				page: page.value,
				limit,
				qualifications_data: currentTab.value
			})

			if (res.code !== 1) {
				uni.showToast({
					title: res.msg || '发票列表获取失败',
					icon: 'none'
				})
				return
			}

			const rawList = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
			const listData = normalizeOrderList(rawList)
			orderList.value = reset ? listData : [...orderList.value, ...listData]
			hasMore.value = Array.isArray(res.data?.data)
				? page.value < Number(res.data?.last_page || 0)
				: listData.length >= limit

			if (hasMore.value) {
				page.value += 1
			}
		} catch (error) {
			uni.showToast({
				title: '发票列表获取失败',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}

	const switchTab = key => {
		currentTab.value = key
		fetchInvoiceList(true)
	}

	const invoice = order => {
		const targetUrl = order.qualifications_data === 1
			? `/pages/user/order/requestInvoice?id=${order.id}&amount=${order.budget_amount || ''}`
			: `/pages/user/order/orderDetail?id=${order.id}`

		uni.navigateTo({
			url: targetUrl
		})
	}

	const goInvoiceTitlePage = () => {
		uni.navigateTo({
			url: '/pages/user/order/invoiceTitle'
		})
	}

	onShow(() => {
		fetchInvoiceList(true)
	})

	onReachBottom(() => {
		fetchInvoiceList()
	})
</script>

<style scoped>


	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		box-sizing: border-box;
	}

	.page-action-row {
		display: flex;
		justify-content: flex-end;
		margin: 0 30rpx 20rpx;
	}

	.invoice-title-btn {
		text-align: center;
		background: linear-gradient(to right,#1780e1,#38c0d8);
		width: 100%;
		padding: 14rpx 26rpx;
		border-radius: 999rpx;
		border: 1rpx solid #bcd8ff;
		color: #fff;
		font-size: 24rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 14rpx rgba(0, 122, 255, 0.08);
		
	}

	/* 顶部切换标签 */
	.tab-switch {
		margin: 0 30rpx 30rpx;
		display: flex;
		justify-content: space-between;
	}

	.tab-item {
		padding: 12rpx 30rpx;
		border-radius: 60rpx;
		background: #fff;
		font-size: 30rpx;
		color: #667085;
		margin-right: 24rpx;
	}

	.tab-item.active {
		background: #e8f3ff;
		color: #007aff;
		border: 1rpx solid #bcdbff;
	}

	.empty-state {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 90rpx 30rpx;
		margin: 0 30rpx 24rpx;
		text-align: center;
	}

	.empty-text {
		font-size: 28rpx;
		color: #98a2b3;
	}

	/* 工单卡片 */
	.order-card {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin: 0 30rpx 24rpx;
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
		padding: 6rpx 12rpx;
		font-size: 20rpx;
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
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: 0;
	}

	.info-label {
		font-size: 20rpx;
		color: #667085;
		display: block;
		margin-bottom: 6rpx;
	}

	.info-value {
		font-size: 22rpx;
		color: #1d2939;
		line-height: 32rpx;
	}

	.info-value-right {
		flex: 1;
		text-align: right;
	}

	.price {
		font-size: 28rpx;
		color: #1d2939;
		font-weight: 600;
	}

	.order-btn-row {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.order-btn {
		width: 48%;
		height: 72rpx;
		border-radius: 36rpx;
		font-size: 24rpx;
		border: none;
		background-color: #f5f7fa;
		color: #1d2939;
	}

	.order-btn.primary {
		background-color: #007aff;
		color: #ffffff;
	}

	.order-btn::after {
		border: none;
	}

	.line-container {
		display: flex;
		justify-content: space-between;
	}

	.bottom-line {
		width: 22%;
		height: 10rpx;
		border-radius: 30rpx;
		background: linear-gradient(to right, #166ae7, #12b4ca);
	}

	.totle-price {
		align-items: center;
		justify-content: space-between;
		display: flex;
		font-size: 42rpx;
		color: #0f63d4;
		margin-top: 20rpx;
		z-index: 999;
	}

	.item-btn {
		margin: 0 10rpx;
		font-size: 24rpx;
		padding: 13rpx 24rpx;
		border: 1rpx solid #007aff;
		border-radius: 20rpx;
		color: #007aff;
		background: #ffffff;
	}

	.primary-btn {
		background: #007aff;
		color: #ffffff;
	}

	.list-footer {
		text-align: center;
		font-size: 24rpx;
		color: #98a2b3;
		padding: 10rpx 0 30rpx;
	}


	.price {
		font-size: 42rpx;
		color: #0f63d4;

	}
</style>
