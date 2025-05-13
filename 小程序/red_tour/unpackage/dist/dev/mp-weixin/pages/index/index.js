"use strict";
const common_vendor = require("../../common/vendor.js");
const swiperImg = () => "../../components/swiperImg/swiperImg.js";
const _sfc_main = {
  components: {
    swiperImg
  },
  data() {
    return {
      buttonList: [
        {
          img: "http://localhost:8888/icon/map11.png",
          title: "红色地图"
        },
        {
          img: "http://localhost:8888/icon/yuyue4.png",
          title: "景点预约"
        },
        {
          img: "http://localhost:8888/icon/ranking.png",
          title: "热门排行"
        },
        {
          img: "http://localhost:8888/icon/allScenic.png",
          title: "全部景点"
        }
      ],
      redInfoList: []
    };
  },
  onLoad() {
    this.fetchRedInfo();
  },
  methods: {
    navigateToPage(pageName) {
      switch (pageName) {
        case "红色地图":
          common_vendor.index.reLaunch({
            url: "../map/map"
          });
          break;
        case "景点预约":
          common_vendor.index.navigateTo({
            url: "../order/order"
          });
          break;
        case "热门排行":
          common_vendor.index.navigateTo({
            url: "/pages/ranking/ranking"
          });
          break;
        case "全部景点":
          common_vendor.index.navigateTo({
            url: "/pages/allScenic/allScenic"
          });
          break;
      }
    },
    async fetchRedInfo() {
      try {
        const res = await common_vendor.index.request({
          url: "/news/getNews"
        });
        if (res.statusCode === 200) {
          this.redInfoList = res.data.data;
        } else {
          console.error("获取红色资讯数据失败");
        }
      } catch (err) {
        console.error("获取红色资讯数据时发生错误：", err);
      }
    },
    navigateToInfoPage(id) {
      common_vendor.index.navigateTo({
        url: "/pages/newsDetail/newsDetail?id=" + id
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
    a: common_vendor.f($data.buttonList, (item, index, i0) => {
      return {
        a: item.img,
        b: common_vendor.t(item.title),
        c: item.active ? 1 : "",
        d: index,
        e: common_vendor.o(($event) => $options.navigateToPage(item.title), index)
      };
    }),
    b: common_vendor.f($data.redInfoList, (item, index, i0) => {
      return {
        a: item.img,
        b: common_vendor.t(item.title),
        c: item.active ? 1 : "",
        d: index,
        e: common_vendor.o(($event) => $options.navigateToInfoPage(item.id), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
