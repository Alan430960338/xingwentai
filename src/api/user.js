import request from "./config/request.js";
import { baseUrl } from "./config/config.js";

export const login = (data) => {
  return request.post("user/test_login", data);
};

export const getUserOrderList = (data) => {
  return request.get("demands/userOrderList", data);
};

export const getDemandCategoryList = (data) => {
  return request.get("demands/category", data);
};

export const getAddressList = (data) => {
  return request.get("addre/address_list", data);
};

export const getDefaultAddress = (data) => {
  return request.get("addre/get_default_address", data);
};

export const getUserOrderDetail = (data) => {
  return request.get("demands/detail", data);
};

export const cancelUserOrder = (data) => {
  return request.post("demands/cancel", data);
};

export const getQualificationInvoiceList = (data) => {
  return request.get("qualifications/index", data);
};

export const getInvoiceTitleList = (data) => {
  return request.post("qualifications/list", data);
};

export const addInvoiceTitle = (data) => {
  return request.post("qualifications/add", data);
};
export const applyInvoiceTitle = (data) => {
  return request.post("qualifications/apply", data);
};
export const deleteInvoiceTitle = (data) => {
  return request.post("qualifications/delete", data);
};
export const editInvoiceTitle = (data) => {
  return request.post("qualifications/edit", data);
};

export const getInvoiceTitleDetail = (data) => {
  return request.get("qualifications/detail", data);
};

export const addAddress = (data) => {
  return request.post("addre/add_address", data);
};

export const deleteAddress = (data) => {
  return request.post("addre/delete_address", data);
};

export const getAddressDetail = (data) => {
  return request.post("addre/address_detail", data);
};

export const editAddress = (data) => {
  return request.post("addre/edit_address", data);
};

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

export const updateDemand = (data) => {
  return request.post("demands/update", data);
};
