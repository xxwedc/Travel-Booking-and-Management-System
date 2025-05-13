<template>
	<swiperImg :pathData="swiperImages"></swiperImg>
	<view>
		<view class="park-detail">
			<p class="park-name">{{detail.name}}</p>
			<view class="park-status-info">
				<view class="park-status" :class="getStatusClass()">
					<p v-if="detail.capacity === 0" class="status-text green-bg">无需预约</p>
					<p v-else-if="detail.capacity === 1" class="status-text red-bg">需要预约</p>
				</view>
				<p class="time-text">{{formatTime(detail.startTime)}} - {{formatTime(detail.endTime)}}</p>
				<p class="goOrder" v-if="detail.capacity === 1">点击可进行预约</p>
				<p class="noGoOrder" v-if="detail.capacity === 0">无需预约直接前往</p>
			</view>
			<view class="park-features">
				<p v-for="feature in detail.features" :key="feature" class="feature-text">{{feature}}</p>
			</view>
			<p class="park-address">{{detail.address}}</p>
			<div class="detailTe">
				<p>{{detail.detail}}</p>
			</div>
		</view>
		<view class="comments-section">
			<p class="comments-title">| 游客评论</p>
			<!-- 这里可以添加循环来展示评论，如果还没有评论，可以显示提示信息 -->
			<p v-if="comments.length === 0" class="noTitle">暂无评论</p>
			<view v-for="comment in comments" :key="comment.id">
				<div class="comment-item">
					<p class="comment-user">{{comment.userName}}</p>
					<p class="comment-content">{{comment.content}}</p>
				</div>
			</view>
		</view>
		<inputBox @submit="handleSubmit" :scenicId="detail.id" />
	</view>
</template>

<script>
	import swiperImg from "../../components/swiperImg/swiperImg.vue";
	import inputBox from "../../components/inputBox/inputBox.vue";
	export default {
		components: {
			swiperImg,
			inputBox
		},
		data() {
			return {
				detail: {
					id: '',
					name: '',
					capacity: 0,
					startTime: '',
					endTime: '',
					features: [],
					address: '',
					detail: ''
				},
				comments: [],
				swiperImages: []
			};
		},
		onLoad(options) {
			const id = options.id;
			this.fetchDetailData(id);
			this.fetchCommentsData(id);
			this.fetchSwiperImages(id);
		},
		methods: {
			formatTime(timeStr) {
				if (timeStr) {
					const [hour, minute] = timeStr.split(':');
					return `${hour.padStart(2, '0')}:${minute}`;
				}
				return '';
			},
			async fetchDetailData(id) {
				try {
					const {
						data
					} = await uni.request({
						url: '/scenic/getScenicById',
						method: 'POST',
						data: {
							id
						}
					});
					this.detail = data.data;
				} catch (error) {
					console.error('Error fetching detail data:', error);
				}
			},
			async fetchCommentsData(id) {
				try {
					const {
						data
					} = await uni.request({
						url: '/comment/getComment',
						method: 'POST',
						data: {
							id
						}
					});
					this.comments = data.data;
				} catch (error) {
					console.error('Error fetching comments data:', error);
				}
			},
			async fetchSwiperImages(id) {
				try {
					const {
						data
					} = await uni.request({
						url: '/images/getImages',
						method: 'POST',
						data: {
							id: id
						}
					});
					if (data.data !== null) {
						this.swiperImages = data.data;
					}
				} catch (error) {
					console.error('Error fetching swiper images:', error);
				}
			},
			getStatusClass() {
				if (this.detail.state === 0) {
					return 'green-bg-status';
				} else if (this.detail.state === 1) {
					return 'red-bg-status';
				}
				return '';
			},
			handleSubmit(content) {
				// 这里处理提交评论的逻辑
				const newComment = {
					id: Date.now(), // 临时ID
					userName: "游客", // 可以根据实际登录用户信息修改
					content: content,
					createTime: new Date()
				};
				
				this.comments.unshift(newComment); // 将新评论添加到列表开头
				
				// 可以在这里添加与后端的通信逻辑
				uni.showToast({
					title: '评论成功',
					icon: 'success'
				});
			}
		}
	};
</script>

<style>


	.park-detail {
		margin: 15px;
		padding: 20px;
		border-radius: 16px;
		background: #fff;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	}

	.park-name {
		font-size: 24px;
		font-weight: 600;
		color: #333;
		margin-bottom: 15px;
	}

	.park-status-info {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 15px 0;
	}

	.park-status {
		display: flex;
	}

	.status-text {
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 14px;
		font-weight: 500;
	}

	.time-text {
		color: #666;
		font-size: 14px;
	}

	.park-features {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 15px 0;
	}

	.feature-text {
		background: #f0f0f0;
		color: #666;
		padding: 6px 12px;
		border-radius: 8px;
		font-size: 13px;
	}
	.goOrder{
		position: absolute;
		right: 17px;
		margin-top: 2px;
		color: #666;
		font-size: 14px;
		text-decoration: underline;
	}
	.noGoOrder{
		position: absolute;
		right: 15px;
		margin-top: 2px;
		color: #666;
		font-size: 14px;
	}

	.park-address {
		color: #666;
		font-size: 14px;
		margin: 15px 0;
	}

	.detailTe {
		background: #f8f8f8;
		padding: 15px;
		border-radius: 12px;
		margin-top: 15px;
		line-height: 1.6;
	}

	.green-bg {
		background: #4CAF50;
		color: white;
	}

	.red-bg {
		background: #FF5722;
		color: white;
	}

	.comments-section {
		margin: 15px;
		padding: 20px;
		border-radius: 16px;
		background: #2c3e50;
		color: white;
	}

	.comments-title {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 15px;
		padding-left: 10px;
		border-left: 3px solid #4CAF50;
	}

	.comment-item {
		padding: 15px;
		margin-top: 10px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 12px;
	}

	.comment-user {
		font-weight: 600;
		margin-bottom: 8px;
	}

	.comment-content {
		font-size: 14px;
		line-height: 1.5;
		opacity: 0.9;
	}

	.noTitle {
		text-align: center;
		padding: 20px;
		color: rgba(255, 255, 255, 0.7);
	}
</style>