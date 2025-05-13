"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      gender: 0,
      birthDate: null,
      nickname: "",
      account: "",
      password: "",
      confirmPassword: "",
      nicknameError: "",
      accountError: "",
      passwordError: "",
      confirmPasswordError: "",
      ageError: "",
      region: [],
      regionText: "请选择地区",
      role: 2
    };
  },
  methods: {
    handleGenderChange(e) {
      this.gender = e.detail.value;
    },
    handleBirthDateChange(e) {
      this.birthDate = e.detail.value;
      this.calculateAge();
    },
    checkNickname() {
      const nicknameRegex = /^[\u4e00-\u9fa5]{0,6}|[a-zA-Z0-9]{0,12}$/;
      return nicknameRegex.test(this.nickname);
    },
    checkAccount() {
      const accountRegex = /^\d{11}$/;
      return accountRegex.test(this.account);
    },
    checkPassword() {
      return this.password.length >= 8;
    },
    checkConfirmPassword() {
      return this.password === this.confirmPassword && this.confirmPassword.length >= 8;
    },
    calculateAge() {
      if (this.birthDate) {
        const birthDateObj = new Date(this.birthDate);
        const currentDate = /* @__PURE__ */ new Date();
        let age = currentDate.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate()) {
          age--;
        }
        return age;
      } else {
        return null;
      }
    },
    handleRegionChange(e) {
      this.region = e.detail.value;
      this.regionText = this.region.join(",");
    },
    async submitRegistration() {
      let nicknameValid = this.checkNickname();
      let accountValid = this.checkAccount();
      let passwordValid = this.checkPassword();
      let confirmPasswordValid = this.checkConfirmPassword();
      let age = this.calculateAge();
      if (!nicknameValid) {
        this.nicknameError = "昵称长度为中文最多 6 个字符，英文最多 12 个字符。";
      } else {
        this.nicknameError = "";
      }
      if (!accountValid) {
        this.accountError = "账号应为 11 位阿拉伯数字。";
      } else {
        this.accountError = "";
      }
      if (!passwordValid) {
        this.passwordError = "密码最短为 8 位。";
      } else {
        this.passwordError = "";
      }
      if (!confirmPasswordValid) {
        this.confirmPasswordError = "两次输入的密码不一致。 ";
      } else {
        this.confirmPasswordError = "";
      }
      if (!age || age < 1 || age > 99) {
        this.ageError = "年龄不符合要求。";
      } else {
        this.ageError = "";
      }
      if (!nicknameValid || !accountValid || !passwordValid || !confirmPasswordValid || !age || !this.region.length) {
        return;
      }
      const userData = {
        account: this.account,
        password: this.password,
        username: this.nickname,
        sex: this.gender,
        age,
        phone: this.account,
        address: this.region.join("-"),
        role: this.role
      };
      try {
        const response = await common_vendor.index.request({
          url: "/user/register",
          method: "POST",
          data: userData
        });
        if (response.data.status == 200) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "../../pages/login/login"
            });
          }, 2e3);
        } else {
          common_vendor.index.showToast({
            title: response.data.message,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "注册失败",
          icon: "none"
        });
      }
    },
    getErrorClass(field) {
      return {
        "error-message": this[`${field}Error`]
      };
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
    e: common_vendor.n($options.getErrorClass("nickname"))
  } : {}, {
    f: $data.account,
    g: common_vendor.o(($event) => $data.account = $event.detail.value),
    h: $data.accountError
  }, $data.accountError ? {
    i: common_vendor.t($data.accountError),
    j: common_vendor.n($options.getErrorClass("account"))
  } : {}, {
    k: $data.password,
    l: common_vendor.o(($event) => $data.password = $event.detail.value),
    m: $data.passwordError
  }, $data.passwordError ? {
    n: common_vendor.t($data.passwordError),
    o: common_vendor.n($options.getErrorClass("password"))
  } : {}, {
    p: $data.confirmPassword,
    q: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    r: $data.confirmPasswordError
  }, $data.confirmPasswordError ? {
    s: common_vendor.t($data.confirmPasswordError),
    t: common_vendor.n($options.getErrorClass("confirmPassword"))
  } : {}, {
    v: $data.gender === 1,
    w: $data.gender === 0,
    x: common_vendor.o((...args) => $options.handleGenderChange && $options.handleGenderChange(...args)),
    y: common_vendor.t($data.birthDate || "请选择出生日期"),
    z: common_vendor.o((...args) => $options.handleBirthDateChange && $options.handleBirthDateChange(...args)),
    A: $data.ageError
  }, $data.ageError ? {
    B: common_vendor.t($data.ageError),
    C: common_vendor.n($options.getErrorClass("age"))
  } : {}, {
    D: common_vendor.t($data.regionText),
    E: common_vendor.o((...args) => $options.handleRegionChange && $options.handleRegionChange(...args)),
    F: common_vendor.o((...args) => $options.submitRegistration && $options.submitRegistration(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/register/register.vue"]]);
wx.createPage(MiniProgramPage);
