<template>
	<view class="page-wrap">
		<AppHeader title="发票申请" content="申请开票" :back="true"></AppHeader>
		<view class="form-list">
			<view class="form-item selectable-item" @click="chooseInvoiceTitle">
				<text class="label">发票抬头</text>
				<view class="value-row">
					<text class="value" :class="{ 'placeholder-text': !invoiceForm.title }">{{ invoiceForm.title || '请选择发票抬头' }}</text>
					<uni-icons type="right"></uni-icons>
				</view>
			</view>

			<view class="form-item">
				<text class="label">发票类型</text>
				<text class="value">{{ invoiceTypeText }}</text>
			</view>

			<view class="form-item">
				<text class="label">税号</text>
				<text class="value">{{ invoiceForm.tax_no || '--' }}</text>
			</view>

			<view class="form-item">
				<text class="label">开票金额</text>
				<text class="value">{{ invoiceAmountText }}</text>
			</view>

			<view class="form-item">
				<text class="label">接收邮箱</text>
				<text class="value">{{ invoiceForm.email || '--' }}</text>
			</view>
		</view>
		<mybtn text="提交申请" @click="submitInvoice" type="primary" style="position: absolute; bottom: 30rpx; left: 30rpx;right: 30rpx;"></mybtn>
	</view>
</template>

<script setup>
	import { computed, reactive, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import mybtn from '@/components/button/btmBtn.vue'
	import { applyInvoiceTitle, getInvoiceTitleList } from '@/api/user.js'

	const orderId = ref('')
	const submitting = ref(false)
	const invoiceForm = reactive({
		id: '',
		owner_date: '',
		title: '',
		tax_no: '',
		email: '',
		budget_amount: ''
	})

	const invoiceTypeText = computed(() => {
		const typeMap = {
			'1': '普通发票',
			'2': '增值发票'
		}

		return typeMap[invoiceForm.owner_date] || '--'
	})

	const invoiceAmountText = computed(() => {
		if (!invoiceForm.budget_amount) {
			return '--'
		}

		return `￥${invoiceForm.budget_amount}`
	})

	const applySelectedInvoiceTitle = data => {
		invoiceForm.id = data.id || ''
		invoiceForm.owner_date = String(data.owner_date || '')
		invoiceForm.title = data.title || ''
		invoiceForm.tax_no = data.tax_no || ''
		invoiceForm.email = data.email || ''
	}

	const fetchDefaultInvoiceTitle = async () => {
		try {
			const res = await getInvoiceTitleList({
				page: 1,
				limit: 20
			})

			if (res.code !== 1) {
				return
			}

			const list = Array.isArray(res.data?.data) ? res.data.data : []
			const defaultItem = list.find(item => Number(item.is_default_data) === 1)

			if (!defaultItem) {
				return
			}

			applySelectedInvoiceTitle(defaultItem)
		} catch (error) {
			console.error('获取默认发票抬头失败:', error)
		}
	}

	const chooseInvoiceTitle = () => {
		uni.navigateTo({
			url: '/pages/user/order/invoiceTitle?select=1',
			success: res => {
				res.eventChannel.on('selectInvoiceTitle', data => {
					applySelectedInvoiceTitle(data)
				})
			}
		})
	}

	const submitInvoice = async () => {
		if (submitting.value) {
			return
		}

	  if (!invoiceForm.title) {
	    uni.showToast({ title: '请选择发票抬头', icon: 'none' })
	    return
	  }

		if (!invoiceForm.id) {
			uni.showToast({ title: '发票抬头信息不完整', icon: 'none' })
			return
		}

		submitting.value = true
	
	  try {
	    const res = await applyInvoiceTitle({
	      id: orderId.value,
	      qualifications_id: invoiceForm.id
	    })
	    
	    if (res.code === 200) {
	      uni.showToast({ title: '申请成功', icon: 'success' })
	      setTimeout(() => {
	      	uni.navigateBack()
	      }, 1500)
	    } else {
	      uni.showToast({ title: res.msg, icon: 'none' })
	    }
	  } catch (error) {  // ✅ 必须加上 catch
	    console.error('申请发票失败:', error)
	    uni.showToast({ 
	      title: '网络异常，请稍后重试', 
	      icon: 'none' 
	    })
	  } finally {
			submitting.value = false
	  }
	}

	onLoad(options => {
		orderId.value = options?.id || ''
		if (options?.amount) {
			invoiceForm.budget_amount = options.amount
		}

		fetchDefaultInvoiceTitle()
	})
</script>

<style scoped>


	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
	}

	.form-list {
		margin: 30rpx;
	}

	.form-item {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx 20rpx;
		margin-bottom: 24rpx;
	}

	.label {
		font-size: 28rpx;
		color: #888;
		display: block;
		margin-bottom: 12rpx;
	}

	.value {
		font-size: 28rpx;
		color: #111;
		font-weight: 500;
	}

	.value-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
	}

	.placeholder-text {
		color: #98a2b3;
	}

	.arrow {
		font-size: 28rpx;
		color: #98a2b3;
	}

	.bottom-btn {
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		right: 30rpx;
		text-align: center;
		background-color: #1560da;
		color: #ffffff;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		font-size: 30rpx;
	}
</style>
