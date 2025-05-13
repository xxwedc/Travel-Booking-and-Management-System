<template>
	<view class="page-container">
		<swiperImg :pathData="swiperImages"></swiperImg>
		<view class="scenic-info" v-if="scenicDetail">
			<text class="scenic-name">{{scenicDetail.name}}</text>
			<view class="scenic-address-time">
				<text style="margin-right: 20px;">{{scenicDetail.address}}</text>
				<text class="scenic-time">{{formatTime(scenicDetail.startTime)}} - {{formatTime(scenicDetail.endTime)}}</text>
			</view>
		</view>
		<view class="createOrder-info">
			<view class="Ordertime-text">
				<view class="date-selector">
					<view 
						v-for="(dateItem, index) in dateList" 
						:key="index" 
						class="date-btn"
						:class="{ 'active-date': selectedDateIndex === index }"
						@click="selectDate(index)"
					>
						{{ dateItem.date }}
					</view>
				</view>
				<view class="time-slot-container">
					<view 
						v-for="(timeSlot, slotIndex) in currentTimeSlots" 
						:key="slotIndex" 
						class="time-slot"
						:class="{ 'disabled-slot': timeSlot.isPast, 'selected-slot': selectedSlotIndex === slotIndex }"
						@click="selectTime(slotIndex)"
						:disabled="timeSlot.isPast"
					>
						<text class="slot-time">{{ timeSlot.orderTime }}</text>
						<text class="slot-status">{{ timeSlot.isPast ? '已过期' : '可预约' }}</text>
					</view>
				</view>
			</view>
			<!-- 预约人数、游客信息、联系电话等表单部分 -->
			<view class="visitors-info">
				<view class="addButton-info">
					<view class="jiajianTxt">
						<text class="visitors-label">预约人数</text>
					</view>
					<view class="jiajianBt">
						<view class="counter">
							<button @tap="decrementVisitors" class="counter-btn" :disabled="visitorsCount === 1">-</button>
							<text class="counter-text">{{visitorsCount}}</text>
							<button @tap="incrementVisitors" class="counter-btn" :disabled="visitorsCount === 6">+</button>
						</view>
					</view>
				</view>
				<view 
					v-for="(visitor, index) in visitorsCount" 
					:key="index" 
					class="visitors-content"
				>
					<view class="input-group">
						<text class="input-label">游客{{index + 1}}：</text>
						<input 
							type="text" 
							class="input-field" 
							v-model="visitorNames[index]" 
							placeholder="请输入姓名"
						>
						<input 
							type="text" 
							class="input-field" 
							v-model="visitorIds[index]" 
							placeholder="请输入身份证号码"
						>
					</view>
				</view>
			</view>
			<view class="lineNum" style="margin-bottom: 80px;">
				<text>联系电话 :</text>
				<input type="text" class="linePhone" placeholder="请输入联系电话" v-model="phoneNumber">
			</view>
			<view class="goodBtn">
				<button type="primary" class="submit-btn" @click="submitOrder" :disabled="!selectedTime">提交预约</button>
			</view>
		</view>
	</view>
</template>

<script>
	import swiperImg from "../../components/swiperImg/swiperImg.vue";
import { getCurrentTimeFormatted } from "../../utils/time.js";

	export default {
		components: { swiperImg },
		data() {
			return {
				swiperImages: [],
				scenicDetail: null,
				dateList: [], // 存储三天的日期数据
				selectedDateIndex: 0, // 默认选中第一天（今天）
				currentTimeSlots: [], // 当前选中日期的时间槽
				selectedSlotIndex: -1, // 选中的时间槽下标
				visitorsCount: 1,
				visitorNames: [''],
				visitorIds: [''],
				phoneNumber: '',
				selectedTime: null // 选中的完整时间字符串
			};
		},
		onLoad(options) {
			const id = options.id;
			this.fetchSwiperImages(id); // 恢复轮播图数据获取
			this.fetchDetailData(id);    // 恢复景区详情数据获取
			this.fetchScenicTimes(id);  // 预约时间数据获取
		},
		methods: {
			formatTime(timeStr) {
				return timeStr ? timeStr.slice(0, 5) : '';
			},
			// 恢复轮播图数据获取方法
			async fetchSwiperImages(scenicId) {
				try {
					const { data } = await uni.request({
						url: '/images/getImages',
						method: 'POST',
						data: { id: scenicId },
					});
					this.swiperImages = data.data || [];
				} catch (error) {
					console.error('获取轮播图失败:', error);
				}
			},
			// 恢复景区详情数据获取方法
			async fetchDetailData(scenicId) {
				try {
					const { data } = await uni.request({
						url: '/scenic/getScenicById',
						method: 'POST',
						data: { id: scenicId },
					});
					this.scenicDetail = data.data;
				} catch (error) {
					console.error('获取景区详情失败:', error);
				}
			},
			async fetchScenicTimes(scenicId) {
				try {
					const { data } = await uni.request({
						url: `/order/getScenicTime/${scenicId}`,
						method: 'GET'
					});
					if (data.status === 200) {
						this.dateList = data.data; // 直接使用后端返回的三天数据
						this.currentTimeSlots = this.dateList[0].order; // 初始化显示今天的时间槽
					}
				} catch (error) {
					console.error('获取时间数据失败:', error);
				}
			},
			selectDate(index) {
				this.selectedDateIndex = index;
				this.currentTimeSlots = this.dateList[index].order;
				this.selectedSlotIndex = -1; // 切换日期时清除时间选择
				this.selectedTime = null;
			},
			selectTime(index) {
				const timeSlot = this.currentTimeSlots[index];
				if (timeSlot.isPast) return; // 跳过已过期时段
				this.selectedSlotIndex = index;
				this.selectedTime = timeSlot.orderTime; // 存储完整时间字符串
			},
			// 人数增减、表单验证、提交逻辑与之前一致
			incrementVisitors() {
				if (this.visitorsCount < 6) {
					this.visitorsCount++;
					this.visitorNames.push('');
					this.visitorIds.push('');
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
					return uni.showToast({ title: '请选择预约时间', icon: 'none' });
				}
				if (this.visitorNames.some(name => !name.trim()) || this.visitorIds.some(id => !id.trim())) {
					return uni.showToast({ title: '请完整填写游客信息', icon: 'none' });
				}
				if (!this.phoneNumber || !/^1[3-9]\d{9}$/.test(this.phoneNumber)) {
					return uni.showToast({ title: '请输入正确的联系电话', icon: 'none' });
				}

				const token = uni.getStorageSync('token');
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
					time: getCurrentTimeFormatted(),
				};

				uni.request({
					url: "/api/order/insertOrder",
					method: "POST",
					data: Data,
					success: (res) => {
						if (res.data.status === 200) {
							uni.showToast({ title: '预约成功', icon: 'success' });
							setTimeout(() => {
								uni.reLaunch({ url: '../myOrder/myOrder' });
							}, 1500);
						} else {
							uni.showToast({ title: '预约失败，请重试', icon: 'none' });
						}
					},
					fail: (err) => {
						console.error('提交失败:', err);
						uni.showToast({ title: '网络请求失败', icon: 'none' });
					}
				});
			}
		}
	};
</script>

<style>
	/* 样式部分与之前一致，补充日期选择和时间槽的样式 */
	@import '../../styles/Order/createOrder.css';
</style>