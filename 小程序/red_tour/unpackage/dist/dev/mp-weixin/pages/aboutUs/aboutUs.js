"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isMuted: true
      // 默认静音
    };
  },
  methods: {
    toggleMute() {
      this.isMuted = !this.isMuted;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.isMuted,
    b: common_vendor.t($data.isMuted ? "开启声音" : "关闭声音"),
    c: common_vendor.o((...args) => $options.toggleMute && $options.toggleMute(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/aboutUs/aboutUs.vue"]]);
wx.createPage(MiniProgramPage);
