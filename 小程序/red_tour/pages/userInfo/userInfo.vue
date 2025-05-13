<template>
	<view class="register-container">
		<view class="input-item">
			<text class="label">昵称</text>
			<input type="text" placeholder="填写您的昵称" v-model="nickname" />
			<text v-if="nicknameError" :class="getErrorClass('nickname')">{{ nicknameError }}</text>
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
			<text class="label">出生日期</text>
			<picker mode="date" @change="handleBirthDateChange">
				<text>{{ birthDate || '请选择出生日期' }}</text>
			</picker>
			<text v-if="ageError" :class="getErrorClass('age')">{{ ageError }}</text>
		</view>
		<view class="input-item">
			<text class="label">所在地区</text>
			<input type="text" placeholder="填写您的住址" v-model="address" />
			<text v-if="addressError" :class="getErrorClass('address')">{{ addressError }}</text>
		</view>
		<button type="default" class="password-btn" @click="goToChangePassword">修改密码</button>
		<button type="primary" class="submit-btn" @click="updateUserInfo">修改信息</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: '',
				gender: null,
				birthDate: '',
				address: '',
				nicknameError: '',
				ageError: '',
				addressError: '',
				oldData: null,
				newData: null
			};
		},
		onLoad() {
			// 页面加载时发起请求获取用户信息
			const getUserInfo = () => {
				return new Promise((resolve, reject) => {
					uni.request({
						url: '/api/user/getUserInfoById',
						method: 'post',
						success: (response) => {
							//赋值后续方便进行判断
							this.oldData = response.data.data;
							if (response && response.data) {
								// 成功获取数据后，解析数据并返回
								const userData = response.data.data;
								resolve(userData);
							} else {
								// 如果没有数据或响应不正确，拒绝并给出错误信息
								reject('获取用户信息失败：响应中无有效数据');
							}
						},
						fail: (error) => {
							// 如果请求失败，拒绝并给出错误信息
							reject(`获取用户信息失败：请求出错，错误信息为 ${error.errMsg}`);
						}
					});
				});
			};
			getUserInfo()
				.then((userData) => {
					this.nickname = userData.username;
					this.gender = userData.sex;
					// 根据年龄计算出生日期并设置
					const today = new Date();
					const birthYear = today.getFullYear() - userData.age;
					const formattedBirthDate = new Date(birthYear, today.getMonth(), today.getDate()).toISOString()
						.split('T')[0];
					this.birthDate = formattedBirthDate;
					this.address = userData.address;
				})
				.catch((errorMessage) => {
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
				// 获取输入框数据
				const newNickName = this.nickname;
				const newSex = this.gender;
				const newAddress = this.address;
				//根据日期计算年龄
				const birthDate = new Date(this.birthDate);
				const currentDate = new Date();
				const age = currentDate.getFullYear() - birthDate.getFullYear();
				if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() &&
						currentDate.getDate() < birthDate.getDate())) {
					age--;
				}
				const newAge = age;
				const odata = this.oldData;
				// 判断用户是否对数据进行了修改
				if (newNickName == odata.username && newSex == odata.sex && newAge == odata.age && newAddress == odata
					.address) {
					uni.showToast({
						title: '请先修改数据',
						icon: 'none',
					});
				} else {
					const userData = {
						id: this.oldData.id,
						username: newNickName,
						sex: newSex,
						age: newAge,
						address: newAddress
					};
					uni.request({
						url: '/api/updateUserInfo', // 接口地址
						method: 'POST', // 请求方法
						data: userData,
						success: (res) => {
							uni.showToast({
								title: '修改成功',
								icon: 'none',
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/my/my'
								})
							}, 1500);
						},
						fail: (err) => {
							uni.showToast({
								title: '修改失败',
								icon: 'none',
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/my/my'
								})
							}, 1500);
						}
					});







				}

			},
			goToChangePassword() {
				uni.navigateTo({
					url: '/pages/forgotPassword/forgotPassword'
				});
			},

		}
	};
</script>

<style>
	@import '../../styles/my/register.css';
	.password-btn {
		margin-bottom: 15px;
	}
</style>