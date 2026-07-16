// mixins/safeArea.js
export default {
  data() {
    return {
      // 安全区域数据
      safeAreaInsets: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      // 是否为刘海屏
      isNotch: false,
      // 状态栏高度
      statusBarHeight: 0,
      // 导航栏高度
      navBarHeight: 0,
      // 底部安全区域高度
      bottomSafeHeight: 0
    }
  },
  computed: {
    // 顶部安全区域高度（状态栏 + 导航栏）
    topSafeHeight() {
      return this.statusBarHeight + this.navBarHeight
    },
    // 是否需要顶部安全区域适配
    needTopSafe() {
      return this.isNotch || this.statusBarHeight > 20
    },
    // 是否需要底部安全区域适配
    needBottomSafe() {
      return this.safeAreaInsets.bottom > 0
    }
  },
  created() {
    this.initSafeArea()
  },
  methods: {
    // 初始化安全区域
    initSafeArea() {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync()
      
      // 状态栏高度
      this.statusBarHeight = systemInfo.statusBarHeight || 0
      
      // 判断是否为刘海屏（根据安全区域判断）
      // #ifdef APP-PLUS || H5
      this.isNotch = systemInfo.safeAreaInsets?.top > 0 || false
      // #endif
      
      // #ifdef MP-WEIXIN
      // 微信小程序可以通过 getMenuButtonBoundingClientRect 获取更多信息
      try {
        const menuButton = wx.getMenuButtonBoundingClientRect?.()
        if (menuButton) {
          // 如果有胶囊按钮，说明是有导航栏的
          this.navBarHeight = menuButton.bottom + 8
        }
      } catch (e) {
        console.log('获取菜单按钮信息失败', e)
      }
      // #endif
      
      // 获取安全区域
      // #ifdef APP-PLUS
      const safeArea = systemInfo.safeAreaInsets
      if (safeArea) {
        this.safeAreaInsets = {
          top: safeArea.top || 0,
          bottom: safeArea.bottom || 0,
          left: safeArea.left || 0,
          right: safeArea.right || 0
        }
        this.isNotch = safeArea.top > 0 || safeArea.bottom > 0
      }
      // #endif
      
      // #ifdef H5
      // H5 端通过 CSS env() 处理，但这里也获取数据
      const safeArea = systemInfo.safeArea
      if (safeArea) {
        this.safeAreaInsets = {
          top: safeArea.top || 0,
          bottom: systemInfo.screenHeight - safeArea.bottom || 0,
          left: safeArea.left || 0,
          right: systemInfo.screenWidth - safeArea.right || 0
        }
        this.isNotch = this.safeAreaInsets.top > 0 || this.safeAreaInsets.bottom > 0
      }
      // #endif
      
      // #ifdef MP-WEIXIN
      // 微信小程序获取安全区域
      if (systemInfo.safeArea) {
        const { safeArea } = systemInfo
        this.safeAreaInsets = {
          top: safeArea.top || 0,
          bottom: systemInfo.screenHeight - safeArea.bottom || 0,
          left: safeArea.left || 0,
          right: systemInfo.screenWidth - safeArea.right || 0
        }
        this.isNotch = this.safeAreaInsets.top > 0 || this.safeAreaInsets.bottom > 0
      }
      // #endif
      
      // 底部安全区域高度（通常是 34px 左右）
      this.bottomSafeHeight = this.safeAreaInsets.bottom || 34
      
      // 计算导航栏高度（如果没有获取到，使用默认值）
      if (!this.navBarHeight) {
        // #ifdef MP-WEIXIN
        this.navBarHeight = 44 // 微信小程序默认
        // #endif
        // #ifdef APP-PLUS
        this.navBarHeight = 44
        // #endif
        // #ifdef H5
        this.navBarHeight = 44
        // #endif
      }
    },
    
    // 获取顶部安全区域 padding
    getTopSafePadding(extra = 0) {
      return this.topSafeHeight + extra
    },
    
    // 获取底部安全区域 padding
    getBottomSafePadding(extra = 0) {
      return this.bottomSafeHeight + extra
    },
    
    // 获取样式对象（用于内联样式）
    getSafeAreaStyles() {
      return {
        paddingTop: this.needTopSafe ? `${this.topSafeHeight}px` : '0px',
        paddingBottom: this.needBottomSafe ? `${this.bottomSafeHeight}px` : '0px',
        paddingLeft: this.safeAreaInsets.left ? `${this.safeAreaInsets.left}px` : '0px',
        paddingRight: this.safeAreaInsets.right ? `${this.safeAreaInsets.right}px` : '0px'
      }
    },
    
    // 获取 CSS 变量（用于 style 标签）
    getSafeAreaCSSVars() {
      return {
        '--safe-top': this.needTopSafe ? `${this.topSafeHeight}px` : '0px',
        '--safe-bottom': this.needBottomSafe ? `${this.bottomSafeHeight}px` : '0px',
        '--safe-left': this.safeAreaInsets.left ? `${this.safeAreaInsets.left}px` : '0px',
        '--safe-right': this.safeAreaInsets.right ? `${this.safeAreaInsets.right}px` : '0px',
        '--status-bar-height': `${this.statusBarHeight}px`,
        '--nav-bar-height': `${this.navBarHeight}px`
      }
    }
  }
}