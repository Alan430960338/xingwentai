<template>
	<view class="page-wrap">
		<AppHeader title="评价订单" content="评价订单" :back="true"></AppHeader>

		<view class="form-list">
			<view class="form-item">
				<text class="label">评分</text>
				<view class="rating-row">
					<text
						v-for="star in 5"
						:key="star"
						class="star-item"
						:class="{ active: star <= formData.rating }"
						@click="setRating(star)"
					>
						★
					</text>
				</view>
			</view>

			<view class="form-item">
				<text class="label">评价内容</text>
				<textarea class="textarea-value" v-model="formData.content" placeholder="请输入评价内容" maxlength="500" />
			</view>

			<view class="upload-wrap">
				<text class="label">上传图片</text>
				<text class="upload-count">已上传 {{ imageList.length }} 张</text>
				<view class="upload-row">
					<image v-for="(item, index) in imageList" :key="index" class="upload-image" :src="item.preview" mode="aspectFill" />
					<view v-if="imageList.length < 9" class="upload-add" @click="chooseImages">
						<text class="add-icon">+</text>
					</view>
				</view>
			</view>
		</view>

		<mybtn text="提交评价" type="primary" style="position: fixed; left: 30rpx; right: 30rpx; bottom: 30rpx;" @click="submitEvaluate" />
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import mybtn from '@/components/button/btmBtn.vue'
import { uploadCommonFile } from '@/api/common.js'
import { evaluate } from '@/api/user.js'

const demandId = ref('')
const submitting = ref(false)
const imageList = ref([])
const formData = ref({
	rating: 5,
	content: ''
})

const setRating = (star) => {
	formData.value.rating = star
}

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

const submitEvaluate = async () => {
	if (submitting.value) {
		return
	}

	if (!demandId.value) {
		uni.showToast({ title: '缺少订单ID', icon: 'none' })
		return
	}

	if (!formData.value.rating) {
		uni.showToast({ title: '请选择评分', icon: 'none' })
		return
	}

	if (!formData.value.content.trim()) {
		uni.showToast({ title: '请输入评价内容', icon: 'none' })
		return
	}

	submitting.value = true

	try {
		const res = await evaluate({
			demand_id: Number(demandId.value),
			rating: formData.value.rating,
			content: formData.value.content.trim(),
			images: imageList.value.map(item => item.url).filter(Boolean)
		})

		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '提交失败', icon: 'none' })
			return
		}

		uni.showToast({ title: '评价成功', icon: 'success' })
		setTimeout(() => {
			uni.navigateBack()
		}, 1200)
	} catch (error) {
		uni.showToast({ title: '提交失败', icon: 'none' })
	} finally {
		submitting.value = false
	}
}

onLoad((options) => {
	demandId.value = options?.id || ''
})
</script>

<style scoped>
.page-wrap {
	margin: 0 auto;
	min-height: 100vh;
	background-color: #f0f7ff;
	width: 750rpx;
	padding-bottom: 140rpx;
}

.form-list {
	margin: 30rpx;
}

.form-item,
.upload-wrap {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
}

.label {
	font-size: 28rpx;
	color: #888;
	display: block;
	margin-bottom: 16rpx;
}

.rating-row {
	display: flex;
	align-items: center;
}

.star-item {
	font-size: 48rpx;
	color: #d0d5dd;
	margin-right: 20rpx;
	line-height: 1;
}

.star-item.active {
	color: #ffb020;
}

.textarea-value {
	width: 100%;
	min-height: 220rpx;
	font-size: 28rpx;
	color: #111;
	background: #f8fafc;
	border-radius: 16rpx;
	padding: 20rpx;
	border: 1rpx solid #d0d5dd;
	line-height: 40rpx;
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
}

.upload-image,
.upload-add {
	width: 160rpx;
	height: 160rpx;
	border-radius: 16rpx;
	margin-right: 24rpx;
	margin-bottom: 24rpx;
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
