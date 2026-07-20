import request from "./config/request.js";
import { baseUrl } from "./config/config.js";


export const createDemand = (data, filePath, name = "images") => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync("token");

    uni.uploadFile({
      url: `${baseUrl}demands/create`,
      filePath,
      name,
      formData: data,
      header: {
        token,
      },
      success: (res) => {
        let responseData = {};

        try {
          responseData = JSON.parse(res.data || "{}");
        } catch (error) {
          reject(error);
          return;
        }

        resolve(responseData);
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};



export const getCenterOrderList = (data) => {
  return request.get("worker/index", data);
};

export const getEngineerOrderDetail = (data) => {
  return request.get("demands/detail", data);
};

export const getMyOrderList = (data) => {
  return request.get("worker/myOrderList", data);
};

export const acceptOrder = (data) => {
  return request.post("worker/accept", data);
};

export const getWalletInfo = (data) => {
  return request.get("worker/wallet_info", data);
};

export const getWalletDetail = (data) => {
  return request.get("worker/wallet_detail", data);
};

export const checkInOrder = (data) => {
  return request.post("worker/check_in", data);
};

export const submitServiceSettlement = (data) => {
  return request.post("worker/service_submit", data);
};

export const getEvaluateDetail = (data) => {
  return request.get("worker/get_evaluate", data);
};
export const cancelOrder = (data) => {
  return request.post("demands/cancel_accept", data);
};
