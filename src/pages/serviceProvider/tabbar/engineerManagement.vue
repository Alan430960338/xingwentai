<template>
	<view class="page-wrap">
		<AppHeader title="工程师管理" content="工程师管理"></AppHeader>
		<view class="filter-wrap">

			<!-- 顶部金额统计卡片 -->
			<view class="stat-row">
				<view class="stat-item" v-for="(item, idx) in statData" :key="idx">
					<text class="stat-money">{{ item.money }}</text>
					<text class="stat-label">{{ item.label }}</text>
				</view>
			</view>

			<!-- 搜索框 -->
			<view class="search-input">
				<uni-icons type="search" size="20" color="#999" />
				<input class="search-placeholder" placeholder="搜索昵称或手机号" v-model="searchKeyword"
					@input="handleSearch" />
			</view>

			<!-- 状态标签栏 -->
			<view class="tab-group">
				<view class="tab-item" v-for="(tab, index) in tabList" :key="index"
					:class="{ active: currentTab === tab.key }" @click="switchTab(tab.key)">
					{{ tab.label }}
				</view>
			</view>
			
			
			<view class="engineer-list">
				<view v-if="engineerData.length === 0 && !loading" class="empty-state">暂无工程师</view>
			      <view class="engineer-card" v-for="(item, idx) in engineerData" :key="item.id || idx">
			        <text class="name">{{ item.nickname || '--' }}</text>
			        <view class="info-row">
			          <text class="info-text">工种: {{ item.technician?.job_name || '未填写' }} / 接单数 {{ item.order_count || 0 }} 单</text>
			          <view class="status-tag" :class="item.is_post === 1 ? 'tag-service' : 'tag-free'">
			            <text class="tag-text">{{ item.is_post === 1 ? '已发布' : '未发布' }}</text>
			          </view>
			        </view>
			      </view>
				<view v-if="loading" class="list-footer">加载中...</view>
				<view v-else-if="engineerData.length > 0" class="list-footer">{{ hasMore ? '上拉加载更多' : '没有更多了' }}</view>
			    </view>
			
			<bar tabname="engineer"></bar>
		</view>
	</view>





</template>

<script setup>
	import bar from '@/components/tabBer/service.vue'
	import AppHeader from '@/components/header.vue'
	import {
		ref,
		computed
	} from 'vue'
	import { onReachBottom, onShow } from '@dcloudio/uni-app'
	import { getEngineerList } from '@/api/engineer.js'

	const searchKeyword = ref('')
	const currentTab = ref('all')
	const page = ref(1)
	const limit = 10
	const hasMore = ref(true)
	const loading = ref(false)
	const engineerData = ref([])

	// 切换标签
	const switchTab = (key) => {
		currentTab.value = key
		fetchEngineerList(true)
	}
	const statData = ref([{
			money: '0',
			label: '当前列表'
		},
		{
			money: '0',
			label: '已发布'
		},
		{
			money: '0',
			label: '已接单'
		},
	])

	// 标签列表
	const tabList = [{
			label: '全部',
			key: 'all'
		},
		{
			label: '已发布',
			key: 'published'
		},
		{
			label: '已接单',
			key: 'working'
		},
		{
			label: '未接单',
			key: 'idle'
		}
	]

	const refreshStats = list => {
		statData.value = [{
			money: String(list.length),
			label: '当前列表'
		},
		{
			money: String(list.filter(item => Number(item.is_post) === 1).length),
			label: '已发布'
		},
		{
			money: String(list.filter(item => Number(item.order_count) > 0).length),
			label: '已接单'
		}]
	}

	const fetchEngineerList = async (reset = false) => {
		if (loading.value) {
			return
		}

		if (reset) {
			page.value = 1
			hasMore.value = true
		}

		if (!hasMore.value) {
			return
		}

		loading.value = true

		try {
			const requestData = {
				page: page.value,
				limit,
				keyword: searchKeyword.value.trim()
			}

			if (currentTab.value === 'published') {
				requestData.is_post = 1
			}

			if (currentTab.value === 'working') {
				requestData.order_count = 1
			}

			if (currentTab.value === 'idle') {
				requestData.order_count = 0
			}

			const res = await getEngineerList(requestData)
			if (res.code !== 1) {
				uni.showToast({ title: res.msg || '工程师获取失败', icon: 'none' })
				return
			}

			const listData = Array.isArray(res.data?.data) ? res.data.data : []
			engineerData.value = reset ? listData : [...engineerData.value, ...listData]
			refreshStats(engineerData.value)
			hasMore.value = page.value < Number(res.data?.last_page || 0)

			if (hasMore.value) {
				page.value += 1
			}
		} catch (error) {
			uni.showToast({ title: '工程师获取失败', icon: 'none' })
		} finally {
			loading.value = false
		}
	}

	const handleSearch = () => {
		fetchEngineerList(true)
	}

	onShow(() => {
		fetchEngineerList(true)
	})

	onReachBottom(() => {
		fetchEngineerList()
	})
</script>

<style scoped>
	/* 顶部统计三栏 */
	.stat-row {

		margin: 0 30rpx 30rpx;
		display: flex;
	}

	.stat-item {
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		width: 31%;
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx 0;
		text-align: center;
		margin-right: 3.5%;
	}

	.stat-item:last-child {
		margin-right: 0;
	}

	.stat-money {
		font-size: 38rpx;
		color: #0052cc;
		font-weight: 600;
		display: block;
	}

	.stat-label {
		font-size: 26rpx;
		color: #667085;
		display: block;
		margin-top: 12rpx;
	}

	.filter-wrap {
		width: 100%;
	}

	/* 搜索框 */
	.search-input {
		background: #ffffff;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		margin: 0 30rpx 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 20rpx;
	}

	.search-placeholder {
		font-size: 28rpx;
		color: #888;
		margin-left: 24rpx;
		flex: 1;
	}

	/* 标签栏 */
	.tab-group {
		display: flex;
		margin: 20rpx 30rpx;
		overflow-x: auto;
		padding-bottom: 10rpx;

	}

	.tab-group::-webkit-scrollbar {
		display: none;
	}

	.tab-item {
		padding: 12rpx 28rpx;
		border-radius: 60rpx;
		font-size: 28rpx;
		color: #555;
		background: #fff;
		margin-right: 20rpx;
		white-space: nowrap;
		flex-shrink: 0;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
	}

	.tab-item.active {
		background-color: #edf4fa;
		border: 2rpx solid #007aff;
		color: #007aff;
	}
	
	.engineer-list {
		margin: 0 30rpx;
	}
	.empty-state,
	.list-footer {
		text-align: center;
		font-size: 26rpx;
		color: #98a2b3;
		padding: 30rpx 0;
	}
	.engineer-card {
	  background: #fff;
	  border-radius: 24rpx;
	  padding: 40rpx 32rpx;
	  margin-bottom: 24rpx;
	  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	}
	.name {
	  font-size: 30rpx;
	  color: #888;
	  display: block;
	  margin-bottom: 20rpx;
	}
	.info-row {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	}
	.info-text {
	  font-size: 32rpx;
	  color: #111;
	}
	.status-tag {
	  padding: 8rpx 20rpx;
	  border-radius: 60rpx;
	  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	}
	.tag-text {
	  font-size: 30rpx;
	  color: #fff;
	}
	/* 服务中 蓝色标签 */
	.tag-service {
	  background: #007aff;
	}
	/* 可派工 绿色标签 */
	.tag-free {
	  background: #11a968;
	}
</style>
