<template>
	<view class="page-wrap">
		<AppHeader title="订单详情" content="工单详情" :back="true" ></AppHeader>
		<!-- 顶部进度提示框 -->
		<view class="top-tip">
			<text class="tip-text">{{ progressTip }}</text>
		</view>

		<!-- 工单详情卡片 -->
		<view class="order-card" >
			<view class="order-title-row">
				<text class="order-title">{{ detailData.title || '未命名工单' }}</text>
				<view class="order-tag" :style="getStatusStyle(detailData.status).tagStyle">
					<text class="tag-text" :style="getStatusStyle(detailData.status).textStyle">{{ formatStatus(detailData.status) }}</text>
				</view>
			</view>

			<view class="order-title-row-tag">
				<view class="tag1">SLA {{ formatHours(detailData.hours) }}</view>

				<view class="tag2">{{ detailData.category_name || '暂无分类' }}</view>
			</view>

			<view class="order-info-row">
				<text class="info-label">服务地址</text>
				<text class="info-value info-value-right">{{ detailData.address || '--' }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">服务时间</text>
				<text class="info-value info-value-right">{{ formatTime(detailData.planned_time || detailData.planned_start_time) }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">联系人</text>
				<text class="info-value info-value-right">{{ formatContact(detailData.nickname, detailData.mobile) }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">服务商</text>
				<text class="info-value info-value-right">{{ detailData.service_name || '暂未分配' }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">故障描述</text>
				<text class="info-value info-value-right">{{ detailData.fault_description || '--' }}</text>
			</view>

			<view class="order-info-row no-border">
				<text class="info-label">订单编号</text>
				<text class="info-value info-value-right">{{ detailData.order_sn || detailData.id || '--' }}</text>
			</view>

			<view class="line-container">
				<view class="bottom-line" v-for="item in progressBars" :key="item" :class="{ active: item <= progressBarsActive }" />
			</view>
			<view class="totle-price">
				<view>
					￥<text class="price">{{ formatMoney(detailData.budget_amount) }}</text>
				</view>
				<view style="display: flex;">
					<view class="cancel-btn" v-if="[0, 1].includes(detailData.status)">
						取消
					</view>
					<view class="edit-btn" v-if="detailData.status === 5" @click.stop="editOrder">
						修改订单
					</view>
				</view>
			
			</view>
		</view>
		<!-- 工单进度流程卡片 -->
		<view class="progress-card">
			<text class="card-title">工单进度</text>
			<view class="step-list">
				<view class="step-item" v-for="item in progressList" :key="item.key">
					<view class="step-dot" :class="{ active: item.active }"></view>
					<view class="step-content">
						<text class="step-title">{{ item.title }}</text>
						<text class="step-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import { getUserOrderDetail } from '@/api/user.js'

	const detailData = ref({})
	const progressBars = [1, 2, 3, 4]

	const statusMap = {
		0: '未支付',
		1: '待接单',
		2: '待开始',
		3: '进行中',
		4: '已取消',
		5: '已完成',
		6: '超时'
	}

	const statusStyleMap = {
		'未支付': { bg: '#fff7e6', color: '#ff7d00' },
		'待接单': { bg: '#fff4df', color: '#b46b4f' },
		'待开始': { bg: '#fff4df', color: '#b46b4f' },
		'进行中': { bg: '#e8f3ff', color: '#007aff' },
		'已完成': { bg: '#e6f9ef', color: '#039855' },
		'已取消': { bg: '#f1f4f8', color: '#999999' },
		'超时': { bg: '#fff0f1', color: '#dc4c55' }
	}

	const formatStatus = status => {
		return statusMap[status] || `状态${status ?? '--'}`
	}

	const getStatusStyle = status => {
		const currentStatus = formatStatus(status)
		const currentStyle = statusStyleMap[currentStatus] || { bg: '#eef2f6', color: '#667085' }

		return {
			tagStyle: {
				backgroundColor: currentStyle.bg
			},
			textStyle: {
				color: currentStyle.color
			}
		}
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

	const formatMoney = amount => {
		if (amount === null || amount === undefined || amount === '') {
			return '--'
		}

		return Number(amount).toFixed(2)
	}

	const formatContact = (name, mobile) => {
		if (!name && !mobile) {
			return '--'
		}

		return [name, mobile].filter(Boolean).join(' ')
	}

	const progressList = computed(() => {
		const progress = Array.isArray(detailData.value.progress) ? detailData.value.progress : []
		if (progress.length > 0) {
			return progress.map((item, index) => ({
				key: `${item.type || 'progress'}_${index}`,
				title: item.type || '进度更新',
				desc: [item.time || '暂无时间', item.name || ''].filter(Boolean).join(' '),
				active: true
			}))
		}

		return [
			{
				key: 'create_time',
				title: '已发布',
				desc: formatTime(detailData.value.createtime),
				active: true
			},
			...items
		]
	})

	const progressBarsActive = computed(() => {
		return Math.max(progressList.value.filter(item => item.active).length, 1)
	})

	const progressTip = computed(() => {
		const latestProgress = [...progressList.value].reverse().find(item => item.active)
		if (!latestProgress) {
			return '当前进度：暂无进度信息。'
		}

		return `当前进度：${latestProgress.title}，时间 ${latestProgress.desc}`
	})

	const fetchOrderDetail = async id => {
		try {
			const res = await getUserOrderDetail({ id })

			if (res.code !== 1) {
				uni.showToast({
					title: res.msg || '详情获取失败',
					icon: 'none'
				})
				return
			}

			detailData.value = {
				...res.data,
				status: res.data?.status === '' || res.data?.status === null || res.data?.status === undefined ? res.data?.status : Number(res.data.status)
			}
		} catch (error) {
			uni.showToast({
				title: '详情获取失败',
				icon: 'none'
			})
		}
	}

	const editOrder = () => {
		if (!detailData.value?.id) {
			return
		}

		uni.navigateTo({
			url: `/pages/user/order/editOrder?id=${detailData.value.id}`
		})
	}

	onLoad(options => {
		if (!options?.id) {
			uni.showToast({
				title: '缺少订单ID',
				icon: 'none'
			})
			return
		}

		fetchOrderDetail(options.id)
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

	/* 顶部提示框 */
	.top-tip {
		background: #e8f3ff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: 0 30rpx 30rpx;
		border: 1rpx solid #1898db;
	}

	.tip-text {
		font-size: 26rpx;
		color: #0f63d4;
		line-height: 48rpx;
	}


	/* 分段进度条 */
	.progress-bar {
		display: flex;
		margin: 40rpx 0;
	}

	.progress-item {
		height: 10rpx;
		flex: 1;
		background: #e5edf7;
		border-radius: 6rpx;
		margin-right: 12rpx;
	}

	.progress-item:last-child {
		margin-right: 0;
	}

	.progress-item.fill {
		background: linear-gradient(90deg, #00b4d8, #007aff);
	}

	/* 价格与按钮区域 */
	.price-btn-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.price {
		font-size: 52rpx;
		color: #007aff;
		font-weight: 600;
	}

	.btn-outline {
		width: 200rpx;
		height: 80rpx;
		border: 2rpx solid #cce0ff;
		background: #fff;
		color: #007aff;
		font-size: 30rpx;
		border-radius: 40rpx;
	}

	.btn-outline::after {
		border: none;
	}

	/* 工单进度卡片 */
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

	/* 步骤竖线 */
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
		background: #fff;
		margin-right: 30rpx;
		flex-shrink: 0;
	}

	.step-dot.active {
		background: #007aff;
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
	
	
	/* 工单卡片 */
	.order-card {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin: 0 30rpx;
		margin-bottom: 30rpx;
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
	.cancel-btn {
		margin: 0 10rpx;
		font-size: 24rpx;
		padding: 13rpx 24rpx;
		border: 1rpx solid #007aff;
		border-radius: 20rpx;
	}
	
	.edit-btn{
		margin: 0 10rpx;
		font-size: 24rpx;
		padding: 13rpx 24rpx;
		border: 1rpx solid #007aff;
		border-radius: 20rpx;
	}
	.price {
		font-size: 42rpx;
		color: #0f63d4;
	}
	
</style>
