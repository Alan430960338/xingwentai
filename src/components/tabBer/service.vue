<!-- 底部自定义导航 -->
<template>
  <view class="tabbar-root">
    <view class="tab-spacer" :style="{ height: `${tabSpacerHeightPx}px` }" />
    <view class="tab">
      <view class="tab-inner">
		  
        <view class="navView" @tap="switc('/pages/serviceProvider/tabbar/workbench', 1)">
          <image :src="tabname == 'workbench' ? '/static/tab/home-1.png' : '/static/tab/home.png'" class="navView-img" />
          <view :class="tabname == 'workbench' ? 'tabTextActive' : 'tabText'">
            工作台
          </view>
        </view>

		<view class="navView" @tap="switc('/pages/serviceProvider/tabbar/order', 2)">
		  <image :src="tabname == 'order' ? '/static/tab/home-1.png' : '/static/tab/home.png'" class="navView-img" />
		  <view :class="tabname == 'order' ? 'tabTextActive' : 'tabText'">
		    订单
		  </view>
		</view>
		
		<view class="navView" @tap="switc('/pages/serviceProvider/tabbar/engineerManagement', 3)">
		  <image :src="tabname == 'engineer' ? '/static/tab/home-1.png' : '/static/tab/home.png'" class="navView-img" />
		  <view :class="tabname == 'engineer' ? 'tabTextActive' : 'tabText'">
		    工程师
		  </view>
		</view>
		
		<view class="navView" @tap="switc('/pages/serviceProvider/tabbar/mine', 4)">
		  <image :src="tabname == 'mine' ? '/static/tab/home-1.png' : '/static/tab/home.png'" class="navView-img" />
		  <view :class="tabname == 'mine' ? 'tabTextActive' : 'tabText'">
		    我的
		  </view>
		</view>
		
      </view>
      <view v-if="safeAreaBottomPx > 0" class="tab-safe" :style="{ height: `${safeAreaBottomPx}px` }" />
    </view>
  </view>
</template>

<script>
import globalDataMixin from '@/mixins/globalData.js'

export default {
  name: 'ETaBar',
  mixins: [globalDataMixin],
  props: {
    // 当前页
    tabname: {
      type: String,
    },
  },
  computed: {
    safeAreaBottomPx() {
      const value = Number(this.gd_safeAreaInsetsBottom)
      return Number.isFinite(value) ? value : 0
    },
    tabSpacerHeightPx() {
      const basePx = uni.upx2px(130)
      return basePx + this.safeAreaBottomPx
    },
  },

  methods: {
    switc(val, index) {
      uni.redirectTo({
        url: val,
      })
      // let token = uni.getStorageSync('token')
      // if (index === 2) {
      //   if (!token) {
      //     uni.navigateTo({
      //       url: '/pages/login/index',
      //     })
      //     return
      //   }
      //   else {
      //     uni.redirectTo({
      //       url: val,
      //     })
      //   }
      // }
      // else {
      //   // 使用 redirectTo 关闭当前页面，避免页面栈堆积
      //   uni.redirectTo({
      //     url: val,
      //   })
      // }
    },
  },
}
</script>

<style scoped lang="scss">
    .tabbar-root {
  width: 100%;
}

.tab-spacer {
  width: 100%;
}

.tab {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
}

.tab-inner {
  display: flex;
  align-items: center;
  width: 100%;
  height: 130rpx;
  box-sizing: border-box;
}

.tab-safe {
  width: 100%;
  background-color: #fff;
}

.navView {
  flex: 1;
  text-align: center;
  font-size: 0;
}

.navView-img {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 6rpx;
}

.navView-img2 {
  width: 80rpx;
  height: 80rpx;
}

.tabText {
  font-size: 28rpx;
  color: #9ca3af;
}

.tabTextActive {
  font-weight: 700;
  text-align: center;
  color: #1768e8;
  font-size: 28rpx;
  font-family: PingFangSC-bold;
}

.code_img {
  width: 130rpx;
  height: 130rpx;
  background-color: #1768e8;
  box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(139, 229, 62, 0.3);
  border: 6rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60rpx;
}
</style>
