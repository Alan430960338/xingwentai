<template>
	<view class="page-wrap">
		<AppHeader :title="pageTitle" :content="pageContent" :back="true"></AppHeader>

		<view class="form-wrap">
			<view class="form-card">
				<view class="form-item" @click="selectOwnerType">
					<text class="label">发票类型</text>
					<view class="picker-row">
						<text class="value" :class="{ 'placeholder-text': !formData.owner_date }">{{ selectedOwnerTypeText }}</text>
						<text class="arrow">></text>
					</view>
				</view>

				<view class="form-item">
					<text class="label">发票抬头</text>
					<input
						v-model="formData.title"
						class="input"
						placeholder="请输入企业名称"
						placeholder-class="input-placeholder"
					/>
				</view>

				<view v-if="showTaxNoField" class="form-item">
					<text class="label">统一社会信用代码 / 纳税人识别号</text>
					<input
						v-model="formData.tax_no"
						class="input"
						placeholder="请输入税号"
						placeholder-class="input-placeholder"
					/>
				</view>

				<view class="form-item no-border">
					<text class="label">邮箱</text>
					<input
						v-model="formData.email"
						class="input"
						placeholder="请输入接收邮箱"
						placeholder-class="input-placeholder"
					/>
				</view>
			</view>

			<view class="form-card switch-card" @click="toggleDefaultStatus">
				<view>
					<text class="switch-title">设为默认抬头</text>
					<text class="switch-desc">申请发票时优先使用该抬头</text>
				</view>
				<view class="switch-pill" :class="{ active: formData.is_default_data === '1' }">
					<view class="switch-dot"></view>
				</view>
			</view>
		</view>

		<myBtn :text="submitButtonText" @click="handleSubmit" type="primary"
			style="position: absolute; bottom: 30rpx; left: 30rpx; right: 30rpx;"></myBtn>
	</view>
</template>

<script setup>
	import { computed, reactive, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import AppHeader from '@/components/header.vue'
	import myBtn from '@/components/button/btmBtn.vue'
	import { addInvoiceTitle, editInvoiceTitle, getInvoiceTitleDetail } from '@/api/user.js'

	const submitting = ref(false)
	const titleId = ref('')
	const ownerTypeOptions = [
		{ label: '普通发票', value: '1' },
		{ label: '增值发票', value: '2' }
	]

	const formData = reactive({
		owner_date: '',
		title: '',
		tax_no: '',
		email: '',
		is_default_data: '2'
	})

	const selectedOwnerTypeText = computed(() => {
		const current = ownerTypeOptions.find(item => item.value === formData.owner_date)
		return current ? current.label : '请选择发票类型'
	})

	const isEditMode = computed(() => Boolean(titleId.value))
	const pageTitle = computed(() => isEditMode.value ? '编辑发票抬头' : '新增发票抬头')
	const pageContent = computed(() => isEditMode.value ? '编辑开票信息' : '新增开票信息')
	const submitButtonText = computed(() => isEditMode.value ? '保存修改' : '提交')
	const showTaxNoField = computed(() => formData.owner_date === '2')

	const selectOwnerType = () => {
		uni.showActionSheet({
			itemList: ownerTypeOptions.map(item => item.label),
			success: res => {
				formData.owner_date = ownerTypeOptions[res.tapIndex]?.value || ''
				if (formData.owner_date === '1') {
					formData.tax_no = ''
				}
			}
		})
	}

	const validateEmail = email => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	const fillFormData = data => {
		formData.owner_date = String(data.owner_date || '')
		formData.title = data.title || ''
		formData.tax_no = data.tax_no || ''
		formData.email = data.email || ''
		formData.is_default_data = String(data.is_default_data || '2')

		if (formData.owner_date === '1') {
			formData.tax_no = ''
		}
	}

	const toggleDefaultStatus = () => {
		formData.is_default_data = formData.is_default_data === '1' ? '2' : '1'
	}

	const fetchInvoiceTitleDetail = async id => {
		try {
			const res = await getInvoiceTitleDetail({ id })

			if (res.code !== 1) {
				uni.showToast({
					title: res.msg || '发票抬头详情获取失败',
					icon: 'none'
				})
				return
			}

			fillFormData(res.data || {})
		} catch (error) {
			uni.showToast({
				title: '发票抬头详情获取失败',
				icon: 'none'
			})
		}
	}

	const handleSubmit = async () => {
		if (submitting.value) {
			return
		}

		if (!formData.owner_date) {
			uni.showToast({ title: '请选择发票类型', icon: 'none' })
			return
		}

		if (!formData.title.trim()) {
			uni.showToast({ title: '请输入发票抬头', icon: 'none' })
			return
		}

		if (showTaxNoField.value && !formData.tax_no.trim()) {
			uni.showToast({ title: '请输入税号', icon: 'none' })
			return
		}

		if (!formData.email.trim()) {
			uni.showToast({ title: '请输入邮箱', icon: 'none' })
			return
		}

		if (!validateEmail(formData.email.trim())) {
			uni.showToast({ title: '请输入正确的邮箱', icon: 'none' })
			return
		}

		submitting.value = true

		try {
			const payload = {
				owner_date: formData.owner_date,
				title: formData.title.trim(),
				tax_no: showTaxNoField.value ? formData.tax_no.trim() : '',
				email: formData.email.trim(),
				is_default_data: formData.is_default_data
			}

			if (isEditMode.value) {
				payload.id = Number(titleId.value)
			}

			const res = isEditMode.value
				? await editInvoiceTitle(payload)
				: await addInvoiceTitle(payload)

			if (res.code !== 1) {
				uni.showToast({
					title: res.msg || (isEditMode.value ? '编辑发票抬头失败' : '新增发票抬头失败'),
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
				title: isEditMode.value ? '编辑发票抬头失败' : '新增发票抬头失败',
				icon: 'none'
			})
		} finally {
			submitting.value = false
		}
	}

	onLoad(options => {
		titleId.value = options?.id || ''
		if (titleId.value) {
			fetchInvoiceTitleDetail(titleId.value)
		}
	})
</script>

<style scoped>
	.page-wrap {
		margin: 0 auto;
		min-height: 100vh;
		background-color: #f0f7ff;
		width: 750rpx;
		box-sizing: border-box;
		padding-bottom: 140rpx;
	}

	.form-wrap {
		padding: 0 30rpx;
	}

	.form-card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 0 28rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.switch-card {
		padding: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 24rpx;
	}

	.form-item {
		padding: 28rpx 0;
		border-bottom: 1rpx solid #edf2f7;
	}

	.no-border {
		border-bottom: none;
	}

	.label {
		display: block;
		font-size: 24rpx;
		color: #667085;
		margin-bottom: 12rpx;
	}

	.input {
		width: 100%;
		height: 52rpx;
		font-size: 30rpx;
		color: #1d2939;
	}

	.input-placeholder {
		font-size: 28rpx;
		color: #98a2b3;
	}

	.picker-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
	}

	.value {
		flex: 1;
		font-size: 30rpx;
		color: #1d2939;
	}

	.placeholder-text {
		color: #98a2b3;
	}

	.arrow {
		font-size: 28rpx;
		color: #98a2b3;
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

	.switch-pill {
		width: 92rpx;
		height: 52rpx;
		border-radius: 999rpx;
		background: #d0d5dd;
		padding: 4rpx;
		box-sizing: border-box;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
	}

	.switch-pill.active {
		background: #007aff;
		justify-content: flex-end;
	}

	.switch-dot {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		background: #ffffff;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.12);
	}
</style>
