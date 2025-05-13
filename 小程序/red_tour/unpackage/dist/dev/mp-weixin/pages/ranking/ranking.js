"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      monthlyRank: [],
      weeklyRank: []
    };
  },
  methods: {
    async getMonthlyRanks() {
      try {
        const res = await common_vendor.index.request({
          url: "/order/getRankingYear",
          // 替换为今年热门的后端接口地址
          method: "GET"
        });
        this.monthlyRank = res.data.data;
      } catch (error) {
        console.error("Error fetching monthly ranks:", error);
      }
    },
    async getWeeklyRanks() {
      try {
        const res = await common_vendor.index.request({
          url: "/order/getRankingMonth",
          // 替换为本月热门的后端接口地址
          method: "GET"
        });
        this.weeklyRank = res.data.data;
      } catch (error) {
        console.error("Error fetching weekly ranks:", error);
      }
    },
    goToSpotDetail(scenicId) {
      if (!scenicId)
        return;
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + scenicId
      });
    }
  },
  onLoad() {
    this.getMonthlyRanks();
    this.getWeeklyRanks();
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.monthlyRank.length > 0
  }, $data.monthlyRank.length > 0 ? {
    b: common_vendor.p({
      type: "star-filled",
      size: "24",
      color: "#ffd700"
    }),
    c: common_vendor.p({
      type: "refresh",
      size: "14",
      color: "#ffffff"
    }),
    d: common_vendor.f($data.monthlyRank, (spot, sIndex, i0) => {
      return {
        a: common_vendor.t(sIndex + 1),
        b: sIndex < 3 ? 1 : "",
        c: common_vendor.t(spot.scenicName),
        d: common_vendor.t(spot.count),
        e: common_vendor.o(($event) => $options.goToSpotDetail(spot.scenicId), sIndex),
        f: sIndex
      };
    })
  } : {}, {
    e: $data.weeklyRank.length > 0
  }, $data.weeklyRank.length > 0 ? {
    f: common_vendor.p({
      type: "fire-filled",
      size: "24",
      color: "#ff6b6b"
    }),
    g: common_vendor.p({
      type: "refresh",
      size: "14",
      color: "#ffffff"
    }),
    h: common_vendor.f($data.weeklyRank, (spot, sIndex, i0) => {
      return {
        a: common_vendor.t(sIndex + 1),
        b: sIndex < 3 ? 1 : "",
        c: common_vendor.t(spot.scenicName),
        d: common_vendor.t(spot.count),
        e: common_vendor.o(($event) => $options.goToSpotDetail(spot.scenicId), sIndex),
        f: sIndex
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/ranking/ranking.vue"]]);
wx.createPage(MiniProgramPage);
