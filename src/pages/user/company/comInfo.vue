<template>
	<view class="page-wrap">
		<AppHeader title="企业资料" content="企业资料" :back="true"></AppHeader>

		<view class="form-list">
			<view class="form-item">
				<text class="label">企业名称</text>
				<input class="input-value" v-model="formData.company_name" placeholder="请输入企业名称" />
			</view>

			<view class="form-item">
				<text class="label">联系人</text>
				<input class="input-value" v-model="formData.contact" placeholder="请输入联系人姓名" />
			</view>

			<view class="form-item">
				<text class="label">联系电话</text>
				<input class="input-value" v-model="formData.phone" type="number" placeholder="请输入联系电话" />
			</view>

			<view class="form-item">
				<text class="label">统一社会信用代码</text>
				<input class="input-value" v-model="formData.credit_code" placeholder="请输入统一社会信用代码" />
			</view>

			<view v-if="hasEnterpriseAuth" class="form-item">
				<text class="label">认证状态</text>
				<text class="value">已认证</text>
			</view>

			<view class="submit-btn" @click="handleSubmit">{{ hasEnterpriseAuth ? '保存' : '提交认证' }}</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import { editEnterpriseAuth, getEnterpriseAuthDetail, submitEnterpriseAuth } from '@/api/user.js'

const enterpriseAuthDetail = ref(null)
const submitting = ref(false)
const formData = ref({
	company_name: '',
	contact: '',
	phone: '',
	credit_code: ''
})

const hasEnterpriseAuth = computed(() => {
	if (!enterpriseAuthDetail.value) {
		return false
	}

	return Object.keys(enterpriseAuthDetail.value).length > 0
})

const fetchEnterpriseAuthDetail = async () => {
	try {
		const res = await getEnterpriseAuthDetail()
		if (res.code !== 1) {
			enterpriseAuthDetail.value = null
			return
		}

		const detail = res.data
		if (!detail || (typeof detail === 'object' && Object.keys(detail).length === 0)) {
			enterpriseAuthDetail.value = null
			formData.value = {
				company_name: '',
				contact: '',
				phone: '',
				credit_code: ''
			}
			return
		}

		enterpriseAuthDetail.value = detail
		formData.value = {
			company_name: detail.enterprise_name || detail.company_name || '',
			contact: detail.contact || '',
			phone: detail.phone || '',
			credit_code: detail.credit_code || ''
		}
	} catch (error) {
		enterpriseAuthDetail.value = null
	}
}

const handleSubmit = async () => {
	if (submitting.value) {
		return
	}

	if (!formData.value.company_name.trim()) {
		uni.showToast({ title: '请输入企业名称', icon: 'none' })
		return
	}

	if (!formData.value.contact.trim()) {
		uni.showToast({ title: '请输入联系人姓名', icon: 'none' })
		return
	}

	if (!formData.value.phone.trim()) {
		uni.showToast({ title: '请输入联系电话', icon: 'none' })
		return
	}

	if (!formData.value.credit_code.trim()) {
		uni.showToast({ title: '请输入统一社会信用代码', icon: 'none' })
		return
	}

	submitting.value = true

	try {
		const requestData = {
			company_name: formData.value.company_name.trim(),
			contact: formData.value.contact.trim(),
			phone: formData.value.phone.trim(),
			credit_code: formData.value.credit_code.trim()
		}
		const res = hasEnterpriseAuth.value
			? await editEnterpriseAuth(requestData)
			: await submitEnterpriseAuth(requestData)

		if (res.code !== 1) {
			uni.showToast({ title: res.msg || (hasEnterpriseAuth.value ? '保存失败' : '提交失败'), icon: 'none' })
			return
		}

		uni.showToast({ title: hasEnterpriseAuth.value ? '保存成功' : '提交成功', icon: 'success' })
		await fetchEnterpriseAuthDetail()
	} catch (error) {
		uni.showToast({ title: hasEnterpriseAuth.value ? '保存失败' : '提交失败', icon: 'none' })
	} finally {
		submitting.value = false
	}
}

onShow(() => {
	fetchEnterpriseAuthDetail()
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
	margin: 0 30rpx;
	padding-bottom: 40rpx;
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

.input-value {
	height: 76rpx;
	line-height: 76rpx;
	font-size: 28rpx;
	color: #111;
	background: #f8fafc;
	border-radius: 16rpx;
	padding: 0 20rpx;
	border: 1rpx solid #d0d5dd;
}

.submit-btn {
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	font-size: 30rpx;
	color: #fff;
	background: linear-gradient(90deg, #166ae7, #12b4ca);
	border-radius: 44rpx;
	margin-top: 40rpx;
}
</style>
