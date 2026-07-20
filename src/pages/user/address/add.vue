<template>
	<view class="page-wrap">
		<AppHeader :title="pageTitle" :content="pageContent" :back="true"></AppHeader>

		<view class="form-box">
			<view class="form-card">
				<text class="card-title">联系人信息</text>

				<view class="form-item">
					<text class="label">联系人</text>
					<input
						v-model="formData.contact_name"
						class="input"
						placeholder="请输入联系人姓名"
						placeholder-class="input-placeholder"
					/>
				</view>

				<view class="form-item no-border">
					<text class="label">联系人电话</text>
					<input
						v-model="formData.contact_phone"
						class="input"
						placeholder="请输入联系人电话"
						placeholder-class="input-placeholder"
						type="number"
					/>
				</view>
			</view>

			<view class="form-card">
				<text class="card-title">地址信息</text>

				<view class="form-item">
					<text class="label">省市区</text>
					<picker mode="multiSelector" :value="areaPickerValue" :range="areaPickerRange" @change="handleAreaChange"
						@columnchange="handleAreaColumnChange">
						<view class="picker-row">
							<text class="picker-text" :class="{ 'picker-placeholder': !areaText }">{{ areaText || '请选择省市区' }}</text>
							<uni-icons type="right"></uni-icons>
						</view>
					</picker>
				</view>

				<view class="form-item no-border">
					<text class="label">详细地址</text>
					<textarea
						v-model="formData.address"
						class="textarea"
						placeholder="请输入详细地址，如街道、门牌号、楼层等"
						placeholder-class="input-placeholder"
					/>
				</view>
			</view>

			<view class="form-card switch-card">
				<view>
					<text class="switch-title">设为默认地址</text>
					<text class="switch-desc">下次下单时优先使用该地址</text>
				</view>
				<switch :checked="formData.is_default === 1" color="#007aff" @change="handleDefaultChange" />
			</view>

		</view>

		<myBtn :text="submitButtonText" @click="handleSubmit" type="primary" style="position: absolute;  left: 30rpx; right: 30rpx; "></myBtn>
	</view>
</template>

