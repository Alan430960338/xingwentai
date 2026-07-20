<template>
	<view class="page-wrap">
		<AppHeader title="接单大厅" content="接单大厅"></AppHeader>

		<view class="filter-bar">
			<view class="scroll-wrap">
				<view class="tag-item" v-for="(item, idx) in filterList" :key="idx" @click="handleFilter(item)">
					<text class="tag-text">{{ item.label }}</text>
					<uni-icons type="down" size="12" color="#666" />
				</view>
			</view>
		</view>

		<view class="orderList">
			<view v-if="orderList.length === 0 && !loading" class="empty-state">
				<uni-icons type="document" size="80" color="#ccc" />
				<text class="empty-text">暂无工单</text>
			</view>

			<view class="order-card" v-for="order in orderList" :key="order.id">
				<view class="order-title-row">
					<text class="order-title">{{ order.title || '未命名工单' }}</text>
					<view class="order-tag" :style="{ backgroundColor: getStatusColor(order.status).bg }">
						<text class="tag-text" :style="{ color: getStatusColor(order.status).color }">
							{{ formatStatus(order.status) }}
						</text>
					</view>
				</view>

				<view class="order-title-row-tag">
					<view class="tag1">SLA {{ formatHours(order.hours) }}小时</view>
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

				<view class="order-info-row" :class="{ 'no-border': !order.distance_text }">
					<text class="info-label">服务商</text>
					<text class="info-value">{{ order.service_name || '暂未分配' }}</text>
				</view>

				<view v-if="order.distance_text" class="order-info-row no-border">
					<text class="info-label">距离</text>
					<text class="info-value">{{ order.distance_text || '--' }}</text>
				</view>

				<view class="line-container">
					<view class="bottom-line" v-for="i in 4" :key="i" :class="{ active: i <= getProgressValue(order.status) }" />
				</view>

				<view class="totle-price">
					<view>
						￥<text class="price">{{ formatMoney(order.budget_amount) }}</text>
					</view>
					<view style="display: flex;">
						<view v-if="order.status === 1" class="item-btn accept-btn" @click.stop="openConfirmPopup(order)">
							点击接单
						</view>
					</view>
				</view>
			</view>

			<view v-if="loading" class="list-footer">加载中...</view>
			<view v-else-if="orderList.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
		</view>

		<view class="popup-mask" v-if="showPopup" @click="closePopup">
			<view class="popup-box" @click.stop>
				<text class="popup-title">确认接单?</text>
				<text class="popup-desc">订单金额￥{{ formatMoney(currentOrder.budget_amount) }}，计划{{ formatTime(currentOrder.planned_start_time) }}到场。</text>
				<view class="popup-btn-group">
					<view class="popup-btn cancel-btn" @click="closePopup">再看看</view>
					<view class="popup-btn confirm-btn" @click="confirmAccept">确认接单</view>
				</view>
			</view>
		</view>

		<view class="popup-mask" v-if="showFilterPopup" @click="closeFilterPopup">
			<view class="popup-box filter-popup-box" @click.stop>
				<text class="popup-title">{{ filterPopupTitle }}</text>
				<template v-if="filterPopupType === 'budget' || filterPopupType === 'hours'">
					<view class="range-input-row">
						<input
							class="filter-input range-input"
							:type="filterPopupType === 'budget' ? 'digit' : 'number'"
							v-model="filterRange.min"
							:placeholder="filterPopupType === 'budget' ? '请输入最低预算' : '请输入最短工期'"
						/>
						<text class="range-separator">-</text>
						<input
							class="filter-input range-input"
							:type="filterPopupType === 'budget' ? 'digit' : 'number'"
							v-model="filterRange.max"
							:placeholder="filterPopupType === 'budget' ? '请输入最高预算' : '请输入最长工期'"
						/>
					</view>
				</template>
				<input
					v-else
					class="filter-input"
					type="number"
					v-model="filterInputValue"
					:placeholder="filterPopupPlaceholder"
				/>
				<view class="popup-btn-group">
					<view class="popup-btn cancel-btn" @click="closeFilterPopup">取消</view>
					<view class="popup-btn confirm-btn" @click="confirmFilterInput">确定</view>
				</view>
			</view>
		</view>

		<bar tabname="home"></bar>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import bar from '@/components/tabBer/engineer.vue'
import { acceptOrder, getCenterOrderList } from '@/api/engineer.js'
import { getDemandCategoryList } from '@/api/user.js'

const filterList = ref([
	{ label: '距离', key: 'distance' },
	{ label: '项目类型', key: 'category' },
	{ label: '预算', key: 'budget' },
	{ label: '工期', key: 'hours' }
])

