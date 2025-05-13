"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      newsDetail: {},
      swiperImages: [],
      paragraphs: []
    };
  },
  onLoad(options) {
    this.getNewsDetailById(options.id);
  },
  methods: {
    async getNewsDetailById(id) {
      try {
        const newsRes = await common_vendor.index.request({
          url: "/news/getNewById",
          method: "POST",
          data: {
            id
          }
        });
        if (newsRes.statusCode === 200) {
          this.newsDetail = newsRes.data.data;
          const imagesRes = await common_vendor.index.request({
            url: "/images/getImages",
            method: "POST",
            data: {
              id
            }
          });
          if (imagesRes.statusCode === 200) {
            this.swiperImages = imagesRes.data.data;
            this.splitContent();
          }
        }
      } catch (err) {
        console.error("获取资讯详情出错：", err);
      }
    },
    splitContent() {
      if (this.newsDetail && this.newsDetail.content) {
        const contentArray = this.newsDetail.content.split("。");
        this.paragraphs = contentArray.map((item) => item + "。");
      }
    },
    paragraphStyle(paragraph, index) {
      let styleClass = "";
      if (index % 2 === 0) {
        styleClass = "even-paragraph";
      } else {
        styleClass = "odd-paragraph";
      }
      return styleClass;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.newsDetail.title),
    b: common_vendor.t($data.newsDetail.userName || "匿名作者"),
    c: common_vendor.t($data.newsDetail.time || "暂无时间"),
    d: common_vendor.f($data.paragraphs, (paragraph, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(paragraph),
        b: common_vendor.n($options.paragraphStyle(paragraph, index)),
        c: $data.swiperImages[index]
      }, $data.swiperImages[index] ? {
        d: $data.swiperImages[index]
      } : {}, {
        e: index % 2 === 1 && !$data.swiperImages[index + 1]
      }, index % 2 === 1 && !$data.swiperImages[index + 1] ? {} : {}, {
        f: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/newsDetail/newsDetail.vue"]]);
wx.createPage(MiniProgramPage);