<script setup>
	import { computed, onMounted, reactive, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import myBtn from '@/components/button/btmBtn.vue'
	import { addAddress, editAddress, getAddressDetail } from '@/api/user.js'
	import { getAreaList } from '@/api/common.js'

	const addressId = ref('')
	const formData = reactive({
		contact_name: '',
		contact_phone: '',
		province: '',
		city: '',
		district: '',
		address: '',
		is_default: 0
	})
	const areaLoading = ref(false)
	const areaOptions = ref([])
	const areaPickerValue = ref([0, 0, 0])
	const areaPickerRange = ref([[], [], []])
	const selectedAreaNames = reactive({
		province: '',
		city: '',
		district: ''
	})
	const submitting = ref(false)
	const detailLoading = ref(false)

	const isEditMode = computed(() => Boolean(addressId.value))
	const pageTitle = computed(() => isEditMode.value ? '编辑地址' : '新增地址')
	const pageContent = computed(() => isEditMode.value ? '编辑常用地址' : '新增常用地址')
	const submitButtonText = computed(() => isEditMode.value ? '保存修改' : '保存地址')

	const areaText = computed(() => {
		return [selectedAreaNames.province, selectedAreaNames.city, selectedAreaNames.district].filter(Boolean).join(' ')
	})

	const handleDefaultChange = event => {
		formData.is_default = event.detail.value ? 1 : 0
	}

	const fetchAreaList = async () => {
		if (areaLoading.value || areaOptions.value.length > 0) {
			return
		}

		areaLoading.value = true

		try {
			const res = await getAreaList()
			if (res.code !== 1) {
				uni.showToast({ title: res.msg || '地区数据获取失败', icon: 'none' })
				return
			}

			areaOptions.value = Array.isArray(res.data) ? res.data : []
			initAreaPickerRange()
		} catch (error) {
			uni.showToast({ title: '地区数据获取失败', icon: 'none' })
		} finally {
			areaLoading.value = false
		}
	}

	const initAreaPickerRange = () => {
		const provinceList = areaOptions.value
		const cityList = provinceList[0]?.childlist || []
		const districtList = cityList[0]?.childlist || []

		areaPickerRange.value = [
			provinceList.map(item => item.name),
			cityList.map(item => item.name),
			districtList.map(item => item.name)
		]
	}

	const applyAreaSelection = (provinceIndex, cityIndex, districtIndex) => {
		const provinceList = areaOptions.value
		const cityList = provinceList[provinceIndex]?.childlist || []
		const districtList = cityList[cityIndex]?.childlist || []
		const province = provinceList[provinceIndex]
		const city = cityList[cityIndex]
		const district = districtList[districtIndex]

		areaPickerRange.value = [
			provinceList.map(item => item.name),
			cityList.map(item => item.name),
			districtList.map(item => item.name)
		]
		areaPickerValue.value = [provinceIndex, cityIndex, districtIndex]
		selectedAreaNames.province = province?.name || ''
		selectedAreaNames.city = city?.name || ''
		selectedAreaNames.district = district?.name || ''
		formData.province = province?.name || ''
		formData.city = city?.name || ''
		formData.district = district?.name || ''
	}

	const matchAreaIndex = (list, value) => {
		if (!Array.isArray(list) || !value) {
			return -1
		}

		return list.findIndex(item => String(item.id) === String(value) || item.name === value || item.shortname === value)
	}

	const syncAreaSelection = (provinceValue, cityValue, districtValue) => {
		if (areaOptions.value.length === 0) {
			return
		}

		const provinceIndex = Math.max(matchAreaIndex(areaOptions.value, provinceValue), 0)
		const cityList = areaOptions.value[provinceIndex]?.childlist || []
		const cityIndex = Math.max(matchAreaIndex(cityList, cityValue), 0)
		const districtList = cityList[cityIndex]?.childlist || []
		const districtIndex = Math.max(matchAreaIndex(districtList, districtValue), 0)

		applyAreaSelection(provinceIndex, cityIndex, districtIndex)
	}

	const fillAddressForm = data => {
		formData.contact_name = data.contact_name || ''
		formData.contact_phone = data.contact_phone || ''
		formData.address = data.address || ''
		formData.is_default = Number(data.is_default || 0)
		syncAreaSelection(data.province, data.city, data.district)
	}

	const updateAreaPickerRange = (column, value) => {
		const currentValue = [...areaPickerValue.value]
		currentValue[column] = value

		if (column === 0) {
			currentValue[1] = 0
			currentValue[2] = 0
			applyAreaSelection(currentValue[0], currentValue[1], currentValue[2])
		}

		if (column === 1) {
			currentValue[2] = 0
			applyAreaSelection(currentValue[0], currentValue[1], currentValue[2])
		}

		areaPickerValue.value = currentValue
	}

	const handleAreaColumnChange = event => {
		if (areaOptions.value.length === 0) {
			return
		}

		updateAreaPickerRange(event.detail.column, event.detail.value)
	}

	const handleAreaChange = event => {
		if (areaOptions.value.length === 0) {
			uni.showToast({ title: '地区数据加载中', icon: 'none' })
			return
		}

		const [provinceIndex, cityIndex, districtIndex] = event.detail.value
		applyAreaSelection(provinceIndex, cityIndex, districtIndex)
	}

	const fetchAddressDetail = async id => {
		if (!id) {
			return
		}

		detailLoading.value = true

		try {
			const res = await getAddressDetail({ id })

			if (res.code !== 1) {
				uni.showToast({
					title: res.msg || '地址详情获取失败',
					icon: 'none'
				})
				return
			}

			fillAddressForm(res.data || {})
		} catch (error) {
			uni.showToast({
				title: '地址详情获取失败',
				icon: 'none'
			})
		} finally {
			detailLoading.value = false
		}
	}

	const validatePhone = phone => {
		return /^1\d{10}$/.test(phone)
	}

	const handleSubmit = async () => {
		await fetchAreaList()

		if (submitting.value) {
			return
		}

		if (!formData.contact_name.trim()) {
			uni.showToast({ title: '请输入联系人', icon: 'none' })
			return
		}

		if (!formData.contact_phone.trim()) {
			uni.showToast({ title: '请输入联系人电话', icon: 'none' })
			return
		}

		if (!validatePhone(formData.contact_phone.trim())) {
			uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
			return
		}

		if (!formData.province.trim()) {
			uni.showToast({ title: '请选择省市区', icon: 'none' })
			return
		}

		if (!formData.city.trim()) {
			uni.showToast({ title: '请选择省市区', icon: 'none' })
			return
		}

		if (!formData.district.trim()) {
			uni.showToast({ title: '请选择省市区', icon: 'none' })
			return
		}

		if (!formData.address.trim()) {
			uni.showToast({ title: '请输入详细地址', icon: 'none' })
			return
		}

		if (detailLoading.value) {
			return
		}

		submitting.value = true

		try {
			const payload = {
				contact_name: formData.contact_name.trim(),
				contact_phone: formData.contact_phone.trim(),
				province: selectedAreaNames.province.trim(),
				city: selectedAreaNames.city.trim(),
				district: selectedAreaNames.district.trim(),
				address: formData.address.trim(),
				is_default: formData.is_default
			}

			if (isEditMode.value) {
				payload.id = Number(addressId.value)
			}

			const res = isEditMode.value ? await editAddress(payload) : await addAddress(payload)

			if (res.code !== 1) {
				uni.showToast({
					title: res.msg || (isEditMode.value ? '编辑地址失败' : '新增地址失败'),
					icon: 'none'
				})
				return
			}

			uni.showToast({
				title: res.msg || (isEditMode.value ? '修改成功' : '新增成功'),
				icon: 'success'
			})

			setTimeout(() => {
				uni.navigateBack()
			}, 500)
		} catch (error) {
			uni.showToast({
				title: isEditMode.value ? '编辑地址失败' : '新增地址失败',
				icon: 'none'
			})
		} finally {
			submitting.value = false
		}
	}

	onLoad(options => {
		addressId.value = options?.id || ''
	})

	onMounted(async () => {
		await fetchAreaList()
		if (addressId.value) {
			fetchAddressDetail(addressId.value)
		}
	})
</script>

<style scoped>
	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background: linear-gradient(180deg, #eef6ff 0%, #f7fbff 100%);
		width: 750rpx;
		padding-bottom: 140rpx;
		box-sizing: border-box;
	}

	.form-box {
		padding: 0 30rpx;
	}

	.form-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 8rpx 28rpx rgba(28, 86, 170, 0.08);
	}

	.card-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #1d2939;
		display: block;
		margin-bottom: 16rpx;
	}

	.form-item {
		padding: 24rpx 0;
		border-bottom: 1rpx solid #edf2f7;
	}

	.no-border {
		border-bottom: none;
		padding-bottom: 0;
	}

	.label {
		font-size: 24rpx;
		color: #667085;
		display: block;
		margin-bottom: 14rpx;
	}

	.input {
		width: 100%;
		height: 52rpx;
		font-size: 30rpx;
		color: #1d2939;
	}

	.textarea {
		width: 100%;
		height: 160rpx;
		font-size: 30rpx;
		color: #1d2939;
		line-height: 44rpx;
	}

	.input-placeholder {
		color: #98a2b3;
		font-size: 28rpx;
	}

	.picker-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
	}

	.picker-text {
		flex: 1;
		font-size: 30rpx;
		color: #1d2939;
	}

	.picker-placeholder {
		color: #98a2b3;
	}

	.picker-arrow {
		font-size: 28rpx;
		color: #98a2b3;
	}

	.switch-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.switch-title {
		font-size: 30rpx;
		color: #1d2939;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
	}

	.switch-desc {
		font-size: 24rpx;
		color: #98a2b3;
	}

</style>
