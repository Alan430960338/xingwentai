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
			<view v-if="filteredOrderList.length === 0" class="empty-state">
				<uni-icons type="document" size="80" color="#ccc" />
				<text class="empty-text">暂无工单</text>
			</view>

			<!-- 工单详情卡片 -->
			<view class="order-card" v-for="(order, index) in filteredOrderList" :key="order.id" @click="gotoDetail(order)">
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
					<text class="info-label">计划开始</text>
					<text class="info-value">{{ order.serviceTime }}</text>
				</view>
				<view class="order-info-row">
					<text class="info-label">工期</text>
					<text class="info-value">预计4小时</text>
				</view>
				<view class="order-info-row">
					<text class="info-label">联系人</text>
					<text class="info-value">{{ order.contact }}</text>
				</view>

				<view class="order-info-row">
					<text class="info-label">服务商</text>
					<text class="info-value">{{ order.provider }}</text>
				</view>

				<div class="line-container">
					<div class="bottom-line" v-for="i in 4" :key="i" :class="{ active: i <= order.progress }" />
				</div>
				
				<div class="totle-price">
					<view>
						￥<span class="price">{{ order.price }}</span>
					</view>
					<div class="item-btn" v-if="order.status === '待开始' " @click.stop="cancelOrder(order)">
						立即派工
					</div>

				</div>
			</view>
		</view>


		<bar tabname="workbench"></bar>
	</view>
</template>

<script setup>
	import bar from '@/components/tabBer/service.vue'
	import AppHeader from '@/components/header.vue'
	import { ref, computed } from 'vue'
	
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

// 标签列表
const tabList = [
	{ label: '全部', key: 'all' },
	{ label: '待开始', key: '待接单' },
	{ label: '进行中', key: '进行中' },
	{ label: '已超时', key: '已超时' },
	{ label: '已完成', key: '已完成' }
]

// ============ 模拟数据 ============
const orderList = ref([
	{
		id: 1,
		title: '机房精密空调告警维修',
		status: '待开始',
		sla: 4,
		type: '机房空调',
		address: '杭州市滨江区江南大道 88 号数康中心 3F',
		serviceTime: '2026-06-18 09:30',
		contact: '王经理 138****5521',
		provider: '杭州维保服务有限公司',
		price: '8,600.00',
		progress: 1
	},
	{
		id: 2,
		title: '服务器硬件故障紧急排查',
		status: '进行中',
		sla: 2,
		type: '服务器',
		address: '杭州市西湖区文三路 100 号高新大厦 5F',
		serviceTime: '2026-06-18 14:00',
		contact: '李工 139****2234',
		provider: '杭州迅维科技有限公司',
		price: '3,200.00',
		progress: 3
	},
	{
		id: 3,
		title: '网络设备季度巡检维护',
		status: '已完成',
		sla: 8,
		type: '网络设备',
		address: '杭州市余杭区未来科技城 66 号 A 栋',
		serviceTime: '2026-06-17 10:00',
		contact: '张主管 137****8899',
		provider: '杭州网安服务有限公司',
		price: '1,500.00',
		progress: 4
	},
	{
		id: 4,
		title: 'UPS 电源主机更换',
		status: '已超时',
		sla: 6,
		type: '电源设备',
		address: '杭州市萧山区建设一路 168 号 IDC 机房',
		serviceTime: '2026-06-16 09:00',
		contact: '陈工 135****6677',
		provider: '杭州电力技术服务有限公司',
		price: '5,200.00',
		progress: 2
	},
	{
		id: 5,
		title: '精密空调加湿器故障',
		status: '待接单',
		sla: 3,
		type: '机房空调',
		address: '杭州市拱墅区祥园路 88 号智慧园 2F',
		serviceTime: '2026-06-19 08:30',
		contact: '刘主管 136****7788',
		provider: '杭州空调维保服务中心',
		price: '2,800.00',
		progress: 0
	},
	{
		id: 6,
		title: '网络交换机端口故障',
		status: '已完成',
		sla: 5,
		type: '网络设备',
		address: '杭州市上城区钱江路 66 号金融中心 12F',
		serviceTime: '2026-06-15 16:00',
		contact: '赵经理 159****3344',
		provider: '杭州网络技术有限公司',
		price: '4,100.00',
		progress: 4
	},
	{
		id: 7,
		title: '机柜温湿度异常告警',
		status: '进行中',
		sla: 2,
		type: '机房环境',
		address: '杭州市滨江区科技园路 128 号 5F',
		serviceTime: '2026-06-18 11:00',
		contact: '孙工 188****5566',
		provider: '杭州环境监控服务商',
		price: '1,800.00',
		progress: 2
	},
	{
		id: 8,
		title: '精密空调压缩机维修',
		status: '待开始',
		sla: 12,
		type: '机房空调',
		address: '杭州市西湖区西溪路 525 号数据中心',
		serviceTime: '2026-06-20 09:00',
		contact: '周经理 137****9900',
		provider: '杭州制冷设备维修公司',
		price: '12,000.00',
		progress: 0
	}
])


// ============ 计算属性 - 过滤数据 ============
const filteredOrderList = computed(() => {
	let list = orderList.value
	
	// 状态筛选
	if (currentTab.value !== 'all') {
		list = list.filter(item => item.status === currentTab.value)
	}
	
	// 关键词搜索
	if (searchKeyword.value.trim()) {
		const keyword = searchKeyword.value.trim()
		list = list.filter(item => 
			item.title.includes(keyword) || 
			item.address.includes(keyword) || 
			item.contact.includes(keyword) ||
			item.provider.includes(keyword)
		)
	}
	
	return list
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
		'已超时': { bg: '#ffe8e6', color: '#ff3b30' }
	}
	return colorMap[status] || { bg: '#f5f5f5', color: '#999' }
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
		url: `/pages/engineer/order/orderDetails?id=${order.id}`
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