"use strict";
const common_vendor = require("../common/vendor.js");
const baseUrl = "http://localhost:8080";
const whiteList = [
  "/api/updateUserInfo"
  // 添加修改密码接口到白名单
];
common_vendor.index.addInterceptor("request", {
  invoke(requestOptions) {
    if (!requestOptions.url.startsWith("/")) {
      requestOptions.url = "/" + requestOptions.url;
    }
    if (requestOptions.url.startsWith("/api") && !whiteList.includes(requestOptions.url)) {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.showToast({
          title: "请先进行登录",
          icon: "none"
        });
        return false;
      }
      requestOptions.header = requestOptions.header || {};
      requestOptions.header.Authorization = `${token}`;
    }
    requestOptions.url = baseUrl + requestOptions.url;
    return requestOptions;
  },
  success(response) {
    return response;
  },
  fail(error) {
    return error;
  }
});
