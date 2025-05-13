"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      appointments: [],
      isLoading: false,
      currentStatus: 0,
      statusTabs: [
        { label: "待出行", value: 0 },
        { label: "已完成", value: 1 },
        { label: "全部", value: -1 }
      ],
      statusMap: {
        0: { text: "待出行", class: "status-pending" },
        1: { text: "已完成", class: "status-confirmed" }
      },
      showDetailPopup: false,
      showQRPopup: false,
      // 初始化二维码弹窗状态
      detailData: {},
      qrCodeUrl: ""
      // 用于存储后端返回的二维码图片链接
    };
  },
  computed: {
    filteredAppointments() {
      let result = this.appointments;
      if (this.currentStatus !== -1) {
        result = result.filter((item) => item.status === this.currentStatus);
      }
      return result.sort((a, b) => {
        try {
          const parseDateTime = (timeStr) => {
            const [datePart, timePart] = timeStr.split(" - ");
            const [date, time] = datePart.split(" ");
            const [year, month, day] = date.split("-");
            return /* @__PURE__ */ new Date(`${year}-${month}-${day}T${time}:00`);
          };
          if (a.status === 0 && b.status === 0) {
            return parseDateTime(a.orderTime) - parseDateTime(b.orderTime);
          } else if (a.status === 1 && b.status === 1) {
            const parseTime = (timeStr) => {
              const [date, time] = timeStr.split(" ");
              const [year, month, day] = date.split("-");
              return /* @__PURE__ */ new Date(`${year}-${month}-${day}T${time}`);
            };
            return parseTime(b.time) - parseTime(a.time);
          } else {
            return a.status - b.status;
          }
        } catch (error) {
          return 0;
        }
      });
    },
    parsedVisitors() {
      try {
        return JSON.parse(this.detailData.content || "[]");
      } catch (error) {
        return [];
      }
    }
  },
  onShow() {
    this.loadAppointments();
  },
  onPullDownRefresh() {
    this.loadAppointments().finally(() => {
      common_vendor.index.stopPullDownRefresh();
    });
  },
  methods: {
    // 处理预约数据
    processAppointments(data) {
      if (!Array.isArray(data))
        return [];
      return data.map((item) => {
        try {
          const [datePart, timePart] = item.orderTime.split(" - ");
          const [date, time] = datePart.split(" ");
          const [year, month, day] = date.split("-");
          const currentTime = /* @__PURE__ */ new Date();
          const orderEndDateTime = /* @__PURE__ */ new Date(`${year}-${month}-${day}T${timePart}:00`);
          const status = currentTime > orderEndDateTime ? 1 : 0;
          return {
            id: item.id,
            scenicName: item.scenicName,
            orderTime: item.orderTime,
            phone: item.phone,
            content: item.content,
            status,
            time: item.time,
            userName: item.userName
          };
        } catch (error) {
          console.error("处理预约数据错误:", error);
          const currentTime = /* @__PURE__ */ new Date();
          const defaultOrderEndDateTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1e3);
          const status = currentTime > defaultOrderEndDateTime ? 1 : 0;
          return {
            id: item.id,
            scenicName: item.scenicName,
            orderTime: item.orderTime,
            phone: item.phone,
            content: item.content,
            status,
            time: item.time,
            userName: item.userName
          };
        }
      });
    },
    // 获取访客姓名
    getVisitorName(contentStr) {
      try {
        if (!contentStr)
          return "未知访客";
        const contentArray = JSON.parse(contentStr);
        if (Array.isArray(contentArray) && contentArray.length > 0) {
          return contentArray[0].name || "未知访客";
        }
        return "未知访客";
      } catch (error) {
        console.error("解析访客信息错误:", error);
        return "未知访客";
      }
    },
    // 请求预约数据
    async requestAppointments(token) {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "/api/orders/selectMyOrder",
          method: "POST",
          data: { token },
          success: (res) => {
            if (res.data.status === 200) {
              resolve(res.data);
            } else {
              resolve(res.data);
            }
          },
          fail: reject
        });
      });
    },
    // 加载预约数据
    async loadAppointments() {
      if (this.isLoading)
        return;
      this.isLoading = true;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
          }, 1500);
          return;
        }
        const res = await this.requestAppointments(token);
        this.appointments = this.processAppointments(res.data);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },
    // 获取状态样式
    getStatusClass(status) {
      var _a;
      return ((_a = this.statusMap[status]) == null ? void 0 : _a.class) || "";
    },
    // 获取状态文本
    getStatusText(status) {
      var _a;
      return ((_a = this.statusMap[status]) == null ? void 0 : _a.text) || "未知状态";
    },
    // 检查是否可取消
    canCancel(status) {
      return status === 0;
    },
    // 处理取消预约
    async handleCancel(id) {
      try {
        const confirmed = await this.showCancelConfirm();
        if (!confirmed)
          return;
        await this.cancelAppointment(id);
        this.loadAppointments();
      } catch (error) {
        this.handleError(error);
      }
    },
    // 显示取消确认框
    showCancelConfirm() {
      return new Promise((resolve) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "确定要取消预约吗？",
          success: (res) => resolve(res.confirm)
        });
      });
    },
    // 取消预约请求
    async cancelAppointment(id) {
      const res = await common_vendor.index.request({
        url: "/order/deleteOrderById",
        method: "POST",
        data: { id }
      });
      if (res.statusCode !== 200 || res.data.status !== 200) {
        throw new Error(res.data.message || "取消预约失败");
      }
      common_vendor.index.showToast({ title: "取消成功", icon: "success" });
    },
    // 查看详情
    async viewDetail(id) {
      try {
        const appointment = this.appointments.find((item) => item.id === id);
        if (appointment) {
          this.detailData = appointment;
          this.showDetailPopup = true;
        } else {
          throw new Error("未找到预约详情");
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    // 关闭详情弹窗
    closeDetail() {
      this.showDetailPopup = false;
      this.detailData = {};
    },
    // 弹出二维码窗口
    async showQRCode(id) {
      try {
        const response = await common_vendor.index.request({
          url: "/api/orders/makeQRCode",
          // 后端接口地址
          method: "POST",
          header: {
            "Content-Type": "application/json"
            // 设置请求头为 JSON 格式
          },
          data: {
            id
          }
        });
        if (response.statusCode === 200 && response.data.status === 200) {
          this.qrCodeUrl = response.data.data;
          this.showQRPopup = true;
        } else {
          throw new Error(response.data.message || "生成二维码失败");
        }
      } catch (error) {
        console.log("错误", error);
        this.handleError(error);
      }
    },
    // 关闭二维码弹窗
    closeQRCode() {
      this.showQRPopup = false;
      this.qrCodeUrl = "";
    },
    // 统一错误处理
    handleError(error) {
      console.error("操作失败：", error);
      common_vendor.index.showToast({
        title: error.message || "操作失败",
        icon: "none"
      });
    },
    // 格式化时间显示
    formatDateTime(dateStr) {
      try {
        return dateStr;
      } catch (error) {
        return dateStr;
      }
    },
    // 添加切换状态方法
    async switchStatus(status) {
      if (this.currentStatus === status)
        return;
      this.currentStatus = status;
      this.isLoading = true;
      await this.$nextTick();
      this.isLoading = false;
    }
  }
};
if (!Array) {
  const _component_uni_load_more = common_vendor.resolveComponent("uni-load-more");
  _component_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.statusTabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.label),
        b: index,
        c: common_vendor.n({
          active: $data.currentStatus === tab.value
        }),
        d: common_vendor.o(($event) => $options.switchStatus(tab.value), index)
      };
    }),
    b: $data.isLoading
  }, $data.isLoading ? {
    c: common_vendor.p({
      status: "loading"
    })
  } : {}, {
    d: common_vendor.f($options.filteredAppointments, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.scenicName),
        b: common_vendor.t($options.getStatusText(item.status)),
        c: common_vendor.n($options.getStatusClass(item.status)),
        d: common_vendor.t($options.formatDateTime(item.orderTime)),
        e: common_vendor.t(item.phone),
        f: common_vendor.t($options.getVisitorName(item.content)),
        g: $options.canCancel(item.status)
      }, $options.canCancel(item.status) ? {
        h: common_vendor.o(($event) => $options.handleCancel(item.id), item.id)
      } : {}, {
        i: common_vendor.o(($event) => $options.viewDetail(item.id), item.id),
        j: item.status === 0
      }, item.status === 0 ? {
        k: common_vendor.o(($event) => $options.showQRCode(item.id), item.id)
      } : {}, {
        l: item.id
      });
    }),
    e: !$data.isLoading && !$options.filteredAppointments.length
  }, !$data.isLoading && !$options.filteredAppointments.length ? {
    f: common_vendor.t($options.getStatusText($data.currentStatus))
  } : {}, {
    g: $data.showDetailPopup
  }, $data.showDetailPopup ? {
    h: common_vendor.o((...args) => $options.closeDetail && $options.closeDetail(...args)),
    i: common_vendor.t($data.detailData.scenicName),
    j: common_vendor.t($data.detailData.orderTime),
    k: common_vendor.t($data.detailData.userName),
    l: common_vendor.t($data.detailData.phone),
    m: common_vendor.f($options.parsedVisitors, (visitor, index, i0) => {
      return {
        a: common_vendor.t(visitor.name),
        b: common_vendor.t(visitor.id),
        c: index
      };
    }),
    n: common_vendor.t($data.detailData.time)
  } : {}, {
    o: $data.showQRPopup
  }, $data.showQRPopup ? {
    p: common_vendor.o((...args) => $options.closeQRCode && $options.closeQRCode(...args)),
    q: $data.qrCodeUrl
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/myOrder/myOrder.vue"]]);
wx.createPage(MiniProgramPage);
