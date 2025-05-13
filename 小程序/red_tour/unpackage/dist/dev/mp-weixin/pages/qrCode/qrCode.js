"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      scanResult: "",
      // 扫描结果
      captureInterval: null,
      // 定时器
      showVerifyButton: false,
      // 是否显示确认核销按钮
      currentOrderId: null
      // 当前订单 ID
    };
  },
  methods: {
    startCamera() {
      this.captureInterval = setInterval(() => {
        const ctx = common_vendor.index.createCameraContext();
        ctx.takePhoto({
          quality: "low",
          // 设置照片质量
          success: (res) => {
            this.processImage(res.tempImagePath);
          },
          fail: (err) => {
            console.error("拍摄失败:", err);
          }
        });
      }, 1e3);
    },
    stopCamera() {
      if (this.captureInterval) {
        clearInterval(this.captureInterval);
        this.captureInterval = null;
      }
    },
    processImage(imagePath) {
      const ctx = common_vendor.index.createCanvasContext("qrCanvas");
      ctx.drawImage(imagePath, 0, 0, 300, 300);
      ctx.draw(false, () => {
        common_vendor.index.canvasGetImageData({
          canvasId: "qrCanvas",
          x: 0,
          y: 0,
          width: 300,
          height: 300,
          success: (res) => {
            this.decodeQRCode(res.data);
          },
          fail: (err) => {
            console.error("获取 canvas 数据失败:", err);
          }
        });
      });
    },
    async decodeQRCode(imageData) {
      try {
        const code = common_vendor.jsqr(new Uint8ClampedArray(imageData), 300, 300);
        if (code && code.data) {
          const response = await common_vendor.index.request({
            url: "/api/orders/selectOrderById",
            // 后端接口地址
            method: "POST",
            header: {
              "Content-Type": "application/json"
              // 设置请求头为 JSON 格式
            },
            data: {
              id: code.data
            }
          });
          if (response.statusCode === 200 && response.data.status === 200) {
            this.scanResult = code.data;
            const result = response.data.data;
            const content = "二维码有效";
            const phone = result.phone || "无手机号";
            this.scanResult = `${content}
订单手机: ${phone}`;
            this.showVerifyButton = true;
          } else {
            common_vendor.index.showToast({
              icon: "none",
              title: "无效二维码",
              duration: 1500
            });
            this.scanResult = "";
            this.startCamera();
          }
          this.stopCamera();
        } else {
        }
      } catch (error) {
        console.log("解码二维码失败:", error);
      }
    },
    async verifyOrder() {
      console.log("核销订单:", this.scanResult);
      this.startCamera();
      this.scanResult = "";
      this.showVerifyButton = false;
    },
    onCameraError(e) {
      console.error("相机错误:", e.detail);
    }
  },
  mounted() {
    this.startCamera();
  },
  beforeDestroy() {
    this.stopCamera();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.scanResult || "暂无扫描结果"),
    b: $data.showVerifyButton
  }, $data.showVerifyButton ? {
    c: common_vendor.o((...args) => $options.verifyOrder && $options.verifyOrder(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/qrCode/qrCode.vue"]]);
wx.createPage(MiniProgramPage);
