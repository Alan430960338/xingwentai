<template>
	<view class="page-wrap">
		<AppHeader title="接单大厅" content="接单大厅12345"  style=""></AppHeader>
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="scroll-wrap">
				<view class="tag-item" v-for="(item, idx) in filterList" :key="idx" @click="handleFilter(item)">
					<text class="tag-text">{{ item.label }}</text>
					<uni-icons type="down" size="12" color="#666" />
				</view>
			</view>
		</view>

		<!-- 工单列表 -->
		<view class="orderList">
			<!-- 空状态 -->
			<view v-if="orderList.length === 0" class="empty-state">
				<uni-icons type="document" size="80" color="#ccc" />
				<text class="empty-text">暂无工单</text>
			</view>

			<!-- 工单卡片列表 -->
			<view class="order-card" v-for="(order, index) in orderList" :key="order.id" @click="gotoDetail(order)">
				<view class="order-title-row">
					<text class="order-title">{{ order.title }}</text>
					<view class="order-tag" :style="{ backgroundColor: getStatusColor(order.status).bg }">
						<text class="tag-text" :style="{ color: getStatusColor(order.status).color }">
							{{ order.status }}
						</text>
					</view>
				</view>

				<view class="order-title-row-tag">
					<div class="tag1">
						SLA <span>{{ order.sla }}</span>小时
					</div>
					<div class="tag2">
						{{ order.type }}
					</div>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务地址</text>
					<text class="info-value">{{ order.address }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务时间</text>
					<text class="info-value">{{ order.serviceTime }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">联系人</text>
					<text class="info-value">{{ order.contact }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务商</text>
					<text class="info-value">{{ order.provider }}</text>
				</view>

				<!-- 进度条 -->
				<div class="line-container">
					<div class="bottom-line" v-for="i in 4" :key="i" :class="{ active: i <= order.progress }" />
				</div>

				<!-- 价格和操作按钮 -->
				<div class="totle-price">
					<view>
						￥<span class="price">{{ order.price }}</span>
					</view>
					<view style="display: flex;">
						<!-- 只保留 点击接单 按钮，固定绿色 #11a968 -->
						<div class="item-btn accept-btn" @click.stop="openConfirmPopup(order)">
							点击接单
						</div>
					</view>
				</div>
			</view>
		</view>

		<!-- 底部确认弹窗 -->
		<view class="popup-mask" v-if="showPopup" @click="closePopup">
			<view class="popup-box" @click.stop>
				<text class="popup-title">确认接单?</text>
				<text class="popup-desc">订单金额￥{{ currentOrder.price }}，计划{{ currentOrder.serviceTime }}到场。</text>
				<view class="popup-btn-group">
					<view class="popup-btn cancel-btn" @click="closePopup">再看看</view>
					<view class="popup-btn confirm-btn" @click="confirmAccept">确认接单</view>
				</view>
			</view>
		</view>

		<bar tabname="home"></bar>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/header.vue'
import bar from '@/components/tabBer/engineer.vue'

// ============ 模拟数据 ============
// 筛选标签
const filterList = ref([
	{ label: '距离', key: 'distance' },
	{ label: '项目类型', key: 'type' },
	{ label: '预算', key: 'budget' },
	{ label: '工期', key: 'duration' }
])

// 工单列表数据
const orderList = ref([
	{
		id: 1,
		title: '机房精密空调告警维修',
		status: '待派单',
		sla: 4,
		type: '机房空调',
		address: '杭州市滨江区江南大道 88 号数康中心',
		serviceTime: '06-18 09:30',
		contact: '王经理 138****5521',
		provider: '杭州维保服务有限公司',
		price: '1,680',
		progress: 1 // 1-4 表示进度
	},
	{
		id: 2,
		title: '服务器硬件故障排查',
		status: '待派单',
		sla: 2,
		type: '服务器',
		address: '杭州市西湖区文三路 100 号高新大厦 5F',
		serviceTime: '06-18 14:00',
		contact: '李工 139****2234',
		provider: '杭州迅维科技',
		price: '3,200.00',
		progress: 3
	},
	{
		id: 3,
		title: '网络设备巡检维护',
		status: '待派单',
		sla: 8,
		type: '网络设备',
		address: '杭州市余杭区未来科技城 66 号',
		serviceTime: '06-17 10:00',
		contact: '张主管 137****8899',
		provider: '杭州网安服务有限公司',
		price: '1,500.00',
		progress: 4
	},
	{
		id: 4,
		title: 'UPS电源更换',
		status: '待派单',
		sla: 6,
		type: '电源设备',
		address: '杭州市萧山区建设一路 168 号',
		serviceTime: '06-16 09:00',
		contact: '陈工 135****6677',
		provider: '杭州电力服务',
		price: '5,200.00',
		progress: 0
	}
])

// 弹窗控制
const showPopup = ref(false)
const currentOrder = ref({})

// ============ 方法 ============

// 获取状态颜色
const getStatusColor = (status) => {
	const colorMap = {
		'待派单': { bg: '#e6f9ef', color: '#11a968' },
		'待接单': { bg: '#fff7e6', color: '#ff7d00' },
		'进行中': { bg: '#e8f3ff', color: '#007aff' },
		'已完成': { bg: '#e6f9ef', color: '#039855' },
		'已取消': { bg: '#f5f5f5', color: '#999' },
		'已超时': { bg: '#ffe8e6', color: '#ff3b30' }
	}
	return colorMap[status] || { bg: '#f5f5f5', color: '#999' }
}

// 筛选
const handleFilter = (item) => {
	uni.showToast({
		title: `筛选: ${item.label}`,
		icon: 'none'
	})
	// TODO: 实现筛选逻辑
}

// 跳转详情
const gotoDetail = (order) => {
	uni.navigateTo({
		url: `/pages/user/order/orderDetail?id=${order.id}`
	})
}

// 打开接单确认弹窗
const openConfirmPopup = (order) => {
	currentOrder.value = order
	showPopup.value = true
}

// 关闭弹窗
const closePopup = () => {
	showPopup.value = false
	currentOrder.value = {}
}

// 确认接单
const confirmAccept = () => {
	// 模拟接单成功
	currentOrder.value.status = '进行中'
	closePopup()
	uni.showToast({
		title: '接单成功',
		icon: 'success'
	})
}

// ============ 生命周期 ============
onMounted(() => {
	// 模拟加载数据
	console.log('工单列表加载完成，共', orderList.value.length, '条')
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

/* ===== 筛选栏 ===== */
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

/* ===== 工单卡片 ===== */
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
	flex-shrink: 0;
}

.info-value {
	font-size: 22rpx;
	color: #1d2939;
	line-height: 32rpx;
	text-align: right;
}

/* ===== 进度条 ===== */
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

/* ===== 价格和按钮 ===== */
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
/* 接单按钮覆盖样式 绿色 #11a968 */
.item-btn.accept-btn {
	background: #11a968;
	color: #fff;
	border: none;
}

.primary-btn {
	background: #007aff;
	color: #fff;
	border: none;
}

/* ===== 空状态 ===== */
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
	margin-top: 30rpx;
}

/* ========== 底部弹窗样式（新增，不改动原有页面样式） ========== */
.popup-mask {
	position: fixed;
	left: 0;
	top: 0;
	width: 750rpx;
	height: 100vh;
	background: rgba(0,0,0,0.4);
	z-index: 999;
	display: flex;
	align-items: flex-end;
}
.popup-box {
	width: 750rpx;
	background: #fff;
	border-radius: 32rpx 32rpx 0 0;
	padding: 60rpx 40rpx;
	box-sizing: border-box;
}
.popup-title {
	font-size: 42rpx;
	color: #111;
	font-weight: 600;
	display: block;
	margin-bottom: 20rpx;
}
.popup-desc {
	font-size: 30rpx;
	color: #666;
	display: block;
	margin-bottom: 30rpx;
}
.popup-btn-group {
	display: flex;
	justify-content: space-between;
}
.popup-btn {
	width: 280rpx;
	padding: 10rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20rpx;
	font-size: 30rpx;
}
.cancel-btn {
	border: 2rpx solid #cce0ff;
	color: #007aff;
}
.confirm-btn {
	background: #11a968;
	color: #fff;
}
</style>