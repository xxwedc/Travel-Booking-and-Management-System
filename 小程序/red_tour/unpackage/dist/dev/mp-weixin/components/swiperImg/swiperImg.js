"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    pathData: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const images = [
      "http://localhost:8888/swiper/sw1.png",
      "http://localhost:8888/swiper/sw2.png",
      "http://localhost:8888/swiper/sw3.png"
    ];
    const imagesToShow = common_vendor.computed(() => {
      return props.pathData.length > 0 ? props.pathData : images;
    });
    return {
      imagesToShow
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($setup.imagesToShow, (item, k0, i0) => {
      return {
        a: item,
        b: item
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/components/swiperImg/swiperImg.vue"]]);
wx.createComponent(Component);
