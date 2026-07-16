<template>
  <view class="page-wrap">
	  <AppHeader title="技能标签管理" content="技能标签管理" :back=1 ></AppHeader>
    <!-- 可选技能标签 -->
    <view class="all-card">
      <text class="label">选择标签</text>
      <view class="all-tag-row">
        <view 
          class="tag-item" 
          :class="{ active: isSelected(tag) }"
          v-for="(tag, idx) in allTagList" 
          :key="idx"
          @click="toggleSelect(tag)"
        >
          <text>{{ tag.name }}</text>
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <mybtn text="保存" type="primary" style="position: absolute; bottom: 30rpx;left: 30rpx;right: 30rpx;"></mybtn>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import mybtn from '@/components/button/btmBtn.vue'
import AppHeader from '@/components/header.vue'
// 全部可选标签数据
const allTagList = ref([
  { name: '摄像头安装' },
  { name: '录像机调试' },
  { name: '弱电施工' },
  { name: '设备巡检' },
  { name: '监控安装' },
  { name: '网络布线' },
  { name: '门禁调试' },
])

// 已选中标签
const selectedList = ref([
  { name: '监控安装' },
  { name: '网络布线' },
  { name: '门禁调试' },
])

// 判断是否选中
const isSelected = (tag) => {
  return selectedList.value.some(item => item.name === tag.name)
}

// 选中/取消切换
const toggleSelect = (tag) => {
  const index = selectedList.value.findIndex(item => item.name === tag.name)
  if (index > -1) {
    // 已存在则取消
    selectedList.value.splice(index, 1)
  } else {
    // 不存在则添加
    selectedList.value.push(tag)
  }
}

// 保存
const handleSave = () => {
  console.log('已选择标签：', selectedList.value)
  uni.showToast({ title: '保存成功', icon: 'success' })
}
</script>

<style scoped>

.page-wrap {
  width: 750rpx;
  box-sizing: border-box;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f0f7ff;
}

/* 全部可选标签区域 */
.all-card {
	margin: 0 30rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 36rpx 32rpx;
  margin-bottom: 120rpx;
}
.label {
  font-size: 32rpx;
  color: #888;
  display: block;
  margin-bottom: 30rpx;
}
.all-tag-row {
  display: flex;
  flex-wrap: wrap;
}
.tag-item {
  /* 一行5个均分宽度 */
  padding: 10rpx 20rpx;
  border-radius: 60rpx;
  font-size: 24rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #f5f7fa;
  color: #666;
}
/* 每行第5个清除右侧边距 */
.tag-item:nth-child(5n) {
  margin-right: 0;
}
/* 选中胶囊样式 */
.tag-item.active {
  background: #e8f3ff;
  color: #007aff;
  border: 1rpx solid #b8d6ff;
}

/* 底部保存按钮 */
.save-btn {
  width: 100%;
  height: 110rpx;
  background: #007aff;
  color: #fff;
  font-size: 44rpx;
  border-radius: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>