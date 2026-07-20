<template>
	<view class="page-wrap">
		<AppHeader title="订单详情" content="工程师订单详情" :back="true"></AppHeader>

		<view v-if="tipText" class="top-tip">
			<text class="tip-text">{{ tipText }}</text>
		</view>

		<view class="order-card">
			<view class="order-title-row">
				<text class="order-title">{{ detail.title || '未命名工单' }}</text>
				<view class="order-tag" :style="{ backgroundColor: getStatusColor(detail.status).bg }">
					<text class="tag-text" :style="{ color: getStatusColor(detail.status).color }">{{ formatStatus(detail.status) }}</text>
				</view>
			</view>

			<view class="order-title-row-tag">
				<view class="tag1">SLA {{ formatHours(detail.hours) }}小时</view>
				<view class="tag2">{{ detail.category_name || '暂无分类' }}</view>
			</view>

			<view class="order-info-row">
				<text class="info-label">服务地址</text>
				<text class="info-value">{{ formatAddress(detail) }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">服务时间</text>
				<text class="info-value">{{ formatTime(detail.planned_start_time) }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">联系人</text>
				<text class="info-value">{{ formatContact(detail.address_data) }}</text>
			</view>

			<view class="order-info-row no-border">
				<text class="info-label">服务商</text>
				<text class="info-value">{{ detail.service_name || '暂未分配' }}</text>
			</view>

			<view class="line-container">
				<view class="bottom-line" v-for="i in 4" :key="i" :class="{ active: i <= getProgressValue(detail.status) }" />
			</view>

			<view class="totle-price">
				<view>
					￥<text class="price">{{ formatMoney(detail.budget_amount) }}</text>
				</view>
			</view>
		</view>

		<view class="progress-card">
			<text class="card-title">工单进度</text>
			<view v-if="progressList.length > 0" class="step-list">
				<view class="step-item" v-for="(item, index) in progressList" :key="index">
					<view class="step-dot" :class="{ active: item.active }"></view>
					<view class="step-content">
						<text class="step-title">{{ item.title }}</text>
						<text class="step-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
			<view v-else class="empty-progress">暂无进度</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import { getEngineerOrderDetail } from '@/api/engineer.js'

const detail = ref({
	address_data: {}
})
const progressList = ref([])

const statusMap = {
	1: '待接单',
	2: '待开始',
	3: '进行中',
	4: '已取消',
	5: '已完成',
	6: '超时'
}

const formatStatus = status => {
	return statusMap[status] || `状态${status ?? '--'}`
}

const getStatusColor = status => {
	const colorMap = {
		'待接单': { bg: '#fff7e6', color: '#ff7d00' },
		'待开始': { bg: '#e8f3ff', color: '#007aff' },
		'进行中': { bg: '#e8f3ff', color: '#007aff' },
		'已完成': { bg: '#e6f9ef', color: '#039855' },
		'已取消': { bg: '#f5f5f5', color: '#999' },
		'超时': { bg: '#ffe8e6', color: '#ff3b30' }
	}
	return colorMap[formatStatus(status)] || { bg: '#f5f5f5', color: '#999' }
}

const getProgressValue = status => {
	const progressMap = {
		1: 1,
		2: 2,
		3: 3,
		4: 1,
		5: 4,
		6: 3
	}
	return progressMap[status] || 1
}

const padZero = value => String(value).padStart(2, '0')

const formatTime = timestamp => {
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

const formatHours = hours => {
	if (hours === null || hours === undefined || hours === '') {
		return '--'
	}
	return hours
}

const formatMoney = amount => {
	if (amount === null || amount === undefined || amount === '') {
		return '--'
	}
	return Number(amount).toFixed(2)
}

const formatAddress = order => {
	const parts = [order.address_data?.province, order.address_data?.city, order.address_data?.district, order.address].filter(Boolean)
	return parts.join(' ') || '--'
}

const formatContact = addressData => {
	if (!addressData?.contact_name && !addressData?.contact_phone) {
		return '--'
	}
	return [addressData.contact_name, addressData.contact_phone].filter(Boolean).join(' ')
}

const tipText = computed(() => {
	const latestProgress = [...progressList.value].reverse().find(item => item.active)
	if (!latestProgress) {
		return ''
	}
	return `当前进度：${latestProgress.title}，时间 ${latestProgress.desc}`
})

const normalizeProgress = progress => {
	if (!Array.isArray(progress)) {
		return []
	}

	return progress.map(item => ({
		title: item.name || item.title || '进度更新',
		desc: item.time || item.desc || '--',
		active: item.type === 1 || item.active === true || item.active === 1
	}))
}

const fetchDetail = async id => {
	try {
		const res = await getEngineerOrderDetail({ id })
		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '详情获取失败', icon: 'none' })
			return
		}

		const data = res.data || {}
		detail.value = {
			...data,
			status: data.status === '' || data.status === null || data.status === undefined ? data.status : Number(data.status),
			address_data: data.address_data || {}
		}
		progressList.value = normalizeProgress(data.progress)
	} catch (error) {
		uni.showToast({ title: '详情获取失败', icon: 'none' })
	}
}

