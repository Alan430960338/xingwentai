<template>
	<view class="page-wrap">
		<AppHeader title="提现" content="申请提现" :back="true" :imageType="1"></AppHeader>
		<view class="tip-box">
			<text class="tip-text">提交后一般1-2个工作日到账。</text>
		</view>

		<view class="form-list">
			<view class="form-item">
				<text class="label">可提现金额</text>
				<input class="input-value" v-model="walletMoney" type="digit" placeholder="请输入可提现金额" />
			</view>

			<view class="form-item">
				<text class="label">提现金额</text>
				<input class="input-value" v-model="formData.money" type="digit" placeholder="请输入提现金额" />
			</view>

			<view class="form-item selectable-item" @click="chooseWithdrawType">
				<text class="label">收款方式</text>
				<view class="value-row">
					<text class="value" :class="{ 'placeholder-text': !withdrawTypeText }">{{ withdrawTypeText || '请选择收款方式' }}</text>
					<uni-icons type="right" size="18" color="#98a2b3" />
				</view>
			</view>
		</view>

		<mybtn text="提现" type="primary" style="position: fixed; bottom: 30rpx; left: 30rpx; right: 30rpx;" @click="submitWithdrawForm"></mybtn>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import mybtn from '@/components/button/btmBtn.vue'
import { getWalletInfo, submitWithdraw } from '@/api/engineer.js'

const walletMoney = ref('0.00')
const submitting = ref(false)
const formData = ref({
	money: '',
	type_data: ''
})

const withdrawTypeOptions = [
	{ label: '支付宝', value: '1' },
	{ label: '微信', value: '2' }
]

const withdrawTypeText = computed(() => {
	return withdrawTypeOptions.find(item => item.value === formData.value.type_data)?.label || ''
})

const fetchWalletInfo = async () => {
	try {
		const res = await getWalletInfo()
		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '钱包信息获取失败', icon: 'none' })
			return
		}

		walletMoney.value = res.data?.money ? String(res.data.money) : '0.00'
	} catch (error) {
		uni.showToast({ title: '钱包信息获取失败', icon: 'none' })
	}
}

const chooseWithdrawType = () => {
	uni.showActionSheet({
		itemList: withdrawTypeOptions.map(item => item.label),
		success: res => {
			formData.value.type_data = withdrawTypeOptions[res.tapIndex]?.value || ''
		}
	})
}

const submitWithdrawForm = async () => {
	if (submitting.value) {
		return
	}

	if (!walletMoney.value) {
		uni.showToast({ title: '请先填写可提现金额', icon: 'none' })
		return
	}

	if (!formData.value.money.trim()) {
		uni.showToast({ title: '请输入提现金额', icon: 'none' })
		return
	}

	if (!formData.value.type_data) {
		uni.showToast({ title: '请选择收款方式', icon: 'none' })
		return
	}

	submitting.value = true

	try {
		const res = await submitWithdraw({
			money: Number(formData.value.money),
			type_data: formData.value.type_data
		})

		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '提现失败', icon: 'none' })
			return
		}

		uni.showToast({ title: '提现成功', icon: 'success' })
		setTimeout(() => {
			uni.navigateBack()
		}, 1200)
	} catch (error) {
		uni.showToast({ title: '提现失败', icon: 'none' })
	} finally {
		submitting.value = false
	}
}

onShow(() => {
	fetchWalletInfo()
})
</script>

<style scoped>
.page-wrap {
	margin: 0 auto;
	background-color: #f0f7ff;
	padding-bottom: 120rpx;
	min-height: 100vh;
	width: 750rpx;
	box-sizing: border-box;
}

.tip-box {
	background-color: #f2f8ff;
	border-radius: 20rpx;
	padding: 20rpx;
	margin: 0 30rpx 30rpx;
	border: 1rpx solid #bddaff;
}

.tip-text {
	font-size: 24rpx;
	color: #1765de;
	line-height: 48rpx;
}

.form-list {
	margin: 0 30rpx;
}

.form-item {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
}

.label {
	font-size: 28rpx;
	color: #888;
	display: block;
	margin-bottom: 12rpx;
}

.value {
	font-size: 30rpx;
	color: #111;
	font-weight: 500;
}

.input-value {
	height: 76rpx;
	line-height: 76rpx;
	font-size: 30rpx;
	color: #111;
	background: #f8fafc;
	border-radius: 16rpx;
	padding: 0 20rpx;
	border: 1rpx solid #d0d5dd;
}

.selectable-item {
	position: relative;
}

.value-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.placeholder-text {
	color: #98a2b3;
}
</style>