const orderList = ref([])
const loading = ref(false)
const page = ref(1)
const limit = 10
const hasMore = ref(true)
const categoryOptions = ref([])
const filterParams = ref({
	category_id: '',
	budget_amount: '',
	hours: '',
	distance: '',
	lat: '',
	lng: ''
})
const showPopup = ref(false)
const currentOrder = ref({})
const accepting = ref(false)
const showFilterPopup = ref(false)
const filterPopupType = ref('')
const filterInputValue = ref('')
const filterRange = ref({
	min: '',
	max: ''
})

const statusMap = {
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

const getStatusColor = (status) => {
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

const getProgressValue = (status) => {
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

const filterPopupTitleMap = {
	budget: '输入预算',
	hours: '输入工期'
}

const filterPopupPlaceholderMap = {
	budget: '请输入预算金额',
	hours: '请输入工期小时数'
}

const filterPopupTitle = computed(() => filterPopupTitleMap[filterPopupType.value] || '输入筛选值')
const filterPopupPlaceholder = computed(() => filterPopupPlaceholderMap[filterPopupType.value] || '请输入')

const updateCurrentLocation = async () => {
	try {
		const location = await new Promise((resolve, reject) => {
			uni.getLocation({
				type: 'gcj02',
				success: resolve,
				fail: reject
			})
		})

		filterParams.value.lat = location.latitude ? String(location.latitude) : ''
		filterParams.value.lng = location.longitude ? String(location.longitude) : ''
	} catch (error) {
		filterParams.value.lat = ''
		filterParams.value.lng = ''
	}
}

const fetchCategoryList = async () => {
	if (categoryOptions.value.length > 0) {
		return
	}

	try {
		const res = await getDemandCategoryList({ type: 'type' })
		if (res.code !== 1) {
			return
		}

		categoryOptions.value = Array.isArray(res.data) ? res.data : []
	} catch (error) {
		// 静默处理筛选项加载失败
	}
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
		const res = await getCenterOrderList({
			page: page.value,
			limit,
			...filterParams.value
		})

		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '工单获取失败', icon: 'none' })
			return
		}

		const listData = Array.isArray(res.data?.data) ? res.data.data.map(item => ({
			...item,
			status: item.status === '' || item.status === null || item.status === undefined ? item.status : Number(item.status),
			address_data: item.address_data || {}
		})) : []

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

const handleFilter = async (item) => {
	if (item.key === 'category') {
		await fetchCategoryList()
		if (categoryOptions.value.length === 0) {
			uni.showToast({ title: '暂无项目类型', icon: 'none' })
			return
		}

		uni.showActionSheet({
			itemList: ['全部', ...categoryOptions.value.map(option => option.name)],
			success: res => {
				filterParams.value.category_id = res.tapIndex === 0 ? '' : categoryOptions.value[res.tapIndex - 1]?.id || ''
				fetchOrderList(true)
			}
		})
		return
	}

	if (item.key === 'budget') {
		openFilterPopup('budget', filterParams.value.budget_amount)
		return
	}

	if (item.key === 'hours') {
		openFilterPopup('hours', filterParams.value.hours)
		return
	}

	const distanceOptions = [
		{ label: '全部', value: '' },
		{ label: '由近到远', value: 1 },
		{ label: '由远到近', value: 2 }
	]
	uni.showActionSheet({
		itemList: distanceOptions.map(option => option.label),
		success: res => {
			filterParams.value.distance = distanceOptions[res.tapIndex]?.value || ''
			fetchOrderList(true)
		}
	})
}

const openConfirmPopup = (order) => {
	currentOrder.value = order
	showPopup.value = true
}

const openFilterPopup = (type, value) => {
	filterPopupType.value = type
	if (type === 'budget' || type === 'hours') {
		const [min = '', max = ''] = value ? String(value).split('-') : []
		filterRange.value = { min, max }
		filterInputValue.value = ''
	} else {
		filterInputValue.value = value ? String(value) : ''
	}
	showFilterPopup.value = true
}

const closePopup = () => {
	showPopup.value = false
	currentOrder.value = {}
}

const closeFilterPopup = () => {
	showFilterPopup.value = false
	filterPopupType.value = ''
	filterInputValue.value = ''
	filterRange.value = {
		min: '',
		max: ''
	}
}

const confirmFilterInput = () => {
	if (filterPopupType.value === 'budget') {
		const minValue = filterRange.value.min.trim()
		const maxValue = filterRange.value.max.trim()

		if (!minValue && !maxValue) {
			filterParams.value.budget_amount = ''
		} else if (!minValue || !maxValue) {
			uni.showToast({ title: '请输入完整预算区间', icon: 'none' })
			return
		} else {
			filterParams.value.budget_amount = `${minValue}-${maxValue}`
		}
	}

	if (filterPopupType.value === 'hours') {
		const minValue = filterRange.value.min.trim()
		const maxValue = filterRange.value.max.trim()

		if (!minValue && !maxValue) {
			filterParams.value.hours = ''
		} else if (!minValue || !maxValue) {
			uni.showToast({ title: '请输入完整工期区间', icon: 'none' })
			return
		} else {
			filterParams.value.hours = `${minValue}-${maxValue}`
		}
	}

	closeFilterPopup()
	fetchOrderList(true)
}

const confirmAccept = async () => {
	if (accepting.value || !currentOrder.value?.id) {
		return
	}

	accepting.value = true

	try {
		const res = await acceptOrder({ id: currentOrder.value.id })
		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '接单失败', icon: 'none' })
			return
		}

		closePopup()
		uni.showToast({
			title: '接单成功',
			icon: 'success'
		})
		fetchOrderList(true)
	} catch (error) {
		uni.showToast({ title: '接单失败', icon: 'none' })
	} finally {
		accepting.value = false
	}
}

