<template>
	<view class="map-container">
		<map id="myMap" :latitude="centerLatitude" :longitude="centerLongitude" :scale="15" @tap="onMapTap"
			class="map"></map>
		<view class="map-content" v-if="clickedScenic || isInitialLoad" @click="goDetail">
			<view class="name-container">
				<view class="redLine"></view>
				<text class="addressName">{{currentScenicName}}</text>
			</view>
			<text class="addressText">{{currentScenicAddress}}</text>
			<view class="ngtDetail">
				<text class="time-info" v-if="currentScenicStartTime && currentScenicEndTime">
					{{formatTime(currentScenicStartTime)}} - {{formatTime(currentScenicEndTime)}}
				</text>
				<text class="time-info" v-else>暂无营业时间信息</text>
				<text class="cheText">查看详情</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scenicData: [],
				centerLatitude: 0,
				centerLongitude: 0,
				clickedScenic: null,
				isInitialLoad: true,
				defaultScenic: null,
				currentScenicName: '',
				currentScenicAddress: '',
				currentScenicStartTime: '',
				currentScenicEndTime: '',
			};
		},
		onLoad() {
			// 发起 GET 请求获取数据
			uni.request({
				url: '/scenic/getAllScenic',
				method: 'GET',
				success: (res) => {
					if (res.statusCode === 200) {
						this.scenicData = res.data.data;
						// 计算中心经纬度（这里简单取第一个景点的经纬度作为中心）
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
				},
			});
		},
		onReady() {
			const mapContext = wx.createMapContext('myMap');
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
							color: '#000',
							fontSize: 12,
							borderRadius: 5,
							bgColor: '#fff',
							padding: 5,
							display: 'ALWAYS',
						},
					}, ],
					success: () => {
						console.log('标记点添加成功');
					},
					fail: (err) => {
						console.error(err);
					},
				});
			});
		},
		methods: {
			goDetail() {
				if (this.clickedScenic || this.defaultScenic) {
					const scenicId = this.clickedScenic ? this.clickedScenic.id : this.defaultScenic.id;
					// 携带当前内容框显示的景点信息的 id 跳转详情界面
					uni.navigateTo({
						url: `/pages/detail/detail?id=${scenicId}`
					}).catch(err => {
						console.error('页面跳转出错：', err);
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
					const distance = this.calculateDistance(latitude, longitude, scenic.latitude, scenic
						.longitude);
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
				const dLat = ((lat2 - lat1) * Math.PI) / 180;
				const dLon = ((lon2 - lon1) * Math.PI) / 180;
				const a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos((lat1 * Math.PI) / 180) *
					Math.cos((lat2 * Math.PI) / 180) *
					Math.sin(dLon / 2) *
					Math.sin(dLon / 2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				return R * c;
			},
			formatTime(timeStr) {
				if (!timeStr) return '';
				return timeStr.slice(0, 5);
			},
			updateCurrentScenicInfo() {
				if (this.clickedScenic) {
					this.currentScenicName = this.clickedScenic.name;
					this.currentScenicAddress = this.clickedScenic.address || '暂无地址信息';
					this.currentScenicStartTime = this.clickedScenic.startTime ?
						this.formatTime(this.clickedScenic.startTime) :
						'';
					this.currentScenicEndTime = this.clickedScenic.endTime ?
						this.formatTime(this.clickedScenic.endTime) :
						'';
				} else if (this.defaultScenic) {
					this.currentScenicName = this.defaultScenic.name;
					this.currentScenicAddress = this.defaultScenic.address || '暂无地址信息';
					this.currentScenicStartTime = this.defaultScenic.startTime ?
						this.formatTime(this.defaultScenic.startTime) :
						'';
					this.currentScenicEndTime = this.defaultScenic.endTime ?
						this.formatTime(this.defaultScenic.endTime) :
						'';
				} else {
					this.currentScenicName = '';
					this.currentScenicAddress = '';
					this.currentScenicStartTime = '';
					this.currentScenicEndTime = '';
				}
			},
		},
	};
</script>

<style>
	.map {
		width: 100vw;
		height: 100vh;
	}

	.map-content {
		position: absolute;
		bottom: 40rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 86%;
		padding: 30rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	.map-content:active {
		transform: translateX(-50%) scale(0.98);
	}

	/* 景点名称容器 */
	.name-container {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.redLine {
		width: 6rpx;
		height: 36rpx;
		background: linear-gradient(to bottom, #ff4d4f, #ff7875);
		margin-right: 16rpx;
		border-radius: 6rpx;
	}

	.addressName {
		font-size: 36rpx;
		font-weight: 600;
		color: #1a1a1a;
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.addressText {
		font-size: 28rpx;
		color: #666;
		margin: 16rpx 0;
		padding-left: 22rpx;
		display: flex;
		align-items: center;
	}

	/* 添加地址图标 */

	.ngtDetail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		padding: 16rpx 22rpx;
		background: #f8fafc;
		border-radius: 12rpx;
	}

	/* 时间信息样式 */
	.time-info {
		font-size: 28rpx;
		color: #666;
		display: flex;
		align-items: center;
	}



	.cheText {
		font-size: 26rpx;
		color: #3b82f6;
		padding: 8rpx 24rpx;
		background: rgba(59, 130, 246, 0.1);
		border-radius: 100rpx;
		transition: all 0.3s ease;
	}

	.cheText:active {
		background: rgba(59, 130, 246, 0.2);
	}
</style>