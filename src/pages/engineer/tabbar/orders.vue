<template>
	<view class="page-wrap">
		<AppHeader title="我的订单" content="我的订单"></AppHeader>

		<view class="filter-wrap">
			<!-- 搜索框 -->
			<view class="search-input">
				<uni-icons type="search" size="20" color="#999" />
				<input class="search-placeholder" placeholder="搜索标题、机房地址、师傅" v-model="searchKeyword" @input="handleSearch" />
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
			<view v-if="filteredOrderList.length === 0 && !loading" class="empty-state">
				<uni-icons type="document" size="80" color="#ccc" />
				<text class="empty-text">暂无工单</text>
			</view>

			<view class="order-card" v-for="order in filteredOrderList" :key="order.id" @click="gotoDetail(order)">
				<view class="order-title-row">
					<text class="order-title">{{ order.title || '未命名工单' }}</text>
					<view class="order-tag" :style="{ backgroundColor: getStatusColor(order.status, order).bg }">
						<text class="tag-text" :style="{ color: getStatusColor(order.status, order).color }">
							{{ formatStatus(order.status, order) }}
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
					<text class="info-label">服务时间</text>
					<text class="info-value">{{ formatTime(order.planned_start_time) }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">联系人</text>
					<text class="info-value">{{ formatContact(order.address_data) }}</text>
				</view>

				<view class="order-info-row" :class="{ 'no-border': !order.distance_text }">
					<text class="info-label">服务商</text>
					<text class="info-value">{{ order.service_name || '暂未分配' }}</text>
				</view>

				<view v-if="order.distance_text" class="order-info-row no-border">
					<text class="info-label">距离</text>
					<text class="info-value">{{ order.distance_text }}</text>
				</view>

				<div class="line-container">
					<div class="bottom-line" v-for="i in 4" :key="i" :class="{ active: i <= getProgressValue(order.status) }" />
				</div>
				
				<div class="totle-price">
					<view>
						{{ renderAmount(order.budget_amount) }}
					</view>
					<view style="display: flex;">
						<div class="item-btn" v-if="order.status === 2" @click.stop="checkInCompleted(order)">
							到达签到
						</div>
						<div class="item-btn primary-btn" v-if="order.status === 1" @click.stop="handleAcceptOrder(order)">
							接单
						</div>
						<!-- <div class="item-btn" v-if="order.status === 3" @click.stop="uploadProcess(order)">
							上传施工过程
						</div> -->
						
						<div class="item-btn" v-if="order.status === 3 && order.is_wg!==1" @click.stop="settltment(order)">
							发起结算
						</div>
						<div class="item-btn" v-if="order.status === 4" @click.stop="viewProgress(order)">
							查看原因
						</div>
						<div class="item-btn" v-if="order.status === 5" @click.stop="viewEvaluate(order)">
							查看评价
						</div>
						<div class="item-btn" v-if="order.status === 2" @click.stop="cancelOrderWin(order)">
							取消
						</div>
					</view>
				</div>
			</view>

			<view v-if="loading" class="list-footer">加载中...</view>
			<view v-else-if="filteredOrderList.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
		</view>

		<bar tabname="orders"></bar>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import bar from '@/components/tabBer/engineer.vue'
import AppHeader from '@/components/header.vue'
import { acceptOrder, getMyOrderList , cancelOrder} from '@/api/engineer.js'

const searchKeyword = ref('')
const currentTab = ref('all')
const tabList = [
	{ label: '全部', key: 'all', status: '' },
	{ label: '待接单', key: 'pending', status: 1 },
	{ label: '待开始', key: 'ready', status: 2 },
	{ label: '进行中', key: 'processing', status: 3 },
	{ label: '已取消', key: 'cancelled', status: 4 },
	{ label: '已完成', key: 'done', status: 5 },
	{ label: '已评价', key: 'evaluated', status: 5 }
]

const orderList = ref([])
const page = ref(1)
const limit = 10
const hasMore = ref(true)
const loading = ref(false)
const accepting = ref(false)

const statusMap = {
	0: '未支付',
	1: '待接单',
	2: '待开始',
	3: '进行中',
	4: '已取消',
	5: '已完成',
	6: '已评价'
}

const filteredOrderList = computed(() => {
	if (currentTab.value !== 'evaluated') {
		return orderList.value
	}

	return orderList.value.filter(order => Number(order.status) === 5 && Number(order.is_pj) === 1)
})

const formatStatus = (status, order = {}) => {
	if (Number(status) === 5 && Number(order.is_pj) === 1) {
		return '已评价'
	}

	return statusMap[status] || `状态${status ?? '--'}`
}

const getStatusColor = (status, order = {}) => {
	const colorMap = {
		'待接单': { bg: '#fff7e6', color: '#ff7d00' },
		'待开始': { bg: '#fff4df', color: '#b97815' },
		'进行中': { bg: '#e8f3ff', color: '#007aff' },
		'已完成': { bg: '#e6f9ef', color: '#039855' },
		'已取消': { bg: '#f5f5f5', color: '#999' },
		'未支付': { bg: '#f5f5f5', color: '#999' },
		'已评价': { bg: '#eef4ff', color: '#4b6bfb' }
	}
	return colorMap[formatStatus(status, order)] || { bg: '#f5f5f5', color: '#999' }
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
		const currentTabItem = tabList.find(item => item.key === currentTab.value)
		const requestData = {
			page: page.value,
			limit,
			search: searchKeyword.value.trim()
		}

		if (currentTabItem && currentTabItem.status !== '') {
			requestData.status = currentTabItem.status
		}

		const res = await getMyOrderList(requestData)
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

const switchTab = key => {
	currentTab.value = key
	fetchOrderList(true)
}

const handleSearch = () => {
	fetchOrderList(true)
}

const gotoDetail = order => {
	uni.navigateTo({
		url: `/pages/engineer/order/orderDetails?id=${order.id}`
	})
}

const handleAcceptOrder = order => {
	uni.showModal({
		title: '提示',
		content: '确定要接单吗？',
		success: async res => {
			if (res.confirm) {
				if (accepting.value) {
					return
				}

				accepting.value = true
				try {
					const response = await acceptOrder({ id: order.id })
					if (response.code !== 1) {
						uni.showToast({ title: response.msg || '接单失败', icon: 'none' })
						return
					}

					uni.showToast({ title: '接单成功', icon: 'success' })
					fetchOrderList(true)
				} catch (error) {
					uni.showToast({ title: '接单失败', icon: 'none' })
				} finally {
					accepting.value = false
				}
			}
		}
	})
}

const viewProgress = order => {
	uni.showToast({
		title: `当前状态: ${formatStatus(order.status, order)}`,
		icon: 'none'
	})
}

const viewEvaluate = order => {
	uni.navigateTo({
		url: `/pages/engineer/order/evaluateDetail?id=${order.id}`
	})
}

//取消接单弹窗
const cancelOrderWin = (order)=>{
	uni.showModal({
		title:'取消接单',
		content:'取消原因',
		editable:true,
		success: (res) => {
			if(res.confirm){
				cancelOrderRe(order,res.content)
			}
		}
	})
}

//取消订单
const cancelOrderRe = async (order,content)=>{
	try{
		const res = await cancelOrder({
			id: order.id,
			cancel_remark: content
		})
		if(res.code!==1){
			uni.showToast({
				title: res.msg || '取消失败'
			})
		}
		
		
	}catch(error){
		
		uni.showToast({
			title: res.msg || '取消失败'
		})
		
	}finally{
		
		fetchOrderList(true)
		
	}
}



const checkInCompleted = order => {
	uni.navigateTo({
		url: `/pages/engineer/order/checkInCompleted?id=${order.id}`
	})
}

const uploadProcess = () => {
	uni.navigateTo({
		url: '/pages/engineer/order/constructionProcess'
	})
}

const settltment = order => {
	uni.navigateTo({
		url: `/pages/engineer/order/settlement?id=${order.id}`
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
}

/* 进度条 */
.line-container {
	display: flex;
	justify-content: space-between;
	margin: 20rpx 0 16rpx;
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

.price {
	font-size: 42rpx;
	color: #0f63d4;
}

.list-footer {
	text-align: center;
	font-size: 24rpx;
	color: #98a2b3;
	padding: 10rpx 0 20rpx;
}
</style>