onShow(async () => {
	await updateCurrentLocation()
	fetchOrderList(true)
})

onReachBottom(() => {
	fetchOrderList()
})
</script>

<style scoped>
.page-wrap {
	min-height: 100vh;
	width: 750rpx;
	padding: 0 0rpx 120rpx;
	box-sizing: border-box;
	background-color: #f0f7ff;
}

.filter-bar {
	margin: 0 30rpx;
	box-sizing: border-box;
}

.scroll-wrap {
	display: flex;
	justify-content: space-between;
	overflow-x: auto;
	padding: 20rpx 0;
}

.scroll-wrap::-webkit-scrollbar {
	display: none;
}

.tag-item {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 60rpx;
	padding: 10rpx 20rpx;
	margin-right: 24rpx;
	white-space: nowrap;
	flex-shrink: 0;
}

.tag-text {
	font-size: 25rpx;
	color: #222;
	margin-right: 12rpx;
}

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
}

.order-tag .tag-text {
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

.price {
	font-size: 42rpx;
	color: #0f63d4;
}

.item-btn {
	margin: 0 10rpx;
	font-size: 24rpx;
	padding: 13rpx 24rpx;
	border: 1rpx solid #007aff;
	border-radius: 20rpx;
	color: #007aff;
	background: #fff;
}

.item-btn.accept-btn {
	background: #11a968;
	color: #fff;
	border: none;
}

.empty-state {
	margin: 0 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;
}

.empty-text {
	font-size: 32rpx;
	color: #999;
	margin-top: 20rpx;
}

.list-footer {
	text-align: center;
	font-size: 24rpx;
	color: #98a2b3;
	padding: 10rpx 0 20rpx;
}

.popup-mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.45);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}

.popup-box {
	width: 580rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx 30rpx 30rpx;
	box-sizing: border-box;
}

.filter-popup-box {
	padding-top: 36rpx;
}

.filter-input {
	height: 84rpx;
	border: 1rpx solid #d0d5dd;
	border-radius: 18rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #1d2939;
	background: #f8fafc;
	margin-bottom: 28rpx;
}

.range-input-row {
	display: flex;
	align-items: center;
	margin-bottom: 28rpx;
}

.range-input {
	flex: 1;
	margin-bottom: 0;
}

.range-separator {
	font-size: 32rpx;
	color: #667085;
	margin: 0 20rpx;
	flex-shrink: 0;
}

.popup-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #1d2939;
	text-align: center;
	display: block;
	margin-bottom: 18rpx;
}

.popup-desc {
	font-size: 26rpx;
	line-height: 40rpx;
	color: #667085;
	text-align: center;
	display: block;
	margin-bottom: 32rpx;
}

.popup-btn-group {
	display: flex;
	justify-content: space-between;
}

.popup-btn {
	flex: 1;
	height: 84rpx;
	line-height: 84rpx;
	text-align: center;
	border-radius: 42rpx;
	font-size: 28rpx;
}

.popup-btn.cancel-btn {
	margin-right: 20rpx;
	background: #f5f7fa;
	color: #667085;
	border: none;
}

.popup-btn.confirm-btn {
	background: linear-gradient(90deg, #11a968, #0f9a60);
	color: #fff;
	border: none;
}
</style>
