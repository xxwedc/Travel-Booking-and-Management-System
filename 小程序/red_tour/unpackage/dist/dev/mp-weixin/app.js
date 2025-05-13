"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
require("./utils/Jwt.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/my/my.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/map/map.js";
  "./pages/myOrder/myOrder.js";
  "./pages/detail/detail.js";
  "./pages/newsDetail/newsDetail.js";
  "./pages/userInfo/userInfo.js";
  "./pages/allScenic/allScenic.js";
  "./pages/createOrder/createOrder.js";
  "./pages/ranking/ranking.js";
  "./pages/order/order.js";
  "./pages/aboutUs/aboutUs.js";
  "./pages/forgotPassword/forgotPassword.js";
  "./pages/qrCode/qrCode.js";
}
const pages = [
  "pages/ranking/ranking"
];
const window = {
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#fff",
  navigationBarTitleText: "景点排行",
  navigationBarTextStyle: "black"
};
const App = {
  pages,
  window
};
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
