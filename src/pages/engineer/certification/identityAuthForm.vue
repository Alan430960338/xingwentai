<template>
	<view class="page-wrap">
		<AppHeader title="身份认证" content="身份认证" :back="true"></AppHeader>

		<view class="form-list">
			<view class="form-item">
				<text class="label">真实姓名</text>
				<input class="input-value" v-model="formData.name" placeholder="请输入真实姓名" />
			</view>

			<view class="form-item">
				<text class="label">身份证号</text>
				<input class="input-value" v-model="formData.card" placeholder="请输入身份证号" />
			</view>
		</view>

		<view class="bottom-btn" @click="submitForm">提交</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import { getIdentityAuthDetail, submitIdentityAuth } from '@/api/engineer.js'

const submitting = ref(false)
const formData = ref({
	name: '',
	card: ''
})

const fetchIdentityAuthDetail = async () => {
	try {
		const res = await getIdentityAuthDetail()
		if (res.code !== 1) {
			return
		}

		const detail = res.data
		if (!detail || (typeof detail === 'object' && Object.keys(detail).length === 0)) {
			return
		}

		formData.value.name = detail.name || ''
		formData.value.card = detail.card || ''
	} catch (error) {
		// 详情获取失败时保持空表单可编辑
	}
}

const submitForm = async () => {
	if (submitting.value) {
		return
	}

	if (!formData.value.name.trim()) {
		uni.showToast({ title: '请输入真实姓名', icon: 'none' })
		return
	}

	if (!formData.value.card.trim()) {
		uni.showToast({ title: '请输入身份证号', icon: 'none' })
		return
	}

	submitting.value = true

	try {
		const res = await submitIdentityAuth({
			name: formData.value.name.trim(),
			card: formData.value.card.trim()
		})

		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '提交失败', icon: 'none' })
			return
		}

		uni.showToast({ title: '提交成功', icon: 'success' })
		setTimeout(() => {
			uni.navigateBack()
		}, 1200)
	} catch (error) {
		uni.showToast({ title: '提交失败', icon: 'none' })
	} finally {
		submitting.value = false
	}
}

onShow(() => {
	fetchIdentityAuthDetail()
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

.form-list {
	margin: 30rpx;
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

.bottom-btn {
	position: fixed;
	left: 30rpx;
	right: 30rpx;
	bottom: 30rpx;
	background: linear-gradient(to right, #1d73ea, #145dd7);
	color: #fff;
	padding: 20rpx;
	text-align: center;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	font-size: 30rpx;
}
</style>
