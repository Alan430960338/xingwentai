export default {
	data() {
		return {
			globalData: {
				gd_systemInfo: null,
				gd_statusBarHeight: 0,
				gd_safeAreaInsetsBottom: 0,
				gd_menuButtonWidth: 0,
				gd_menuButtonHeight: 0,
				gd_menuButtonTop: 0,
				gd_screenHeight: 0,
				gd_windowHeight: 0,
			},
		}
	},
	
	// 添加计算属性
	computed: {
		// 暴露为页面直接可访问的属性
		gd_statusBarHeight() {
			return this.globalData.gd_statusBarHeight;
		},
		gd_safeAreaInsetsBottom() {
			return this.globalData.gd_safeAreaInsetsBottom;
		},
		gd_screenHeight() {
			return this.globalData.gd_screenHeight;
		},
		gd_windowHeight() {
			return this.globalData.gd_windowHeight;
		},
		gd_menuButtonTop() {
			return this.globalData.gd_menuButtonTop;
		},
		gd_menuButtonHeight() {
			return this.globalData.gd_menuButtonHeight;
		},
		gd_menuButtonWidth() {
			return this.globalData.gd_menuButtonWidth;
		},
		// 当前选中的门店信息（从 getApp 获取）
		gd_currentStoreId() {
			const app = getApp();
			return app.globalData ? app.globalData.currentStoreId : null;
		},
		gd_currentStoreName() {
			const app = getApp();
			return app.globalData ? app.globalData.currentStoreName : '';
		}
	},
	
	created() {
		const _this = this;
		
		uni.getSystemInfo({
			success: function (res) {
				_this.globalData.gd_systemInfo = res;
				_this.globalData.gd_statusBarHeight = res.statusBarHeight;
				_this.globalData.gd_screenHeight = res.windowHeight;
				_this.globalData.gd_safeAreaInsetsBottom = res.safeAreaInsets.bottom;
				_this.globalData.gd_windowHeight = res.windowHeight;
			},
			fail: function(error) {
				console.error('获取系统信息失败:', error);
			}
		});
	}
}
