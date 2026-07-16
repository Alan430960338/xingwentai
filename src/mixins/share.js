const DEFAULT_SHARE_TITLE = "西施陪诊";
const DEFAULT_SHARE_PATH = "/pages/tabBar/home/home";

/**
 * 序列化分享参数。
 * @param {Object} query 分享参数对象
 * @returns {string}
 */
function stringifyQuery(query) {
  const queryData = query || {};
  return Object.keys(queryData)
    .filter((key) => queryData[key] !== undefined && queryData[key] !== null)
    .map((key) => `${key}=${String(queryData[key])}`)
    .join("&");
}

/**
 * 标准化页面路径。
 * @param {string} route 当前页面路由
 * @returns {string}
 */
function normalizeRoute(route) {
  if (!route) {
    return DEFAULT_SHARE_PATH;
  }
  return route.startsWith("/") ? route : `/${route}`;
}

/**
 * 构造分享路径。
 * @param {string} route 页面路由
 * @param {Object} query 分享参数对象
 * @returns {string}
 */
function buildSharePath(route, query) {
  const normalizedRoute = normalizeRoute(route);
  const queryString = stringifyQuery(query);
  return queryString ? `${normalizedRoute}?${queryString}` : normalizedRoute;
}

/**
 * 获取当前页面实例。
 * @returns {Object}
 */
function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1] || {};
}

/**
 * 生成当前页面分享数据。
 * @param {Object} vm 页面实例
 * @returns {Object}
 */
function createSharePayload(vm) {
  const currentPage = getCurrentPage();
  const shareState = vm.shareState || {};
  const query =
    shareState.query || vm.__shareQuery || currentPage.options || {};
  const route = shareState.path || currentPage.route || DEFAULT_SHARE_PATH;
  const payload = {
    title: shareState.title || DEFAULT_SHARE_TITLE,
    path: buildSharePath(route, query),
    query: stringifyQuery(query),
  };

  if (shareState.imageUrl) {
    payload.imageUrl = shareState.imageUrl;
  }

  return payload;
}

/**
 * 显示微信小程序分享菜单。
 * @returns {void}
 */
function showWechatShareMenu() {
  // #ifdef MP-WEIXIN
  wx.showShareMenu({
    menus: ["shareAppMessage", "shareTimeline"],
  });
  // #endif
}

export default {
  data() {
    return {
      __shareQuery: {},
      shareState: {
        title: DEFAULT_SHARE_TITLE,
        imageUrl: "",
        path: "",
        query: null,
      },
    };
  },

  onLoad(options) {
    this.__shareQuery = options || {};
    showWechatShareMenu();
  },

  onShow() {
    showWechatShareMenu();
  },

  onShareAppMessage() {
    const payload = createSharePayload(this);
    return {
      title: payload.title,
      path: payload.path,
      imageUrl: payload.imageUrl,
    };
  },

  onShareTimeline() {
    const payload = createSharePayload(this);
    return {
      title: payload.title,
      query: payload.query,
      imageUrl: payload.imageUrl,
    };
  },

  methods: {
    /**
     * 设置当前页面分享信息。
     * @param {Object} payload 分享配置
     * @returns {void}
     */
    setShareInfo(payload) {
      const nextState = payload || {};
      this.shareState = {
        title: nextState.title || DEFAULT_SHARE_TITLE,
        imageUrl: nextState.imageUrl || "",
        path: nextState.path || "",
        query: nextState.query || null,
      };
    },

    /**
     * 重置当前页面分享信息。
     * @returns {void}
     */
    resetShareInfo() {
      this.shareState = {
        title: DEFAULT_SHARE_TITLE,
        imageUrl: "",
        path: "",
        query: null,
      };
    },
  },
};
