"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      scenicData: [],
      centerLatitude: 0,
      centerLongitude: 0,
      clickedScenic: null,
      isInitialLoad: true,
      defaultScenic: null,
      currentScenicName: "",
      currentScenicAddress: "",
      currentScenicStartTime: "",
      currentScenicEndTime: ""
    };
  },
  onLoad() {
    common_vendor.index.request({
      url: "/scenic/getAllScenic",
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          this.scenicData = res.data.data;
          if (this.scenicData.length > 0) {
            this.centerLatitude = this.scenicData[0].latitude;
            this.centerLongitude = this.scenicData[0].longitude;
            this.defaultScenic = this.scenicData[0];
            this.updateCurrentScenicInfo();
          }
        }
      },
      fail: (err) => {
        console.error(err);
      }
    });
  },
  onReady() {
    const mapContext = common_vendor.wx$1.createMapContext("myMap");
    this.scenicData.forEach((scenic) => {
      mapContext.addMarkers({
        markers: [{
          iconPath: "http://localhost:8888/icon/marker-icon.png",
          id: Number(scenic.id),
          latitude: scenic.latitude,
          longitude: scenic.longitude,
          width: 30,
          height: 30,
          callout: {
            content: scenic.name,
            color: "#000",
            fontSize: 12,
            borderRadius: 5,
            bgColor: "#fff",
            padding: 5,
            display: "ALWAYS"
          }
        }],
        success: () => {
          console.log("标记点添加成功");
        },
        fail: (err) => {
          console.error(err);
        }
      });
    });
  },
  methods: {
    goDetail() {
      if (this.clickedScenic || this.defaultScenic) {
        const scenicId = this.clickedScenic ? this.clickedScenic.id : this.defaultScenic.id;
        common_vendor.index.navigateTo({
          url: `/pages/detail/detail?id=${scenicId}`
        }).catch((err) => {
          console.error("页面跳转出错：", err);
        });
      }
    },
    onMapTap(e) {
      const {
        latitude,
        longitude
      } = e.detail;
      let foundScenic = null;
      this.scenicData.forEach((scenic) => {
        const distance = this.calculateDistance(latitude, longitude, scenic.latitude, scenic.longitude);
        if (distance < 1) {
          foundScenic = scenic;
          return false;
        }
      });
      this.clickedScenic = foundScenic;
      this.isInitialLoad = false;
      this.updateCurrentScenicInfo();
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      return timeStr.slice(0, 5);
    },
    updateCurrentScenicInfo() {
      if (this.clickedScenic) {
        this.currentScenicName = this.clickedScenic.name;
        this.currentScenicAddress = this.clickedScenic.address || "暂无地址信息";
        this.currentScenicStartTime = this.clickedScenic.startTime ? this.formatTime(this.clickedScenic.startTime) : "";
        this.currentScenicEndTime = this.clickedScenic.endTime ? this.formatTime(this.clickedScenic.endTime) : "";
      } else if (this.defaultScenic) {
        this.currentScenicName = this.defaultScenic.name;
        this.currentScenicAddress = this.defaultScenic.address || "暂无地址信息";
        this.currentScenicStartTime = this.defaultScenic.startTime ? this.formatTime(this.defaultScenic.startTime) : "";
        this.currentScenicEndTime = this.defaultScenic.endTime ? this.formatTime(this.defaultScenic.endTime) : "";
      } else {
        this.currentScenicName = "";
        this.currentScenicAddress = "";
        this.currentScenicStartTime = "";
        this.currentScenicEndTime = "";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.centerLatitude,
    b: $data.centerLongitude,
    c: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    d: $data.clickedScenic || $data.isInitialLoad
  }, $data.clickedScenic || $data.isInitialLoad ? common_vendor.e({
    e: common_vendor.t($data.currentScenicName),
    f: common_vendor.t($data.currentScenicAddress),
    g: $data.currentScenicStartTime && $data.currentScenicEndTime
  }, $data.currentScenicStartTime && $data.currentScenicEndTime ? {
    h: common_vendor.t($options.formatTime($data.currentScenicStartTime)),
    i: common_vendor.t($options.formatTime($data.currentScenicEndTime))
  } : {}, {
    j: common_vendor.o((...args) => $options.goDetail && $options.goDetail(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/map/map.vue"]]);
wx.createPage(MiniProgramPage);
