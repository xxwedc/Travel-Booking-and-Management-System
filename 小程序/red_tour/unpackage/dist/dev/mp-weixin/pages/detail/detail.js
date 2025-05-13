"use strict";
const common_vendor = require("../../common/vendor.js");
const swiperImg = () => "../../components/swiperImg/swiperImg.js";
const inputBox = () => "../../components/inputBox/inputBox.js";
const _sfc_main = {
  components: {
    swiperImg,
    inputBox
  },
  data() {
    return {
      detail: {
        id: "",
        name: "",
        capacity: 0,
        startTime: "",
        endTime: "",
        features: [],
        address: "",
        detail: ""
      },
      comments: [],
      swiperImages: []
    };
  },
  onLoad(options) {
    const id = options.id;
    this.fetchDetailData(id);
    this.fetchCommentsData(id);
    this.fetchSwiperImages(id);
  },
  methods: {
    formatTime(timeStr) {
      if (timeStr) {
        const [hour, minute] = timeStr.split(":");
        return `${hour.padStart(2, "0")}:${minute}`;
      }
      return "";
    },
    async fetchDetailData(id) {
      try {
        const {
          data
        } = await common_vendor.index.request({
          url: "/scenic/getScenicById",
          method: "POST",
          data: {
            id
          }
        });
        this.detail = data.data;
      } catch (error) {
        console.error("Error fetching detail data:", error);
      }
    },
    async fetchCommentsData(id) {
      try {
        const {
          data
        } = await common_vendor.index.request({
          url: "/comment/getComment",
          method: "POST",
          data: {
            id
          }
        });
        this.comments = data.data;
      } catch (error) {
        console.error("Error fetching comments data:", error);
      }
    },
    async fetchSwiperImages(id) {
      try {
        const {
          data
        } = await common_vendor.index.request({
          url: "/images/getImages",
          method: "POST",
          data: {
            id
          }
        });
        if (data.data !== null) {
          this.swiperImages = data.data;
        }
      } catch (error) {
        console.error("Error fetching swiper images:", error);
      }
    },
    getStatusClass() {
      if (this.detail.state === 0) {
        return "green-bg-status";
      } else if (this.detail.state === 1) {
        return "red-bg-status";
      }
      return "";
    },
    handleSubmit(content) {
      const newComment = {
        id: Date.now(),
        // 临时ID
        userName: "游客",
        // 可以根据实际登录用户信息修改
        content,
        createTime: /* @__PURE__ */ new Date()
      };
      this.comments.unshift(newComment);
      common_vendor.index.showToast({
        title: "评论成功",
        icon: "success"
      });
    }
  }
};
if (!Array) {
  const _easycom_swiperImg2 = common_vendor.resolveComponent("swiperImg");
  const _easycom_inputBox2 = common_vendor.resolveComponent("inputBox");
  (_easycom_swiperImg2 + _easycom_inputBox2)();
}
const _easycom_swiperImg = () => "../../components/swiperImg/swiperImg.js";
const _easycom_inputBox = () => "../../components/inputBox/inputBox.js";
if (!Math) {
  (_easycom_swiperImg + _easycom_inputBox)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      pathData: $data.swiperImages
    }),
    b: common_vendor.t($data.detail.name),
    c: $data.detail.capacity === 0
  }, $data.detail.capacity === 0 ? {} : $data.detail.capacity === 1 ? {} : {}, {
    d: $data.detail.capacity === 1,
    e: common_vendor.n($options.getStatusClass()),
    f: common_vendor.t($options.formatTime($data.detail.startTime)),
    g: common_vendor.t($options.formatTime($data.detail.endTime)),
    h: $data.detail.capacity === 1
  }, $data.detail.capacity === 1 ? {} : {}, {
    i: $data.detail.capacity === 0
  }, $data.detail.capacity === 0 ? {} : {}, {
    j: common_vendor.f($data.detail.features, (feature, k0, i0) => {
      return {
        a: common_vendor.t(feature),
        b: feature
      };
    }),
    k: common_vendor.t($data.detail.address),
    l: common_vendor.t($data.detail.detail),
    m: $data.comments.length === 0
  }, $data.comments.length === 0 ? {} : {}, {
    n: common_vendor.f($data.comments, (comment, k0, i0) => {
      return {
        a: common_vendor.t(comment.userName),
        b: common_vendor.t(comment.content),
        c: comment.id
      };
    }),
    o: common_vendor.o($options.handleSubmit),
    p: common_vendor.p({
      scenicId: $data.detail.id
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
