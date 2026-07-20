<template>
	<view class="page-wrap">
		<AppHeader title="钱包" content="我的钱包"></AppHeader>
		<!-- 顶部金额统计卡片 -->
		<view class="stat-row">
			<view class="stat-item" v-for="(item, idx) in statData" :key="idx">
				<text class="stat-money">{{ item.money }}</text>
				<text class="stat-label">{{ item.label }}</text>
			</view>
		</view>

		<!-- 平台规则卡片 -->
		<view class="rule-card">
			<text class="rule-title">平台服务规则</text>
			<text class="rule-txt">{{ walletInfo.rules || '暂无规则说明' }}</text>
		</view>

		<!-- 账单明细区域 -->
		<view class="bill-card">
			<text class="card-title">账单明细</text>
			<!-- 月份下拉选择框 -->
		<!-- 	<view class="month-select">
				<text class="month-text">{{ currentMonth }}</text>
				<uni-icons type="arrowdown" size="28" color="#666" />
			</view> -->

			<!-- 账单列表 -->
			<view class="bill-list">
				<view v-if="billData.length === 0" class="empty-bill">暂无账单明细</view>
				<view class="bill-item" v-for="(item, idx) in billData" :key="idx">
					<view class="bill-left">
						<text class="bill-name">{{ item.name }}</text>
						<text class="bill-desc">{{ item.desc }}</text>
					</view>
					<view class="bill-right">
						<text class="bill-amount" :class="item.type">{{ item.amount }}</text>
						<text class="look-txt">余额 {{ item.after }}</text>
					</view>
				</view>
			</view>
		</view>
		<mybtn text="提现" type="primary" style="position: absolute; left: 30rpx;right: 30rpx;"@click.stop="gotoWallet"></mybtn>
		<bar tabname="wallet"></bar>
	</view>
</template>

<script setup>
	import AppHeader from '@/components/header.vue'
	import bar from '@/components/tabBer/engineer.vue'
	import mybtn from '@/components/button/btmBtn.vue'
	import {
		computed,
		ref
	} from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { getWalletDetail, getWalletInfo } from '@/api/engineer.js'

	const walletInfo = ref({
		money: '0.00',
		to_be_settled: 0,
		settled: 0,
		rules: ''
	})

	const statData = computed(() => ([
		{
			money: `¥${formatMoney(walletInfo.value.money)}`,
			label: '可提现'
		},
		{
			money: `¥${formatMoney(walletInfo.value.to_be_settled)}`,
			label: '待结算'
		},
		{
			money: `¥${formatMoney(walletInfo.value.settled)}`,
			label: '累计收入'
		}
	]))

	// 当前选择月份
	const currentMonth = ref('2026年6月')
	const billData = ref([])

	const formatMoney = value => {
		if (value === null || value === undefined || value === '') {
			return '0.00'
		}

		return Number(value).toFixed(2)
	}

	const formatTime = timestamp => {
		if (!timestamp) {
			return '--'
		}

		const normalizedTimestamp = timestamp.toString().length === 13 ? Number(timestamp) : Number(timestamp) * 1000
		const date = new Date(normalizedTimestamp)
		if (Number.isNaN(date.getTime())) {
			return '--'
		}

		const padZero = value => String(value).padStart(2, '0')
		return `${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
	}

	const fetchWalletInfo = async () => {
		try {
			const res = await getWalletInfo()
			if (res.code !== 1) {
				uni.showToast({ title: res.msg || '钱包信息获取失败', icon: 'none' })
				return
			}

			walletInfo.value = {
				money: res.data?.money ?? '0.00',
				to_be_settled: res.data?.to_be_settled ?? 0,
				settled: res.data?.settled ?? 0,
				rules: res.data?.rules || ''
			}
		} catch (error) {
			uni.showToast({ title: '钱包信息获取失败', icon: 'none' })
		}
	}

	const fetchWalletDetail = async () => {
		try {
			const res = await getWalletDetail({ page: 1, limit: 15 })
			if (res.code !== 1) {
				uni.showToast({ title: res.msg || '账单明细获取失败', icon: 'none' })
				return
			}

			const list = Array.isArray(res.data?.data) ? res.data.data : []
			billData.value = list.map(item => {
				const amountValue = Number(item.money || 0)
				const isIncome = amountValue >= 0
				return {
					id: item.id,
					name: item.memo || '钱包变动',
					desc: `账单明细·${formatTime(item.createtime)}`,
					amount: `${isIncome ? '+' : '-'} ¥${formatMoney(Math.abs(amountValue))}`,
					type: isIncome ? 'income' : 'out',
					after: `¥${formatMoney(item.after)}`
				}
			})
		} catch (error) {
			uni.showToast({ title: '账单明细获取失败', icon: 'none' })
		}
	}
	
	
	const gotoWallet = ()=>{
		uni.navigateTo({
			url: '/pages/engineer/wallet/withDrawal'
		})
	}

	onShow(() => {
		fetchWalletInfo()
		fetchWalletDetail()
	})
	
</script>

<style scoped>


	.page-wrap {
		width: 750rpx;
		padding: 0 0rpx 120rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #f0f7ff;
	}

	/* 顶部统计三栏 */
	.stat-row {
		margin: 30rpx 0;
		padding: 0 30rpx;
		box-sizing: border-box;
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

	/* 平台规则卡片 */
	.rule-card {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		background: #fff;
		border-radius: 20rpx;
		padding: 36rpx 32rpx;
		margin: 0 30rpx;
	}

	.rule-title {
		font-size: 32rpx;
		color: #888;
		display: block;
		margin-bottom: 12rpx;
	}

	.rule-txt {
		font-size: 28rpx;
		color: #111;
		font-weight: 500;
	}

	/* 账单明细卡片 */
	.bill-card {
		margin: 20rpx 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		background: #fff;
		border-radius: 20rpx;
		padding: 36rpx 32rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	}

	.card-title {
		font-size: 30rpx;
		color: #1d2939;
		font-weight: 600;
		display: block;
		margin-bottom: 30rpx;
	}

	.month-select {
		width: 100%;
		height: 90rpx;
		border: 1rpx solid #e0efff;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		background-color: #f7fbff;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-bottom: 40rpx;
	}

	.month-text {
		font-size: 28rpx;
		color: #333;
	}

	/* 账单列表项 */
	.bill-item {
		display: flex;
		justify-content: space-between;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 1rpx dashed #e5edf7;
	}

	.bill-item:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.empty-bill {
		text-align: center;
		font-size: 26rpx;
		color: #98a2b3;
		padding: 30rpx 0;
	}

	.bill-left {
		flex: 1;
	}

	.bill-name {
		font-size: 30rpx;
		color: #111;
		font-weight: 500;
		display: block;
	}

	.bill-desc {
		font-size: 26rpx;
		color: #888;
		display: block;
		margin-top: 10rpx;
	}

	.bill-right {
		text-align: right;
	}

	.bill-amount {
		font-size: 30rpx;
		font-weight: 500;
		display: block;
	}

	.bill-amount.income {
		color: #0fb361;
	}

	.bill-amount.out {
		color: #111;
	}

	.look-txt {
		font-size: 26rpx;
		color: #888;
		margin-top: 10rpx;
		display: block;
	}
</style>
