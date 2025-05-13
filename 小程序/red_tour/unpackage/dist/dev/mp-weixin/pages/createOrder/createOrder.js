"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_time = require("../../utils/time.js");
const swiperImg = () => "../../components/swiperImg/swiperImg.js";
const _sfc_main = {
  components: { swiperImg },
  data() {
    return {
      swiperImages: [],
      scenicDetail: null,
      dateList: [],
      // 存储三天的日期数据
      selectedDateIndex: 0,
      // 默认选中第一天（今天）
      currentTimeSlots: [],
      // 当前选中日期的时间槽
      selectedSlotIndex: -1,
      // 选中的时间槽下标
      visitorsCount: 1,
      visitorNames: [""],
      visitorIds: [""],
      phoneNumber: "",
      selectedTime: null
      // 选中的完整时间字符串
    };
  },
  onLoad(options) {
    const id = options.id;
    this.fetchSwiperImages(id);
    this.fetchDetailData(id);
    this.fetchScenicTimes(id);
  },
  methods: {
    formatTime(timeStr) {
      return timeStr ? timeStr.slice(0, 5) : "";
    },
    // 恢复轮播图数据获取方法
    async fetchSwiperImages(scenicId) {
      try {
        const { data } = await common_vendor.index.request({
          url: "/images/getImages",
          method: "POST",
          data: { id: scenicId }
        });
        this.swiperImages = data.data || [];
      } catch (error) {
        console.error("获取轮播图失败:", error);
      }
    },
    // 恢复景区详情数据获取方法
    async fetchDetailData(scenicId) {
      try {
        const { data } = await common_vendor.index.request({
          url: "/scenic/getScenicById",
          method: "POST",
          data: { id: scenicId }
        });
        this.scenicDetail = data.data;
      } catch (error) {
        console.error("获取景区详情失败:", error);
      }
    },
    async fetchScenicTimes(scenicId) {
      try {
        const { data } = await common_vendor.index.request({
          url: `/order/getScenicTime/${scenicId}`,
          method: "GET"
        });
        if (data.status === 200) {
          this.dateList = data.data;
          this.currentTimeSlots = this.dateList[0].order;
        }
      } catch (error) {
        console.error("获取时间数据失败:", error);
      }
    },
    selectDate(index) {
      this.selectedDateIndex = index;
      this.currentTimeSlots = this.dateList[index].order;
      this.selectedSlotIndex = -1;
      this.selectedTime = null;
    },
    selectTime(index) {
      const timeSlot = this.currentTimeSlots[index];
      if (timeSlot.isPast)
        return;
      this.selectedSlotIndex = index;
      this.selectedTime = timeSlot.orderTime;
    },
    // 人数增减、表单验证、提交逻辑与之前一致
    incrementVisitors() {
      if (this.visitorsCount < 6) {
        this.visitorsCount++;
        this.visitorNames.push("");
        this.visitorIds.push("");
      }
    },
    decrementVisitors() {
      if (this.visitorsCount > 1) {
        this.visitorsCount--;
        this.visitorNames.pop();
        this.visitorIds.pop();
      }
    },
    submitOrder() {
      if (!this.selectedTime) {
        return common_vendor.index.showToast({ title: "请选择预约时间", icon: "none" });
      }
      if (this.visitorNames.some((name) => !name.trim()) || this.visitorIds.some((id) => !id.trim())) {
        return common_vendor.index.showToast({ title: "请完整填写游客信息", icon: "none" });
      }
      if (!this.phoneNumber || !/^1[3-9]\d{9}$/.test(this.phoneNumber)) {
        return common_vendor.index.showToast({ title: "请输入正确的联系电话", icon: "none" });
      }
      const token = common_vendor.index.getStorageSync("token");
      const visitorInfo = this.visitorNames.map((name, index) => ({
        name,
        id: this.visitorIds[index]
      }));
      const Data = {
        userId: token,
        scenicId: this.scenicDetail.id,
        orderTime: this.selectedTime,
        content: JSON.stringify(visitorInfo),
        phone: this.phoneNumber,
        time: utils_time.getCurrentTimeFormatted()
      };
      common_vendor.index.request({
        url: "/api/order/insertOrder",
        method: "POST",
        data: Data,
        success: (res) => {
          if (res.data.status === 200) {
            common_vendor.index.showToast({ title: "预约成功", icon: "success" });
            setTimeout(() => {
              common_vendor.index.reLaunch({ url: "../myOrder/myOrder" });
            }, 1500);
          } else {
            common_vendor.index.showToast({ title: "预约失败，请重试", icon: "none" });
          }
        },
        fail: (err) => {
          console.error("提交失败:", err);
          common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
        }
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
  return common_vendor.e({
    a: common_vendor.p({
      pathData: $data.swiperImages
    }),
    b: $data.scenicDetail
  }, $data.scenicDetail ? {
    c: common_vendor.t($data.scenicDetail.name),
    d: common_vendor.t($data.scenicDetail.address),
    e: common_vendor.t($options.formatTime($data.scenicDetail.startTime)),
    f: common_vendor.t($options.formatTime($data.scenicDetail.endTime))
  } : {}, {
    g: common_vendor.f($data.dateList, (dateItem, index, i0) => {
      return {
        a: common_vendor.t(dateItem.date),
        b: index,
        c: $data.selectedDateIndex === index ? 1 : "",
        d: common_vendor.o(($event) => $options.selectDate(index), index)
      };
    }),
    h: common_vendor.f($data.currentTimeSlots, (timeSlot, slotIndex, i0) => {
      return {
        a: common_vendor.t(timeSlot.orderTime),
        b: common_vendor.t(timeSlot.isPast ? "已过期" : "可预约"),
        c: slotIndex,
        d: timeSlot.isPast ? 1 : "",
        e: $data.selectedSlotIndex === slotIndex ? 1 : "",
        f: common_vendor.o(($event) => $options.selectTime(slotIndex), slotIndex),
        g: timeSlot.isPast
      };
    }),
    i: common_vendor.o((...args) => $options.decrementVisitors && $options.decrementVisitors(...args)),
    j: $data.visitorsCount === 1,
    k: common_vendor.t($data.visitorsCount),
    l: common_vendor.o((...args) => $options.incrementVisitors && $options.incrementVisitors(...args)),
    m: $data.visitorsCount === 6,
    n: common_vendor.f($data.visitorsCount, (visitor, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: $data.visitorNames[index],
        c: common_vendor.o(($event) => $data.visitorNames[index] = $event.detail.value, index),
        d: $data.visitorIds[index],
        e: common_vendor.o(($event) => $data.visitorIds[index] = $event.detail.value, index),
        f: index
      };
    }),
    o: $data.phoneNumber,
    p: common_vendor.o(($event) => $data.phoneNumber = $event.detail.value),
    q: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args)),
    r: !$data.selectedTime
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/createOrder/createOrder.vue"]]);
wx.createPage(MiniProgramPage);
