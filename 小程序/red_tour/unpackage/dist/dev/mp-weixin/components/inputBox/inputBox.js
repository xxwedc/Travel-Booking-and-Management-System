"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_time = require("../../utils/time.js");
const dateOnly = utils_time.getCurrentDate();
const _sfc_main = {
  name: "InputBox",
  props: {
    scenicId: {
      type: [Number, String],
      required: true,
      default: ""
    }
  },
  data() {
    return {
      content: "",
      maxLength: 200,
      time: utils_time.getCurrentDate()
    };
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.detail.value);
    },
    async handleSubmit() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      const trimmedContent = this.content.trim();
      if (!trimmedContent) {
        common_vendor.index.showToast({
          title: "请输入内容",
          icon: "none"
        });
        return;
      }
      if (!this.scenicId) {
        common_vendor.index.showToast({
          title: "系统错误，请稍后重试",
          icon: "none"
        });
        return;
      }
      try {
        const response = await common_vendor.index.request({
          url: "/comment/addComment",
          method: "POST",
          data: {
            userId: token,
            otherId: this.scenicId,
            content: trimmedContent,
            time: dateOnly
          }
        });
        if (response.data.status === 200) {
          common_vendor.index.showToast({
            title: "评论成功",
            icon: "success"
          });
          this.content = "";
          this.$emit("submit", trimmedContent);
        } else {
          common_vendor.index.showToast({
            title: response.data.msg || "评论失败",
            icon: "none"
          });
          this.content = "";
        }
      } catch (error) {
        console.error("提交评论失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.maxLength,
    b: common_vendor.o([($event) => $data.content = $event.detail.value, (...args) => $options.handleInput && $options.handleInput(...args)]),
    c: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    d: $data.content,
    e: $data.content.trim() ? 1 : "",
    f: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1e520b65"], ["__file", "D:/hsupp/小程序/red_tour/components/inputBox/inputBox.vue"]]);
wx.createComponent(Component);
