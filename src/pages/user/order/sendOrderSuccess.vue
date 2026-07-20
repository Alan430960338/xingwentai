<template>
	<view class="page-wrap">
		<AppHeader title="发布成功" content="发布成功"   :imageType=2></AppHeader>
		<view class="success-card">
			<view class="success-icon">
				<uni-icons type="checkmarkempty" size="20" color="#34c759" />
			</view>
			<text class="success-text">已发布至大厅</text>
		</view>

		<view v-if="loading" class="loading-card">订单详情加载中...</view>

		<view v-else class="order-card">
			<view class="order-title-row">
				<text class="order-title">{{ detailData.title || '未命名工单' }}</text>
				<view class="order-tag">
					<text class="tag-text">{{ formatStatus(detailData.status) }}</text>
				</view>
			</view>

			<view class="order-title-row-tag">
				<view class="tag1">
					SLA <text>{{ formatHours(detailData.hours) }}</text>
				</view>

				<view class="tag2">
					{{ detailData.category_name || '暂无分类' }}
				</view>
			</view>

			<view class="order-info-row">
				<text class="info-label">服务地址</text>
				<text class="info-value">{{ detailData.address || '--' }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">服务时间</text>
				<text class="info-value">{{ formatTime(detailData.planned_time || detailData.planned_start_time) }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">联系人</text>
				<text class="info-value">{{ formatContact(detailData.nickname, detailData.mobile) }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">服务商</text>
				<text class="info-value">{{ detailData.service_name || '暂未分配' }}</text>
			</view>

			<view class="order-info-row">
				<text class="info-label">故障描述</text>
				<text class="info-value">{{ detailData.fault_description || '--' }}</text>
			</view>

			<view class="order-info-row no-border">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{ detailData.order_sn || detailData.id || '--' }}</text>
			</view>

			<view class="line-container">
				<view class="bottom-line" />
				<view class="bottom-line" />
				<view class="bottom-line" />
				<view class="bottom-line" />
			</view>
			<view class="totle-price">
				<view>
					￥<text class="price">{{ formatMoney(detailData.budget_amount) }}</text>
				</view>
				<view style="display: flex;">
					<view class="cancel-btn" @click.stop="cancelOrder">
						取消
					</view>
					<view class="edit-btn" @click.stop="editOrder">
						修改订单
					</view>
				</view>
			</view>
		</view>

		<mybtn text="回到首页"@click="gohome" type="primary" style="position: fixed; bottom: 30rpx; left: 30rpx;right: 30rpx;"></mybtn>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import mybtn from '@/components/button/btmBtn.vue'
	import { cancelUserOrder, getUserOrderDetail } from '@/api/user.js'

	const loading = ref(false)
	const detailData = ref({})

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

	const formatStatus = status => {
		const statusMap = {
			0: '未支付',
			1: '待接单',
			2: '待开始',
			3: '进行中',
			4: '已取消',
			5: '已完成',
			6: '超时'
		}

		return statusMap[status] || `状态${status ?? '--'}`
	}

	const fetchOrderDetail = async id => {
		loading.value = true

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
		} finally {
			loading.value = false
		}
	}

	const cancelOrder = () => {
		if (!detailData.value?.id) {
			return
		}

		uni.showModal({
			title: '取消订单',
			content: '',
			editable: true,
			placeholderText: '请输入取消订单原因',
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
						id: detailData.value.id,
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
					fetchOrderDetail(detailData.value.id)
				} catch (error) {
					uni.showToast({
						title: '取消订单失败',
						icon: 'none'
					})
				}
			}
		})
	}

	const gohome = ()=>{
		uni.reLaunch({
			url:'/pages/user/tabbar/index'
		})
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
		background-color: #f0f7ff;
		width: 750rpx;
		box-sizing: border-box;
		padding: 0 0rpx 140rpx;
	}



	.header-row1 {
		width: 100%;
		text-align: center;
	}

	/* 移除gap，用margin-right实现圆点间距 */
	.hearder-point {
		width: 8rpx;
		height: 8rpx;
		background-color: #ffffff;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	/* 最后一个圆点清除右边距 */
	.hearder-point.last-point {
		margin-right: 0;
	}

	.hearder-point-container {
		display: flex;
		justify-content: center;
		align-items: center;
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
		background-color: #deac44;
		border: 2rpx solid #e7c67f;
		border-radius: 50%;
	}

	.page-title {
		margin-top: 40rpx;
		font-size: 38rpx;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
		color: #ffffff;
	}

	.greeting {
		font-weight: 700;
		font-size: 40rpx;
		color: #fff;
		margin-top: 40rpx;
		align-self: flex-start;
	}

	/* 成功提示卡片 */
	.success-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 60rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 30rpx 30rpx;
	}

	.success-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
		background-color: #e6f9ef;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 30rpx;
	}

	.success-text {
		font-size: 38rpx;
		color: #1d2939;
		font-weight: 500;
	}

	.loading-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 60rpx 30rpx;
		text-align: center;
		font-size: 28rpx;
		color: #667085;
		margin: 0 30rpx;
	}

	/* 工单卡片 */
	.order-card {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 80rpx;
		margin: 0 30rpx;
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

	.price {
		font-size: 42rpx;
		color: #0f63d4;
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
	/* 底部首页按钮 */
	.home-btn {
		margin-bottom: 30rpx;
		text-align: center;
		padding: 20rpx 30rpx;
		background: #007aff;
		color: #fff;
		font-size: 34rpx;
		border-radius: 20rpx;
		border: none;
	}
</style>
