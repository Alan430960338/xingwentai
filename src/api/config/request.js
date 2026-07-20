import { baseUrl } from "../config/config.js";

const JSON_HEADER = { "Content-Type": "application/json;charset=UTF-8" };
const FORM_HEADER = {
  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
};
const DEFAULT_LOADING_TEXT = "正在加载";
const LOGIN_EXPIRED_TEXT = "登录已过期，请重新登录";
const REQUEST_ERROR_TEXT = "请稍后再试";
const UPLOAD_ERROR_TEXT = "上传失败";
const uploadUrl = `${baseUrl}index/upload`;

class Request {
  constructor() {
    this.config = {
      baseUrl,
      header: JSON_HEADER,
      header2: FORM_HEADER,
      method: "GET",
      showLoading: false,
      loadingText: DEFAULT_LOADING_TEXT,
      loadingTime: 500,
      timer: 0,
      loadingMask: true,
    };

    this.interceptor = {
      /**
       * 请求拦截。
       * @param {Object} config 请求配置
       * @returns {Object}
       */
      request(config) {
        return { ...config, data: config.data || {} };
      },

      /**
       * 响应拦截。
       * @param {Object} response 响应对象
       * @returns {Object}
       */
      response(response) {
        return response.data || {};
      },
    };
  }

  /**
   * 发起 GET 请求。
   * @param {string} url 请求地址
   * @param {Object} data 请求参数
   * @param {Object} config 请求配置
   * @param {Object} requestHeader 自定义请求头
   * @returns {Promise<any>}
   */
  get(url, data = {}, config = {}, requestHeader = {}) {
    return this.send("GET", url, data, config, requestHeader);
  }

  /**
   * 发起 POST 请求。
   * @param {string} url 请求地址
   * @param {Object} data 请求参数
   * @param {Object} config 请求配置
   * @param {Object} requestHeader 自定义请求头
   * @returns {Promise<any>}
   */
  post(url, data = {}, config = {}, requestHeader = {}) {
    return this.send("POST", url, data, config, requestHeader);
  }

  /**
   * 发起 PUT 请求。
   * @param {string} url 请求地址
   * @param {Object} data 请求参数
   * @param {Object} config 请求配置
   * @param {Object} requestHeader 自定义请求头
   * @returns {Promise<any>}
   */
  put(url, data = {}, config = {}, requestHeader = {}) {
    return this.send("PUT", url, data, config, requestHeader);
  }

  /**
   * 发起 DELETE 请求。
   * @param {string} url 请求地址
   * @param {Object} data 请求参数
   * @param {Object} config 请求配置
   * @param {Object} requestHeader 自定义请求头
   * @returns {Promise<any>}
   */
  delete(url, data = {}, config = {}, requestHeader = {}) {
    return this.send("DELETE", url, data, config, requestHeader);
  }

  /**
   * 统一请求入口。
   * @param {string} method 请求方法
   * @param {string} url 请求地址
   * @param {Object} data 请求参数
   * @param {Object} config 请求配置
   * @param {Object} requestHeader 自定义请求头
   * @returns {Promise<any>}
   */
  send(method, url, data = {}, config = {}, requestHeader = {}) {
    this.config.loadingText = config.loadingText || DEFAULT_LOADING_TEXT;
    const requestUrl = /^https?:\/\//.test(url)
      ? url
      : `${this.config.baseUrl}${url}`;
    return this.request({
      url: requestUrl,
      method,
      header: requestHeader,
      data,
      requireAuth: config.requireAuth,
      silentAuth: config.silentAuth,
    });
  }

