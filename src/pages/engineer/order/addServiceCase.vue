<template>
	<view class="page-wrap">
		<AppHeader :title="pageTitle" :content="pageTitle" :back="true"></AppHeader>

		<view class="form-list">
			<view class="form-item">
				<text class="label">案例名称</text>
				<input class="input-value" v-model="formData.title" placeholder="请输入案例名称" />
			</view>

			<view class="form-item">
				<text class="label">案例内容</text>
				<textarea class="textarea-value" v-model="formData.content" placeholder="请输入案例内容" maxlength="500"></textarea>
			</view>

			<picker mode="date" :value="formData.projectDate" @change="handleDateChange">
				<view class="form-item selectable-item">
					<text class="label">项目日期</text>
					<view class="value-row">
						<text class="value" :class="{ 'placeholder-text': !formData.projectDate }">{{ formData.projectDate || '请选择项目日期' }}</text>
						<uni-icons type="right" size="18" color="#98a2b3" />
					</view>
				</view>
			</picker>

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

		<myBtn :text="submitText" type="primary" style="position: fixed;bottom: 30rpx;left: 30rpx;right: 30rpx;" @click="submitCase"></myBtn>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import myBtn from '@/components/button/btmBtn.vue'
import { uploadCommonFile } from '@/api/common.js'
import { addServiceCase, editServiceCase, getServiceCaseDetail } from '@/api/engineer.js'

const submitting = ref(false)
const detailLoading = ref(false)
const caseId = ref('')
const imageList = ref([])
const formData = ref({
	title: '',
	content: '',
	projectDate: ''
})

const isEdit = computed(() => Boolean(caseId.value))
const pageTitle = computed(() => (isEdit.value ? '编辑服务案例' : '新增服务案例'))
const submitText = computed(() => (isEdit.value ? '保存' : '提交'))

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

const handleDateChange = event => {
	formData.value.projectDate = event.detail.value
}

const toTimestamp = dateString => {
	if (!dateString) {
		return 0
	}

	const timestamp = new Date(`${dateString} 00:00:00`).getTime()
	return Number.isNaN(timestamp) ? 0 : Math.floor(timestamp / 1000)
}

const formatDate = timestamp => {
	if (!timestamp) {
		return ''
	}

	const normalizedTimestamp = String(timestamp).length === 13 ? Number(timestamp) : Number(timestamp) * 1000
	const date = new Date(normalizedTimestamp)
	if (Number.isNaN(date.getTime())) {
		return ''
	}

	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

const normalizeImages = images => {
	if (Array.isArray(images)) {
		return images.filter(Boolean)
	}

	if (typeof images === 'string') {
		return images.split(',').map(item => item.trim()).filter(Boolean)
	}

	return []
}

const loadCaseDetail = async id => {
	detailLoading.value = true

	try {
		const res = await getServiceCaseDetail({ id })
		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '案例详情获取失败', icon: 'none' })
			return
		}

		const detail = res.data || {}
		formData.value = {
			title: detail.title || '',
			content: detail.content || '',
			projectDate: formatDate(detail.project_time)
		}
		imageList.value = normalizeImages(detail.images).map(url => ({
			preview: url,
			url
		}))
	} catch (error) {
		uni.showToast({ title: '案例详情获取失败', icon: 'none' })
	} finally {
		detailLoading.value = false
	}
}

const submitCase = async () => {
	if (submitting.value || detailLoading.value) {
		return
	}

	if (!formData.value.title.trim()) {
		uni.showToast({ title: '请输入案例名称', icon: 'none' })
		return
	}

	if (!formData.value.content.trim()) {
		uni.showToast({ title: '请输入案例内容', icon: 'none' })
		return
	}

	if (!formData.value.projectDate) {
		uni.showToast({ title: '请选择项目日期', icon: 'none' })
		return
	}

	submitting.value = true

	try {
		const payload = {
			title: formData.value.title.trim(),
			content: formData.value.content.trim(),
			project_time: toTimestamp(formData.value.projectDate),
			images: imageList.value.map(item => item.url).filter(Boolean).join(',')
		}

		if (isEdit.value) {
			payload.id = Number(caseId.value)
		}

		const res = isEdit.value ? await editServiceCase(payload) : await addServiceCase(payload)

		if (res.code !== 1) {
			uni.showToast({ title: res.msg || (isEdit.value ? '保存失败' : '提交失败'), icon: 'none' })
			return
		}

		uni.showToast({ title: isEdit.value ? '保存成功' : '提交成功', icon: 'success' })
		setTimeout(() => {
			uni.navigateBack()
		}, 1200)
	} catch (error) {
		uni.showToast({ title: isEdit.value ? '保存失败' : '提交失败', icon: 'none' })
	} finally {
		submitting.value = false
	}
}

onLoad(options => {
	const id = options?.id || ''
	if (!id) {
		return
	}

	caseId.value = id
	loadCaseDetail(id)
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
