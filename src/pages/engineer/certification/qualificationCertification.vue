<template>
  <view class="page-wrap">
    <view class="success-card">
      <view class="icon-box">
        <uni-icons type="checkmarkempty" size="60" color="#0fb361" />
      </view>
      <text class="title">认证已通过</text>
      <text class="desc">你可以在接单大厅查看并接取空调维修工单。</text>
    </view>
  </view>
</template>

<script setup>
// 页面加载后可自动跳转逻辑示例
const goOrderHall = () => {
  uni.navigateTo({
    url: '/pages/engineer/orderHall/orderHall'
  })
}
</script>

<style scoped>
.page-wrap {
  width: 750rpx;
  padding: 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding-top: 80rpx;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f0f7ff;
}

.success-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon-box {
  width: 140rpx;
  height: 140rpx;
  background-color: #e6f9ef;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}
.title {
  font-size: 48rpx;
  color: #111;
  font-weight: 600;
  margin-bottom: 24rpx;
}
.desc {
  font-size: 32rpx;
  color: #667085;
  text-align: center;
  line-height: 50rpx;
}
</style>