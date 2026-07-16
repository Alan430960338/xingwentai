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
				<input class="search-placeholder" placeholder="搜索故障内容、机房地址、师傅" v-model="searchKeyword"
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
			      <view class="engineer-card" v-for="(item, idx) in engineerData" :key="idx">
			        <text class="name">{{ item.name }}</text>
			        <view class="info-row">
			          <text class="info-text">工种: {{ item.workType }} / 接单数 {{ item.orderNum }} 单</text>
			          <view class="status-tag" :class="item.tagClass">
			            <text class="tag-text">{{ item.status }}</text>
			          </view>
			        </view>
			      </view>
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
	const currentTab = ref('all')
	// 切换标签
	const switchTab = (key) => {
		currentTab.value = key
	}
	const statData = ref([{
			money: '6人',
			label: '在线工程师'
		},
		{
			money: '2人',
			label: '待派工'
		},
		{
			money: '3.6',
			label: '平均评分'
		},
	])

	// 标签列表
	const tabList = [{
			label: '全部',
			key: 'all'
		},
		{
			label: '在岗',
			key: '待接单'
		},
		{
			label: '空闲',
			key: '进行中'
		},
		{
			label: '离岗',
			key: '已超时'
		}
	]
	
	const engineerData = ref([
	  {
	    name: '李建国',
	    workType: '空调维修',
	    orderNum: 86,
	    status: '服务中',
	    tagClass: 'tag-service'
	  },
	  {
	    name: '陈海峰',
	    workType: '机房巡检',
	    orderNum: 52,
	    status: '可派工',
	    tagClass: 'tag-free'
	  }
	])
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