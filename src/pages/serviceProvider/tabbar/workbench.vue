<template>
	<view class="page-wrap">
		<AppHeader title="服务商工作台" content="服务商工作台"></AppHeader>
		
		<!-- 顶部提示栏 -->
		<view class="tip-box">
			<text class="tip-text">公司角色可统一派工，监控工程师状态和查看客户工单。</text>
		</view>

		<!-- 顶部金额统计卡片 -->
		<view class="stat-row">
			<view class="stat-item" v-for="(item, idx) in statData" :key="idx">
				<text class="stat-money">{{ item.money }}</text>
				<text class="stat-label">{{ item.label }}</text>
			</view>
		</view>
		
		
		<!-- 快捷入口 -->
		<view class="quick-grid">
			<view class="quick-item" @click="gotoOrders">
				<view class="quick-icon">
					<text class="icon-inner">📋</text>
				</view>
				<text class="quick-text">派工单</text>
			</view>
			<view class="quick-item" @click="gotoOrders">
				<view class="quick-icon">
					<text class="icon-inner">🔧</text>
				</view>
				<text class="quick-text">订单管理</text>
			</view>
			<view class="quick-item" @click="gotoManagementEngineer">
				<view class="quick-icon">
					<text class="icon-inner">📑</text>
				</view>
				<text class="quick-text">管理工程师</text>
			</view>
			<view class="quick-item">
				<view class="quick-icon">
					<text class="icon-inner">📞</text>
				</view>
				<text class="quick-text">结算统计</text>
			</view>
		</view>
		
		<!-- 工单详情卡片 -->
		<view class="orderList">
			<!-- 空状态 -->
			<view v-if="filteredOrderList.length === 0 && !loading" class="empty-state">
				<uni-icons type="document" size="80" color="#ccc" />
				<text class="empty-text">暂无工单</text>
			</view>

			<!-- 工单详情卡片 -->
			<view class="order-card" v-for="(order, index) in filteredOrderList" :key="order.id" @click="gotoDetail(order)">
				<view class="order-title-row">
					<text class="order-title">{{ order.title || '未命名工单' }}</text>
					<view class="order-tag" :style="{ backgroundColor: getStatusColor(order.status).bg }">
						<text class="tag-text" :style="{ color: getStatusColor(order.status).color }">
							{{ formatStatus(order.status) }}
						</text>
					</view>
				</view>

				<view class="order-title-row-tag">
					<div class="tag1">
						SLA <span>{{ formatHours(order.hours) }}</span>小时
					</div>
					<div class="tag2">
						{{ order.category_name || '暂无分类' }}
					</div>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务地址</text>
					<text class="info-value">{{ formatAddress(order) }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">计划开始</text>
					<text class="info-value">{{ formatTime(order.planned_start_time) }}</text>
				</view>
				<view class="order-info-row">
					<text class="info-label">工期</text>
					<text class="info-value">{{ formatHours(order.hours) === '--' ? '--' : `预计${formatHours(order.hours)}小时` }}</text>
				</view>
				<view class="order-info-row">
					<text class="info-label">联系人</text>
					<text class="info-value">{{ formatContact(order.address_data) }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务商</text>
					<text class="info-value">{{ order.service_name || '暂未分配' }}</text>
				</view>

				<div class="line-container">
					<div class="bottom-line" v-for="i in 4" :key="i" :class="{ active: i <= getProgressValue(order.status) }" />
				</div>
				
				<div class="totle-price">
					<view>
						{{ renderAmount(order.budget_amount) }}
					</view>
					<div class="item-btn" v-if="Number(order.status) === 2" @click.stop="cancelOrder(order)">
						立即派工
					</div>

				</div>
			</view>

			<view v-if="loading" class="list-footer">加载中...</view>
			<view v-else-if="filteredOrderList.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
		</view>


		<bar tabname="workbench"></bar>
	</view>
</template>

<script setup>
	import bar from '@/components/tabBer/service.vue'
	import AppHeader from '@/components/header.vue'
	import { ref, computed } from 'vue'
	import { onReachBottom, onShow } from '@dcloudio/uni-app'
	import { getMyOrderList } from '@/api/engineer.js'
	
	const statData = ref([{
			money: '18',
			label: '今日工单'
		},
		{
			money: '6',
			label: '在岗工程师'
		},
		{
			money: '3',
			label: '待派工'
		},
	])
	


// ============ 搜索和筛选 ============
const searchKeyword = ref('')
const currentTab = ref('all')
const orderList = ref([])
const page = ref(1)
const limit = 10
const hasMore = ref(true)
const loading = ref(false)

const statusMap = {
	0: '未支付',
	1: '待接单',
	2: '待开始',
	3: '进行中',
	4: '已取消',
	5: '已完成'
}

// 标签列表
const tabList = [
	{ label: '全部', key: 'all' },
	{ label: '待开始', key: '待接单' },
	{ label: '进行中', key: '进行中' },
	{ label: '已超时', key: '已超时' },
	{ label: '已完成', key: '已完成' }
]

const filteredOrderList = computed(() => {
	return orderList.value
})

// ============ 方法 ============

// 获取状态颜色
const getStatusColor = (status) => {
	const colorMap = {
		'待开始': { bg: '#fff7e6', color: '#ff7d00' },
		'待接单': { bg: '#fff7e6', color: '#ff7d00' },
		'进行中': { bg: '#e8f3ff', color: '#007aff' },
		'已完成': { bg: '#e6f9ef', color: '#039855' },
		'已取消': { bg: '#f5f5f5', color: '#999' },
		'未支付': { bg: '#f5f5f5', color: '#999' }
	}
	return colorMap[formatStatus(status)] || { bg: '#f5f5f5', color: '#999' }
}

const formatStatus = status => {
	return statusMap[status] || `状态${status ?? '--'}`
}

const getProgressValue = status => {
	const progressMap = {
		0: 1,
		1: 1,
		2: 2,
		3: 3,
		4: 1,
		5: 4
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

const renderAmount = amount => {
	if (amount === null || amount === undefined || amount === '') {
		return '--'
	}
	return `￥${Number(amount).toFixed(2)}`
}

const refreshStats = list => {
	statData.value = [
		{ money: String(list.length), label: '当前工单' },
		{ money: String(list.filter(item => Number(item.status) === 3).length), label: '进行中' },
		{ money: String(list.filter(item => Number(item.status) === 2).length), label: '待派工' }
	]
}

const fetchOrderList = async (reset = false) => {
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
		const res = await getMyOrderList({
			page: page.value,
			limit
		})

		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '工单获取失败', icon: 'none' })
			return
		}

		const listData = Array.isArray(res.data?.data)
			? res.data.data.map(item => ({
				...item,
				status: item.status === '' || item.status === null || item.status === undefined ? item.status : Number(item.status),
				address_data: item.address_data || {}
			}))
			: []

		orderList.value = reset ? listData : [...orderList.value, ...listData]
		refreshStats(orderList.value)
		hasMore.value = page.value < Number(res.data?.last_page || 0)

		if (hasMore.value) {
			page.value += 1
		}
	} catch (error) {
		uni.showToast({ title: '工单获取失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

// 切换标签
const switchTab = (key) => {
	currentTab.value = key
}

// 搜索
const handleSearch = () => {
	// 搜索逻辑由 computed 自动处理
}

// 跳转详情
const gotoDetail = (order) => {
	uni.navigateTo({
		url: `/pages/serviceProvider/order/orderDetails?id=${order.id}`
	})
}

const gotoOrders = ()=>{
	uni.navigateTo({
		url:'/pages/serviceProvider/tabbar/order'
	})
}

const gotoManagementEngineer = ()=>{
	uni.navigateTo({
		url:'/pages/serviceProvider/tabbar/engineerManagement'
	})
}


// 取消订单
const cancelOrder = (order) => {
	uni.showModal({
		title: '提示',
		content: '确定要取消该工单吗？',
		success: (res) => {
			if (res.confirm) {
				order.status = '已取消'
				uni.showToast({
					title: '已取消',
					icon: 'success'
				})
			}
		}
	})
}

// 申请发票
const invoice = (order) => {
	uni.navigateTo({
		// url: `/pages/user/order/requestInvoice?id=${order.id}`
	})
}

// 接单
const acceptOrder = (order) => {
	uni.showModal({
		title: '提示',
		content: '确定要接单吗？',
		success: (res) => {
			if (res.confirm) {
				order.status = '进行中'
				order.progress = 2
				uni.showToast({
					title: '接单成功',
					icon: 'success'
				})
			}
		}
	})
}

// 查看进度
const viewProgress = (order) => {
	uni.showToast({
		title: `当前进度: ${order.progress}/4`,
		icon: 'none'
	})
}

const checkInCompleted = ()=>{
	console.log(111)
	uni.navigateTo({
		url:'/pages/engineer/order/checkInCompleted'
	})
}


const uploadProcess = ()=>{
	uni.navigateTo({
		url:'/pages/engineer/order/constructionProcess'
	})
}
const applyExtension = ()=>{
	uni.navigateTo({
		url:'/pages/engineer/order/applyExtension'
	})
}

const settltment = ()=>{
	uni.navigateTo({
		url:'/pages/engineer/order/settlement'
	})
}

	onShow(() => {
		fetchOrderList(true)
	})

	onReachBottom(() => {
		fetchOrderList()
	})

	
</script>

<style>
	
	/* 顶部提示框 */
	.tip-box {
		background-color: #f2f8ff;
		border-radius: 20rpx;
		padding: 20rpx;
		border: 1rpx solid #bddaff;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		margin: 0 30rpx 20rpx;
	}
	.tip-text {
		font-size: 24rpx;
		color: #135dbd;
		line-height: 48rpx;
	}
	
	/* 顶部统计三栏 */
	.stat-row {
		
		margin: 0 30rpx 30rpx;
		display: flex;
	}
	
	.stat-item {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		width: 31%;
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx 0;
		text-align: center;
		margin-right: 3.5%;
	}
	
	.stat-item:last-child {
		margin-right: 0;
	}
	
	.stat-money {
		font-size: 38rpx;
		color: #0052cc;
		font-weight: 600;
		display: block;
	}
	
	.stat-label {
		font-size: 26rpx;
		color: #667085;
		display: block;
		margin-top: 12rpx;
	}
	
	/* 快捷入口 */
	.quick-grid {
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: #ffffff;
		margin: 0rpx 30rpx 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		padding: 20rpx;
	}
	
	.quick-item {
		width: 22%;
		text-align: center;
		border: 1rpx solid #e5edf7;
		padding: 10rpx 0;
		border-radius: 20rpx;
	}
	
	.quick-icon {
		width: 88rpx;
		height: 88rpx;
		border-radius: 20rpx;
		background-color: #e9faf5;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 12rpx;
	}
	
	.icon-inner {
		font-size: 44rpx;
	}
	.item-btn {
		margin: 0 10rpx;
		font-size: 24rpx;
		padding: 13rpx 24rpx;
		border: 1rpx solid #007aff;
		border-radius: 20rpx;
		color: #fff;
		background-color: #007aff;
		flex-shrink: 0;
	}
	
	.quick-text {
		font-size: 20rpx;
		color: #1d2939;
	}
	/* 工单卡片 */
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
	}
	
	.order-tag {
		background-color: #fff7e6;
		border-radius: 20rpx;
		padding: 6rpx 12rpx;
		font-size: 20rpx;
	}
	
	.tag-text {
		font-size: 20rpx;
		color: #ff7d00;
	}
	
	.order-info-row {
		margin-bottom: 18rpx;
		border-bottom: 1rpx dashed #e5edf7;
		padding-bottom: 15rpx;
		display: flex;
		justify-content: space-between;
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
