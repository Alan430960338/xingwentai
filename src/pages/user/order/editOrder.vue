<template>
	<view class="page-wrap">
		<AppHeader title="修改订单" content="修改订单信息" :back="true"></AppHeader>

		<view class="form-box">
			<view class="form-item" @click="selectCategory">
				<text class="label">项目类型</text>
				<view class="picker-row">
					<text class="picker-value" :class="{ 'placeholder-text': !selectedCategoryText }">{{ selectedCategoryText || '请选择项目类型' }}</text>
					<uni-icons type="right"></uni-icons>
				</view>
			</view>

			<view class="form-item">
				<text class="label">订单标题</text>
				<input v-model="formData.title" class="input" placeholder="请输入订单标题" placeholder-class="input-placeholder" />
			</view>

			<view class="form-item">
				<text class="label">故障描述</text>
				<textarea v-model="formData.description" class="textarea" placeholder="请输入故障描述" placeholder-class="input-placeholder"></textarea>
			</view>

			<view class="form-item" @click="selectAddress">
				<text class="label">服务地址</text>
				<view class="picker-row">
					<text class="picker-value" :class="{ 'placeholder-text': !selectedAddressText }">{{ selectedAddressText || '请选择地址' }}</text>
					<uni-icons type="right"></uni-icons>
				</view>
			</view>

			<view class="form-item">
				<text class="label">计划开始时间</text>
				<picker mode="multiSelector" :value="dateTimePickerValue" :range="dateTimePickerRange" @change="handleDateTimeChange"
					@columnchange="handleDateTimeColumnChange">
					<view class="picker-row inner-picker-row">
						<text class="picker-value">{{ plannedStartTimeText }}</text>
						<uni-icons type="right"></uni-icons>
					</view>
				</picker>
			</view>

			<view class="form-item">
				<text class="label">预算价格</text>
				<input v-model="formData.budgetAmount" class="input" placeholder="请输入预算价格" placeholder-class="input-placeholder" type="digit" />
			</view>

			<view class="form-item arrow-item" @click="selectInvoiceType">
				<text class="label-strong">发票需求</text>
				<view class="picker-row picker-row-right">
					<text class="picker-value text-right" :class="{ 'placeholder-text': formData.invoiceType === '' }">{{ invoiceTypeText }}</text>
					<uni-icons type="right"></uni-icons>
				</view>
			</view>
		</view>

		<mybtn text="保存修改" @click="handleSubmit" type="primary"
			style="position: absolute; left: 30rpx; right: 30rpx;"></mybtn>
	</view>
</template>

