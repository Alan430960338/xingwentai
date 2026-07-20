<template>
	<view class="page-wrap">
		<AppHeader title="发起结算" content="发起结算" :back="true" :imageType="2"></AppHeader>

		<view class="tip-box">
			<text class="tip-text">请上传完工图片，并填写本次服务完成情况。</text>
		</view>

		<view class="form-list">
		<!-- 	<view class="form-item">
				<text class="label">订单ID</text>
				<text class="value">{{ formData.id || '--' }}</text>
			</view> -->

			<view class="form-item">
				<text class="label">完工说明</text>
				<textarea class="textarea-value" v-model="formData.completion" placeholder="请输入完工说明" maxlength="500" />
			</view>

			<view class="form-item">
				<text class="label">工时（小时）</text>
				<input class="input-value" v-model="formData.hours" type="digit" placeholder="请输入工时" />
			</view>

			<view class="upload-wrap">
				<text class="label">完工图片</text>
				<text class="upload-count">已上传 {{ imageList.length }} 张</text>
				<view class="upload-row">
					<image v-for="(item, index) in imageList" :key="index" class="upload-image" :src="item.preview" mode="aspectFill" />
					<view v-if="imageList.length < 9" class="upload-add" @click="chooseImages">
						<text class="add-icon">+</text>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom-btn" @click="submitSettlement">提交</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import { uploadCommonFile } from '@/api/common.js'
import { submitServiceSettlement } from '@/api/engineer.js'

const submitting = ref(false)
const formData = ref({
	id: '',
	completion: '',
	hours: ''
})
const imageList = ref([])

const chooseImages = () => {
	uni.chooseImage({
		count: 9 - imageList.value.length,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: async res => {
			const files = res.tempFilePaths || []
			for (const filePath of files) {
				try {
					const uploadRes = await uploadCommonFile(filePath)
					const fullurl = uploadRes.data?.fullurl || ''
					if (!fullurl) {
						continue
					}

					imageList.value = [...imageList.value, {
						filePath,
						preview: fullurl,
						url: fullurl
					}]
				} catch (error) {
					uni.showToast({ title: '图片上传失败', icon: 'none' })
				}
			}
		}
	})
}

const submitSettlement = async () => {
	if (submitting.value) {
		return
	}

	if (!formData.value.id) {
		uni.showToast({ title: '缺少订单ID', icon: 'none' })
		return
	}

	if (!formData.value.completion.trim()) {
		uni.showToast({ title: '请输入完工说明', icon: 'none' })
		return
	}

	if (!formData.value.hours.trim()) {
		uni.showToast({ title: '请输入工时', icon: 'none' })
		return
	}

	if (imageList.value.length === 0) {
		uni.showToast({ title: '请上传完工图片', icon: 'none' })
		return
	}

	const wgImages = imageList.value.map(item => item.url).filter(Boolean).join(',')
	if (!wgImages) {
		uni.showToast({ title: '图片上传失败', icon: 'none' })
		return
	}

	submitting.value = true

	try {
		const res = await submitServiceSettlement({
			id: Number(formData.value.id),
			completion: formData.value.completion.trim(),
			hours: Number(formData.value.hours),
			wg_images: wgImages
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

onLoad(options => {
	formData.value.id = options?.id || ''
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
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
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
	line-height: 42rpx;
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

.textarea-value {
	width: 100%;
	min-height: 180rpx;
	font-size: 28rpx;
	color: #111;
	background: #f8fafc;
	border-radius: 16rpx;
	padding: 20rpx;
	border: 1rpx solid #d0d5dd;
	box-sizing: border-box;
	line-height: 40rpx;
}

.upload-wrap {
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	background: #ffffff;
	border-radius: 20rpx;
	padding: 36rpx 32rpx;
	margin-bottom: 24rpx;
}

.upload-count {
	font-size: 28rpx;
	color: #111;
	font-weight: 500;
}

.upload-row {
	display: flex;
	flex-wrap: wrap;
	margin-top: 30rpx;
	gap: 24rpx;
}

.upload-image,
.upload-add {
	width: 160rpx;
	height: 160rpx;
	border-radius: 16rpx;
}

.upload-image {
	background: #d8e3f2;
}

.upload-add {
	border: 2rpx dashed #94c0ff;
	display: flex;
	align-items: center;
	justify-content: center;
}

.add-icon {
	font-size: 60rpx;
	color: #007aff;
}
</style>
