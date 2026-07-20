import request from "./config/request.js";
import { baseUrl } from "./config/config.js";

export const getAreaList = (data) => {
  return request.get("common/areaAll", data);
};

export const uploadCommonFile = (filePath, name = "file") => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync("token");

    uni.uploadFile({
      url: `${baseUrl}common/upload`,
      filePath,
      name,
      header: {
        token,
      },
      success: (res) => {
        let data = {};

        try {
          data = JSON.parse(res.data || "{}");
        } catch (error) {
          reject(error);
          return;
        }

        if (data.code === 1) {
          resolve(data);
          return;
        }

        reject(data);
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};