<script setup>
	import { computed, onMounted, reactive, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import mybtn from '@/components/button/btmBtn.vue'
	import { getDemandCategoryList, getUserOrderDetail, updateDemand } from '@/api/user.js'

	const orderId = ref('')
	const loading = ref(false)
	const submitting = ref(false)
	const categoryOptions = ref([])
	const addressOptions = ref([])
	const dateTimePickerRange = ref([[], [], [], [], []])
	const dateTimePickerValue = ref([0, 0, 0, 0, 0])
	const formData = reactive({
		categoryId: '',
		title: '',
		description: '',
		addressId: '',
		plannedStartTimestamp: 0,
		budgetAmount: '',
		invoiceType: ''
	})

	const invoiceTypeOptions = [
		{ label: '不需要', value: 0 },
		{ label: '个人普通发票', value: 1 },
		{ label: '企业普通发票', value: 2 },
		{ label: '企业专用发票', value: 3 }
	]

	const selectedCategoryText = computed(() => {
		const current = categoryOptions.value.find(item => String(item.id) === String(formData.categoryId))
		return current?.name || ''
	})

	const selectedAddressText = computed(() => {
		const current = addressOptions.value.find(item => String(item.id) === String(formData.addressId))
		if (!current) {
			return ''
		}

		return [current.province, current.city, current.district, current.address].filter(Boolean).join(' ')
	})

	const invoiceTypeText = computed(() => {
		const current = invoiceTypeOptions.find(item => item.value === formData.invoiceType)
		return current?.label || '请选择发票需求'
	})

	const plannedStartTimeText = computed(() => {
		if (!formData.plannedStartTimestamp) {
			return '请选择计划开始时间'
		}

		const date = new Date(formData.plannedStartTimestamp * 1000)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hour = String(date.getHours()).padStart(2, '0')
		const minute = String(date.getMinutes()).padStart(2, '0')
		return `${year}-${month}-${day} ${hour}:${minute}`
	})

	const fetchCategoryList = async () => {
		if (categoryOptions.value.length > 0) {
			return
		}

		try {
			const res = await getDemandCategoryList({ type: 'type' })
			if (res.code !== 1) {
				uni.showToast({ title: res.msg || '项目类型获取失败', icon: 'none' })
				return
			}

			categoryOptions.value = Array.isArray(res.data) ? res.data : []
		} catch (error) {
			uni.showToast({ title: '项目类型获取失败', icon: 'none' })
		}
	}

	const selectCategory = async () => {
		await fetchCategoryList()
		if (categoryOptions.value.length === 0) {
			uni.showToast({ title: '暂无项目类型', icon: 'none' })
			return
		}

		uni.showActionSheet({
			itemList: categoryOptions.value.map(item => item.name),
			success: res => {
				formData.categoryId = categoryOptions.value[res.tapIndex]?.id || ''
			}
		})
	}

	const selectAddress = () => {
		uni.navigateTo({
			url: '/pages/user/address/address?select=1',
			success: res => {
				res.eventChannel.on('selectAddress', item => {
					if (!item) {
						return
					}

					const exists = addressOptions.value.find(address => String(address.id) === String(item.id))
					if (!exists) {
						addressOptions.value = [item, ...addressOptions.value]
					}

					formData.addressId = item.id || ''
				})
			}
		})
	}

	const selectInvoiceType = () => {
		uni.showActionSheet({
			itemList: invoiceTypeOptions.map(item => item.label),
			success: res => {
				formData.invoiceType = invoiceTypeOptions[res.tapIndex]?.value
			}
		})
	}

	const createYearOptions = () => {
		const currentYear = new Date().getFullYear()
		return Array.from({ length: 11 }, (_, index) => `${currentYear - 5 + index}年`)
	}

	const createMonthOptions = () => {
		return Array.from({ length: 12 }, (_, index) => `${String(index + 1).padStart(2, '0')}月`)
	}

	const createDayOptions = (year, month) => {
		const normalizedYear = String(year).replace('年', '')
		const normalizedMonth = String(month).replace('月', '')
		const days = new Date(Number(normalizedYear), Number(normalizedMonth), 0).getDate()
		return Array.from({ length: days }, (_, index) => `${String(index + 1).padStart(2, '0')}日`)
	}

	const createHourOptions = () => {
		return Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}时`)
	}

	const createMinuteOptions = () => {
		return Array.from({ length: 60 }, (_, index) => `${String(index).padStart(2, '0')}分`)
	}

	const updateDateTimePickerRange = (selectedValue = dateTimePickerValue.value) => {
		const years = createYearOptions()
		const months = createMonthOptions()
		const year = years[selectedValue[0]] || years[0]
		const month = months[selectedValue[1]] || months[0]
		const days = createDayOptions(year, month)
		const hours = createHourOptions()
		const minutes = createMinuteOptions()
		const nextValue = [...selectedValue]

		if (nextValue[2] >= days.length) {
			nextValue[2] = days.length - 1
		}

		dateTimePickerRange.value = [years, months, days, hours, minutes]
		dateTimePickerValue.value = nextValue
	}

	const syncPlannedStartTime = (selectedValue = dateTimePickerValue.value) => {
		const [years, months, days, hours, minutes] = dateTimePickerRange.value
		const year = String(years?.[selectedValue[0]] || '').replace('年', '')
		const month = String(months?.[selectedValue[1]] || '').replace('月', '')
		const day = String(days?.[selectedValue[2]] || '').replace('日', '')
		const hour = String(hours?.[selectedValue[3]] || '').replace('时', '')
		const minute = String(minutes?.[selectedValue[4]] || '').replace('分', '')

		if (!year || !month || !day || !hour || !minute) {
			formData.plannedStartTimestamp = 0
			return
		}

		formData.plannedStartTimestamp = Math.floor(new Date(`${year}-${month}-${day} ${hour}:${minute}:00`).getTime() / 1000)
	}

	const setDateTimePickerByTimestamp = timestamp => {
		const date = timestamp ? new Date(Number(timestamp) * 1000) : new Date()
		const years = createYearOptions()
		const currentYear = `${date.getFullYear()}年`
		const currentMonth = String(date.getMonth() + 1).padStart(2, '0')
		const currentDay = String(date.getDate()).padStart(2, '0')
		const currentHour = String(date.getHours()).padStart(2, '0')
		const currentMinute = String(date.getMinutes()).padStart(2, '0')

		dateTimePickerValue.value = [
			Math.max(years.findIndex(item => item === currentYear), 0),
			Number(currentMonth) - 1,
			Number(currentDay) - 1,
			Number(currentHour),
			Number(currentMinute)
		]

		updateDateTimePickerRange(dateTimePickerValue.value)
		syncPlannedStartTime(dateTimePickerValue.value)
	}

	const handleDateTimeColumnChange = event => {
		const nextValue = [...dateTimePickerValue.value]
		nextValue[event.detail.column] = event.detail.value
		updateDateTimePickerRange(nextValue)
	}

	const handleDateTimeChange = event => {
		dateTimePickerValue.value = [...event.detail.value]
		updateDateTimePickerRange(dateTimePickerValue.value)
		syncPlannedStartTime(dateTimePickerValue.value)
	}

	const fillFormData = data => {
		formData.categoryId = data.category_id || ''
		formData.title = data.title || ''
		formData.description = data.fault_description || ''
		formData.addressId = data.address_id || data.address_data?.id || ''
		formData.budgetAmount = data.budget_amount === null || data.budget_amount === undefined ? '' : String(data.budget_amount)
		formData.invoiceType = data.invoice_type === '' || data.invoice_type === null || data.invoice_type === undefined ? '' : Number(data.invoice_type)

		const selectedAddress = {
			id: data.address_id || data.address_data?.id,
			province: data.address_data?.province || data.province || '',
			city: data.address_data?.city || data.city || '',
			district: data.address_data?.district || data.district || '',
			address: data.address_data?.address || data.address || ''
		}

		if (selectedAddress.id) {
			const exists = addressOptions.value.find(item => String(item.id) === String(selectedAddress.id))
			if (!exists) {
				addressOptions.value = [selectedAddress, ...addressOptions.value]
			}
		}

		setDateTimePickerByTimestamp(data.planned_start_time || data.planned_time)
	}

	const fetchOrderDetail = async id => {
		loading.value = true

		try {
			const res = await getUserOrderDetail({ id })

			if (res.code !== 1) {
				uni.showToast({ title: res.msg || '订单详情获取失败', icon: 'none' })
				return
			}

			fillFormData(res.data || {})
		} catch (error) {
			uni.showToast({ title: '订单详情获取失败', icon: 'none' })
		} finally {
			loading.value = false
		}
	}

	const handleSubmit = async () => {
		if (submitting.value || loading.value) {
			return
		}

		if (!formData.categoryId) {
			uni.showToast({ title: '请选择项目类型', icon: 'none' })
			return
		}

		if (!formData.title.trim()) {
			uni.showToast({ title: '请输入订单标题', icon: 'none' })
			return
		}

		if (!formData.description.trim()) {
			uni.showToast({ title: '请输入故障描述', icon: 'none' })
			return
		}

		if (!formData.addressId) {
			uni.showToast({ title: '请选择服务地址', icon: 'none' })
			return
		}

		if (!formData.plannedStartTimestamp) {
			uni.showToast({ title: '请选择计划开始时间', icon: 'none' })
			return
		}

		if (!formData.budgetAmount) {
			uni.showToast({ title: '请输入预算价格', icon: 'none' })
			return
		}

		if (formData.invoiceType === '') {
			uni.showToast({ title: '请选择发票需求', icon: 'none' })
			return
		}

		submitting.value = true

		try {
			const res = await updateDemand({
				id: Number(orderId.value),
				category_id: Number(formData.categoryId),
				title: formData.title.trim(),
				fault_description: formData.description.trim(),
				address_id: Number(formData.addressId),
				planned_start_time: formData.plannedStartTimestamp,
				budget_amount: Number(formData.budgetAmount),
				invoice_type: Number(formData.invoiceType)
			})

			if (res.code !== 1) {
				uni.showToast({ title: res.msg || '修改订单失败', icon: 'none' })
				return
			}

			uni.showToast({ title: res.msg || '修改成功', icon: 'success' })
			setTimeout(() => {
				uni.navigateBack()
			}, 500)
		} catch (error) {
			uni.showToast({ title: '修改订单失败', icon: 'none' })
		} finally {
			submitting.value = false
		}
	}

	onLoad(options => {
		orderId.value = options?.id || ''
	})

	onMounted(async () => {
		setDateTimePickerByTimestamp(0)
		await fetchCategoryList()
		if (!orderId.value) {
			uni.showToast({ title: '缺少订单ID', icon: 'none' })
			return
		}

		fetchOrderDetail(orderId.value)
	})
</script>

<style scoped>
	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f6fc;
		width: 750rpx;
		box-sizing: border-box;
		padding-bottom: 140rpx;
	}

	.form-box {
		margin: 0 30rpx;
	}

	.form-item {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		background: #fff;
		border-radius: 20rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
	}

	.picker-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16rpx;
	}

	.inner-picker-row {
		padding: 12rpx 0;
	}

	.picker-row-right {
		flex: 1;
	}

	.picker-value {
		flex: 1;
		font-size: 30rpx;
		color: #111;
	}

	.input {
		width: 100%;
		height: 52rpx;
		font-size: 30rpx;
		color: #111;
	}

	.textarea {
		width: 100%;
		height: 160rpx;
		font-size: 30rpx;
		color: #111;
		line-height: 44rpx;
	}

	.input-placeholder {
		color: #98a2b3;
		font-size: 28rpx;
	}

	.placeholder-text {
		color: #98a2b3;
	}

	.label {
		font-size: 26rpx;
		color: #888;
		display: block;
		margin-bottom: 12rpx;
	}

	.label-strong {
		font-size: 28rpx;
		font-weight: 700;
		color: #111;
		flex-shrink: 0;
		margin-right: 24rpx;
	}

	.arrow-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.text-right {
		text-align: right;
	}
</style>