onLoad(options => {
	if (!options?.id) {
		uni.showToast({ title: '订单不存在', icon: 'none' })
		return
	}

	fetchDetail(options.id)
})
</script>

<style scoped>
.page-wrap {
	margin: 0 auto;
	min-height: 100vh;
	background-color: #f0f7ff;
	width: 750rpx;
	padding: 0 0rpx 30rpx;
	box-sizing: border-box;
}

.top-tip {
	margin: 0 30rpx 30rpx;
	background: #e8f3ff;
	border-radius: 20rpx;
	padding: 20rpx;
	border: 1rpx solid #1898db;
}

.tip-text {
	font-size: 26rpx;
	color: #0f63d4;
	line-height: 48rpx;
}

.progress-card {
	background: #ffffff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin: 0 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-title {
	font-size: 34rpx;
	color: #1d2939;
	font-weight: 600;
	display: block;
	margin-bottom: 40rpx;
}

.step-list {
	position: relative;
}

.step-item {
	display: flex;
	margin-bottom: 30rpx;
	position: relative;
}

.step-item:last-child {
	margin-bottom: 0;
}

.step-item::before {
	content: "";
	position: absolute;
	left: 26rpx;
	top: 46rpx;
	width: 2rpx;
	height: calc(100% + 60rpx);
	background: #cce0ff;
}

.step-item:last-child::before {
	display: none;
}

.step-dot {
	width: 38rpx;
	height: 38rpx;
	border-radius: 50%;
	border: 6rpx solid #e8f3ff;
	background-color: #007aff;
	margin-right: 30rpx;
	flex-shrink: 0;
	position: relative;
	z-index: 1;
}

.step-dot.active {
	background-color: #007aff;
	border-color: #b9dcff;
	box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.12);
}

.step-content {
	flex: 1;
}

.step-title {
	font-size: 28rpx;
	color: #1d2939;
	font-weight: 500;
	display: block;
	margin-bottom: 12rpx;
}

.step-desc {
	font-size: 26rpx;
	color: #667085;
}

.empty-progress {
	text-align: center;
	font-size: 26rpx;
	color: #98a2b3;
	padding: 20rpx 0;
}

.order-card {
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin: 0 30rpx 30rpx;
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
}

.order-info-row.no-border {
	border-bottom: none;
	padding-bottom: 0;
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
	margin-left: 20rpx;
}

.line-container {
	display: flex;
	justify-content: space-between;
	margin-top: 8rpx;
}

.bottom-line {
	width: 22%;
	height: 10rpx;
	border-radius: 30rpx;
	background: #e5edf7;
}

.bottom-line.active {
	background: linear-gradient(to right, #166ae7, #12b4ca);
}

.totle-price {
	align-items: center;
	justify-content: space-between;
	display: flex;
	font-size: 42rpx;
	color: #0f63d4;
	margin-top: 20rpx;
}

.price {
	font-size: 42rpx;
	color: #0f63d4;
}
</style>
