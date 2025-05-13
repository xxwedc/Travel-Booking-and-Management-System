"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      nickname: "",
      gender: null,
      birthDate: "",
      address: "",
      nicknameError: "",
      ageError: "",
      addressError: "",
      oldData: null,
      newData: null
    };
  },
  onLoad() {
    const getUserInfo = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "/api/user/getUserInfoById",
          method: "post",
          success: (response) => {
            this.oldData = response.data.data;
            if (response && response.data) {
              const userData = response.data.data;
              resolve(userData);
            } else {
              reject("获取用户信息失败：响应中无有效数据");
            }
          },
          fail: (error) => {
            reject(`获取用户信息失败：请求出错，错误信息为 ${error.errMsg}`);
          }
        });
      });
    };
    getUserInfo().then((userData) => {
      this.nickname = userData.username;
      this.gender = userData.sex;
      const today = /* @__PURE__ */ new Date();
      const birthYear = today.getFullYear() - userData.age;
      const formattedBirthDate = new Date(birthYear, today.getMonth(), today.getDate()).toISOString().split("T")[0];
      this.birthDate = formattedBirthDate;
      this.address = userData.address;
    }).catch((errorMessage) => {
      console.error(errorMessage);
    });
  },
  methods: {
    handleGenderChange(e) {
      this.gender = e.detail.value;
    },
    handleBirthDateChange(e) {
      this.birthDate = e.detail.value;
    },
    updateUserInfo() {
      const newNickName = this.nickname;
      const newSex = this.gender;
      const newAddress = this.address;
      const birthDate = new Date(this.birthDate);
      const currentDate = /* @__PURE__ */ new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      if (currentDate.getMonth() < birthDate.getMonth() || currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) {
        age--;
      }
      const newAge = age;
      const odata = this.oldData;
      if (newNickName == odata.username && newSex == odata.sex && newAge == odata.age && newAddress == odata.address) {
        common_vendor.index.showToast({
          title: "请先修改数据",
          icon: "none"
        });
      } else {
        const userData = {
          id: this.oldData.id,
          username: newNickName,
          sex: newSex,
          age: newAge,
          address: newAddress
        };
        common_vendor.index.request({
          url: "/api/updateUserInfo",
          // 接口地址
          method: "POST",
          // 请求方法
          data: userData,
          success: (res) => {
            common_vendor.index.showToast({
              title: "修改成功",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/my/my"
              });
            }, 1500);
          },
          fail: (err) => {
            common_vendor.index.showToast({
              title: "修改失败",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/my/my"
              });
            }, 1500);
          }
        });
      }
    },
    goToChangePassword() {
      common_vendor.index.navigateTo({
        url: "/pages/forgotPassword/forgotPassword"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.nickname,
    b: common_vendor.o(($event) => $data.nickname = $event.detail.value),
    c: $data.nicknameError
  }, $data.nicknameError ? {
    d: common_vendor.t($data.nicknameError),
    e: common_vendor.n(_ctx.getErrorClass("nickname"))
  } : {}, {
    f: $data.gender === 1,
    g: $data.gender === 0,
    h: common_vendor.o((...args) => $options.handleGenderChange && $options.handleGenderChange(...args)),
    i: common_vendor.t($data.birthDate || "请选择出生日期"),
    j: common_vendor.o((...args) => $options.handleBirthDateChange && $options.handleBirthDateChange(...args)),
    k: $data.ageError
  }, $data.ageError ? {
    l: common_vendor.t($data.ageError),
    m: common_vendor.n(_ctx.getErrorClass("age"))
  } : {}, {
    n: $data.address,
    o: common_vendor.o(($event) => $data.address = $event.detail.value),
    p: $data.addressError
  }, $data.addressError ? {
    q: common_vendor.t($data.addressError),
    r: common_vendor.n(_ctx.getErrorClass("address"))
  } : {}, {
    s: common_vendor.o((...args) => $options.goToChangePassword && $options.goToChangePassword(...args)),
    t: common_vendor.o((...args) => $options.updateUserInfo && $options.updateUserInfo(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/userInfo/userInfo.vue"]]);
wx.createPage(MiniProgramPage);
