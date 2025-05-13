"use strict";
const common_vendor = require("../../common/vendor.js");
const swiperImg = () => "../../components/swiperImg/swiperImg.js";
const _sfc_main = {
  components: {
    swiperImg
  },
  data() {
    return {
      parks: []
    };
  },
  created() {
    this.fetchParksData();
  },
  methods: {
    formatTime(timeStr) {
      if (timeStr) {
        const [hour, minute] = timeStr.split(":");
        return `${hour.padStart(2, "0")}:${minute}`;
      }
      return "";
    },
    getFeatureClass(feature) {
      if (feature === "需要预约") {
        return "yellow-feature";
      } else {
        return "green-feature";
      }
    },
    async fetchParksData() {
      try {
        const { data } = await common_vendor.index.request({
          url: "/scenic/getAllScenic"
        });
        this.parks = data.data;
      } catch (error) {
        console.error("Error fetching parks data:", error);
      }
    },
    getReservationStatus(park) {
      if (park.capacity === 0) {
        return ["无需预约"];
      } else if (park.capacity === 1) {
        return ["需要预约"];
      } else {
        return [];
      }
    },
    formatTime(timeStr) {
      if (timeStr) {
        return timeStr.slice(0, 5);
      }
      return "";
    },
    navigateToDetail(id) {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + id
      }).catch((err) => {
        console.error("页面跳转出错：", err);
      });
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
        d: common_vendor.t($options.formatTime(park.startTime)),
        e: common_vendor.t($options.formatTime(park.endTime)),
        f: common_vendor.f($options.getReservationStatus(park), (feature, i, i1) => {
          return {
            a: common_vendor.t(feature),
            b: i,
            c: common_vendor.n($options.getFeatureClass(feature))
          };
        }),
        g: park.id,
        h: common_vendor.o(($event) => $options.navigateToDetail(park.id), park.id)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/allScenic/allScenic.vue"]]);
wx.createPage(MiniProgramPage);
