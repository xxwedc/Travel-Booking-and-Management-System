<template>
	<view class="register-container">
		<view class="input-item">
			<text class="label">* 昵称</text>
			<input type="text" placeholder="填写您的昵称" v-model="nickname" />
			<text v-if="nicknameError" :class="getErrorClass('nickname')">{{ nicknameError }}</text>
		</view>
		<view class="input-item">
			<text class="label">* 账号</text>
			<input type="text" placeholder="填写您的手机号码" v-model="account" />
			<text v-if="accountError" :class="getErrorClass('account')">{{ accountError }}</text>
		</view>
		<view class="input-item">
			<text class="label">* 密码</text>
			<input type="text" password="true" placeholder="填写您的密码" v-model="password" />
			<text v-if="passwordError" :class="getErrorClass('password')">{{ passwordError }}</text>
		</view>
		<view class="input-item">
			<text class="label">* 确认密码</text>
			<input type="text" password="true" placeholder="再次输入密码" v-model="confirmPassword" />
			<text v-if="confirmPasswordError"
				:class="getErrorClass('confirmPassword')">{{ confirmPasswordError }}</text>
		</view>
		<view class="input-item">
			<text class="label">性别</text>
			<radio-group @change="handleGenderChange">
				<label class="gender-item">
					<radio value="1" :checked="gender === 1" />男
				</label>
				<label class="gender-item">
					<radio value="0" :checked="gender === 0" />女
				</label>
			</radio-group>
		</view>
		<view class="input-item">
			<text class="label">* 出生日期</text>
			<picker mode="date" @change="handleBirthDateChange">
				<text>{{ birthDate || '请选择出生日期' }}</text>
			</picker>
			<text v-if="ageError" :class="getErrorClass('age')">{{ ageError }}</text>
		</view>
		<view class="input-item">
			<text class="label">所在地区</text>
			<picker mode="region" @change="handleRegionChange">
				<text>{{ regionText }}</text>
			</picker>
		</view>
		<button type="primary" class="submit-btn" @click="submitRegistration">提交注册</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gender: 0,
				birthDate: null,
				nickname: '',
				account: '',
				password: '',
				confirmPassword: '',
				nicknameError: '',
				accountError: '',
				passwordError: '',
				confirmPasswordError: '',
				ageError: '',
				region: [],
				regionText: '请选择地区',
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
					const currentDate = new Date();
					let age = currentDate.getFullYear() - birthDateObj.getFullYear();
					const monthDiff = currentDate.getMonth() - birthDateObj.getMonth();
					if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate())) {
						age--;
					}
					return age;
				} else {
					return null;
				}
			},
			handleRegionChange(e) {
				this.region = e.detail.value;
				this.regionText = this.region.join(',');
			},
			async submitRegistration() {
				let nicknameValid = this.checkNickname();
				let accountValid = this.checkAccount();
				let passwordValid = this.checkPassword();
				let confirmPasswordValid = this.checkConfirmPassword();
				let age = this.calculateAge();
				if (!nicknameValid) {
					this.nicknameError = '昵称长度为中文最多 6 个字符，英文最多 12 个字符。';
				} else {
					this.nicknameError = '';
				}
				if (!accountValid) {
					this.accountError = '账号应为 11 位阿拉伯数字。';
				} else {
					this.accountError = '';
				}
				if (!passwordValid) {
					this.passwordError = '密码最短为 8 位。';
				} else {
					this.passwordError = '';
				}
				if (!confirmPasswordValid) {
					this.confirmPasswordError = '两次输入的密码不一致。 ';
				} else {
					this.confirmPasswordError = '';
				}
				if (!age || age < 1 || age > 99) {
					this.ageError = '年龄不符合要求。';
				} else {
					this.ageError = '';
				}
				if (!nicknameValid || !accountValid || !passwordValid || !confirmPasswordValid || !age || !this.region
					.length) {
					return;
				}
				const userData = {
					account: this.account,
					password: this.password,
					username: this.nickname,
					sex: this.gender,
					age: age,
					phone: this.account,
					address: this.region.join('-'),
					role: this.role
				};
				try {
					const response = await uni.request({
						url: '/user/register',
						method: 'POST',
						data: userData,
					});
					// 对后端返回的数据进行输出解析
					if (response.data.status == 200) {
						uni.showToast({
							title: '注册成功',
							icon: 'success',
						});
						// 注册成功2s后跳转登录页面
						setTimeout(() => {
							uni.reLaunch({
								url: '../../pages/login/login',
							});
						}, 2000);
						// console.log('后端返回的消息：', response.data);
					} else {
						uni.showToast({ 
							title: response.data.message,
							icon: 'none',
						});
					}
				} catch (error) {
					uni.showToast({
						title: '注册失败',
						icon: 'none',
					});
				}
			},
			getErrorClass(field) {
				return {
					'error-message': this[`${field}Error`],
				};
			},
		},
	};
</script>

<style>
	@import '../../styles/my/register.css';
</style>