  /**
   * 上传图片。
   * @param {string} filePath 文件路径
   * @param {string} name 文件字段名
   * @returns {Promise<any>}
   */
  uploadImage(filePath, name = "file") {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync("token");

      uni.uploadFile({
        url: uploadUrl,
        filePath,
        name,
        header: {
          token,
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          if (data.code === 1) {
            resolve(data.data);
            return;
          }

          uni.showToast({
            icon: "none",
            title: data.message || data.msg || UPLOAD_ERROR_TEXT,
            duration: 1000,
          });
          reject(data);
        },
        fail: (error) => {
          uni.showToast({
            icon: "none",
            title: UPLOAD_ERROR_TEXT,
            duration: 1000,
          });
          reject(error);
        },
      });
    });
  }

  /**
   * 清理登录缓存。
   * @returns {void}
   */
  clearLoginInfo() {
    uni.removeStorageSync("token");
  }

  /**
   * 跳转登录页。
   * @param {string} message 提示文案
   * @returns {void}
   */
  redirectToLogin(message = LOGIN_EXPIRED_TEXT) {
    this.clearLoginInfo();
    uni.redirectTo({
      url: "/pages/index",
    });
    uni.showToast({
      title: message,
      icon: "none",
      duration: 2000,
    });
  }

  /**
   * 生成鉴权请求头。
   * @returns {Object}
   */
  getAuthHeader() {
    const token = uni.getStorageSync("token");
    return token ? { token } : {};
  }

  /**
   * 构建请求头。
   * @param {string} method 请求方法
   * @param {Object} requestHeader 自定义请求头
   * @returns {Object}
   */
  buildHeaders(method, requestHeader = {}) {
    const defaultHeader =
      method === "POST" ? this.config.header2 : this.config.header;

    return Object.assign(
      {},
      defaultHeader,
      this.getAuthHeader(),
      requestHeader,
    );
  }

  /**
   * 处理请求前的鉴权校验。
   * @param {Object} requestOptions 请求配置
   * @returns {boolean}
   */
  validateRequestAuth(requestOptions) {
    const token = uni.getStorageSync("token");

    if (requestOptions.requireAuth && !token) {
      return false;
    }

    return true;
  }

  /**
   * 处理接口响应。
   * @param {Object} response 原始响应
   * @param {Object} requestOptions 请求配置
   * @param {Function} resolve 成功回调
   * @param {Function} reject 失败回调
   * @returns {void}
   */
  handleResponse(response, requestOptions, resolve, reject) {
    const { statusCode } = response;
    const responseData = response.data || {};
    const hasToken = Boolean(requestOptions.header && requestOptions.header.token);
    const isAuthExpired = statusCode === 401 || (hasToken && responseData.code === 401);

    if (isAuthExpired) {
      if (hasToken && !requestOptions.silentAuth) {
        this.redirectToLogin(
          responseData.message || responseData.msg || LOGIN_EXPIRED_TEXT,
        );
      } else if (hasToken) {
        this.clearLoginInfo();
      }

      reject("token expired");
      return;
    }

    const finalResponse = this.interceptor.response
      ? this.interceptor.response(response) || response
      : response;

    if (statusCode === 200) {
      resolve(finalResponse);
      return;
    }

    uni.showToast({
      title: responseData.message || responseData.msg || REQUEST_ERROR_TEXT,
      icon: "none",
      duration: 2000,
      mask: true,
    });
    reject(finalResponse);
  }

  /**
   * 发送底层请求。
   * @param {Object} options 请求配置
   * @returns {Promise<any>}
   */
  request(options = {}) {
    const requestOptions = this.interceptor.request(options);
    requestOptions.dataType = requestOptions.dataType || this.config.dataType;
    requestOptions.url = requestOptions.url || "";
    requestOptions.params = requestOptions.params || "";
    requestOptions.method = requestOptions.method || this.config.method;
    requestOptions.header = this.buildHeaders(
      requestOptions.method,
      requestOptions.header,
    );

    if (!this.validateRequestAuth(requestOptions)) {
      return Promise.reject("missing token");
    }

    return new Promise((resolve, reject) => {
      requestOptions.complete = (response) => {
        this.handleResponse(response, requestOptions, resolve, reject);
      };

      uni.request(requestOptions);
    });
  }
}

export default new Request();
