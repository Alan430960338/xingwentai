<template>
	<view class="page-wrap">
		<AppHeader title="查看评价" content="查看评价" :back="true"></AppHeader>

		<view class="card">
			<text class="label">评分</text>
			<view class="rating-row">
				<text
					v-for="star in 5"
					:key="star"
					class="star-item"
					:class="{ active: star <= detail.rating }"
				>
					★
				</text>
			</view>
		</view>

		<view class="card">
			<text class="label">评价内容</text>
			<text class="content-text">{{ detail.content || '--' }}</text>
		</view>

		<view class="card">
			<text class="label">评价图片</text>
			<view v-if="imageList.length > 0" class="image-row">
				<image v-for="(item, index) in imageList" :key="index" class="image-item" :src="item" mode="aspectFill" />
			</view>
			<text v-else class="empty-text">暂无图片</text>
		</view>

		<view class="card" v-if="detail.reply_content">
			<text class="label">回复内容</text>
			<text class="content-text">{{ detail.reply_content }}</text>
			<text class="reply-time" v-if="detail.reply_time_text || detail.reply_time">{{ detail.reply_time_text || formatTime(detail.reply_time) }}</text>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppHeader from '@/components/header.vue'
import { getEvaluateDetail } from '@/api/engineer.js'

const detail = ref({
	rating: 0,
	content: '',
	images: '',
	reply_content: '',
	reply_time: '',
	reply_time_text: ''
})

const imageList = computed(() => {
	if (!detail.value.images) {
		return []
	}

	if (Array.isArray(detail.value.images)) {
		return detail.value.images.filter(Boolean)
	}

	return String(detail.value.images)
		.split(',')
		.map(item => item.trim())
		.filter(Boolean)
})

const formatTime = timestamp => {
	if (!timestamp) {
		return '--'
	}

	const normalizedTimestamp = String(timestamp).length === 13 ? Number(timestamp) : Number(timestamp) * 1000
	const date = new Date(normalizedTimestamp)
	if (Number.isNaN(date.getTime())) {
		return '--'
	}

	const padZero = value => String(value).padStart(2, '0')
	return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
}

const fetchEvaluateDetail = async id => {
	try {
		const res = await getEvaluateDetail({ id })
		if (res.code !== 1) {
			uni.showToast({ title: res.msg || '评价获取失败', icon: 'none' })
			return
		}

		detail.value = {
			...res.data,
			rating: Number(res.data?.rating || 0)
		}
	} catch (error) {
		uni.showToast({ title: '评价获取失败', icon: 'none' })
	}
}

onLoad(options => {
	if (!options?.id) {
		uni.showToast({ title: '缺少订单ID', icon: 'none' })
		return
	}

	fetchEvaluateDetail(options.id)
})
</script>

<style scoped>
.page-wrap {
	margin: 0 auto;
	min-height: 100vh;
	background-color: #f0f7ff;
	width: 750rpx;
	padding-bottom: 30rpx;
}

.card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin: 24rpx 30rpx 0;
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

.content-text {
	font-size: 28rpx;
	color: #111;
	line-height: 42rpx;
}

.image-row {
	display: flex;
	flex-wrap: wrap;
}

.image-item {
	width: 160rpx;
	height: 160rpx;
	border-radius: 16rpx;
	margin-right: 24rpx;
	margin-bottom: 24rpx;
	background: #d8e3f2;
}

.empty-text,
.reply-time {
	font-size: 26rpx;
	color: #98a2b3;
}

.reply-time {
	display: block;
	margin-top: 12rpx;
}
</style>
