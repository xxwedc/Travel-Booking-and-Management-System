<template>
	<swiperImg></swiperImg>
	<view class="container">
		<view class="park-item" v-for="park in parks" :key="park.id" @click="navigateToDetail(park.id)" :class="{ 'active': touchedId === park.id }" @touchstart="handleTouchStart(park.id)" @touchend="handleTouchEnd">
			<image :src="park.img" class="park-image" mode="aspectFill"></image>
			<view class="park-info">
				<text class="park-name">{{park.name}}</text>
				<view class="park-status-time">
					<text class="park-time">{{park.address}}</text>
				</view>
				<view class="park-features">
					<text class="createOrder">立即预约</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import swiperImg from "../../components/swiperImg/swiperImg.vue";

	export default {
		components: {
			swiperImg,
		},
		data() {
			return {
				parks: [],
				touchedId: null,
			};
		},
		created() {
			this.fetchParksData();
		},
		methods: {
			formatTime(timeStr) {
				if (timeStr) {
					return timeStr.slice(0, 5);
				}
				return '';
			},
			navigateToDetail(id) {
				// 验证用户是否登录
				const token = uni.getStorageSync('token');
				if (!token) {
					uni.showToast({
						title: '请先进行登录',
						icon: 'none'
					});
					return false;
				}else{
					uni.reLaunch({
						url: '/pages/createOrder/createOrder?id=' + id,
					}).catch((err) => {
						console.error('页面跳转出错：', err);
					});
				}
			},
			async fetchParksData() {
				try {
					const {
						data
					} = await uni.request({
						url: '/scenic/getOrderScenic',
					});
					this.parks = data.data;
				} catch (error) {
					console.error('Error fetching parks data:', error);
				}
			},
			handleTouchStart(id) {
				this.touchedId = id;
			},
			handleTouchEnd() {
				this.touchedId = null;
			}
		},
	};
</script>

<style>
	@import "../../styles/my/myOrder.css";
</style>
