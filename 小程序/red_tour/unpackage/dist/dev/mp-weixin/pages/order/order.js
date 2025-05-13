"use strict";
const common_vendor = require("../../common/vendor.js");
const swiperImg = () => "../../components/swiperImg/swiperImg.js";
const _sfc_main = {
  components: {
    swiperImg
  },
  data() {
    return {
      parks: [],
      touchedId: null
    };
  },
  created() {
    this.fetchParksData();
  },
  methods: {
    formatTime(timeStr) {
      if (timeStr) {
        return timeStr.slice(0, 5);
      }
      return "";
    },
    navigateToDetail(id) {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.showToast({
          title: "请先进行登录",
          icon: "none"
        });
        return false;
      } else {
        common_vendor.index.reLaunch({
          url: "/pages/createOrder/createOrder?id=" + id
        }).catch((err) => {
          console.error("页面跳转出错：", err);
        });
      }
    },
    async fetchParksData() {
      try {
        const {
          data
        } = await common_vendor.index.request({
          url: "/scenic/getOrderScenic"
        });
        this.parks = data.data;
      } catch (error) {
        console.error("Error fetching parks data:", error);
      }
    },
    handleTouchStart(id) {
      this.touchedId = id;
    },
    handleTouchEnd() {
      this.touchedId = null;
    }
  }
};
if (!Array) {
  const _easycom_swiperImg2 = common_vendor.resolveComponent("swiperImg");
  _easycom_swiperImg2();
}
const _easycom_swiperImg = () => "../../components/swiperImg/swiperImg.js";
if (!Math) {
  _easycom_swiperImg();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.parks, (park, k0, i0) => {
      return {
        a: park.img,
        b: common_vendor.t(park.name),
        c: common_vendor.t(park.address),
        d: park.id,
        e: common_vendor.o(($event) => $options.navigateToDetail(park.id), park.id),
        f: $data.touchedId === park.id ? 1 : "",
        g: common_vendor.o(($event) => $options.handleTouchStart(park.id), park.id),
        h: common_vendor.o((...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args), park.id)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/order/order.vue"]]);
wx.createPage(MiniProgramPage);
