<template>
  <view class="rank-page">
    <view class="rank-section">
      <text class="rank-title">景区排行榜</text>
      
      <!-- 今年热门榜单 -->
      <view class="sub-rank-section" v-if="monthlyRank.length > 0">
        <view class="rank-header">
          <view class="rank-header-left">
            <uni-icons type="star-filled" size="24" color="#ffd700"></uni-icons>
            <text class="sub-rank-title">今年热门</text>
          </view>
          <view class="update-time">
            <uni-icons type="refresh" size="14" color="#ffffff"></uni-icons>
            <text>实时更新</text>
          </view>
        </view>
        
        <view class="rank-content">
          <view class="spot-list">
            <view class="spot-item" v-for="(spot, sIndex) in monthlyRank" :key="sIndex">
              <text class="spot-index" :class="{ 'top3': sIndex < 3 }">{{sIndex + 1}}</text>
              <view class="spot-info" @tap="goToSpotDetail(spot.scenicId)">
                <text class="spot-name">{{spot.scenicName}}</text>
                <text class="spot-score">{{spot.count}} 热度</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 本月热门榜单 -->
      <view class="sub-rank-section" v-if="weeklyRank.length > 0">
        <view class="rank-header">
          <view class="rank-header-left">
            <uni-icons type="fire-filled" size="24" color="#ff6b6b"></uni-icons>
            <text class="sub-rank-title">本月热门</text>
          </view>
          <view class="update-time">
            <uni-icons type="refresh" size="14" color="#ffffff"></uni-icons>
            <text>每月更新</text>
          </view>
        </view>
        
        <view class="rank-content">
          <view class="spot-list">
            <view class="spot-item" v-for="(spot, sIndex) in weeklyRank" :key="sIndex">
              <text class="spot-index" :class="{ 'top3': sIndex < 3 }">{{sIndex + 1}}</text>
              <view class="spot-info" @tap="goToSpotDetail(spot.scenicId)">
                <text class="spot-name">{{spot.scenicName}}</text>
                <text class="spot-score">{{spot.count}} 热度</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      monthlyRank: [],
      weeklyRank: [],
    };
  },
  methods: {
    async getMonthlyRanks() {
      try {
        const res = await uni.request({
          url: '/order/getRankingYear', // 替换为今年热门的后端接口地址
          method: 'GET'
        });
        this.monthlyRank = res.data.data;
      } catch (error) {
        console.error('Error fetching monthly ranks:', error);
      }
    },
    async getWeeklyRanks() {
      try {
        const res = await uni.request({
          url: '/order/getRankingMonth', // 替换为本月热门的后端接口地址
          method: 'GET'
        });
        this.weeklyRank = res.data.data;
      } catch (error) {
        console.error('Error fetching weekly ranks:', error);
      }
    },
    
    goToSpotDetail(scenicId) {
      if (!scenicId) return;
      uni.navigateTo({
        url: "/pages/detail/detail?id="+scenicId
      });
    },
  },
  onLoad() {
    this.getMonthlyRanks();
    this.getWeeklyRanks();
  }
};
</script>

<style>
.rank-page {
  background-color: #fafafa;
  min-height: 100vh;
  padding: 20rpx;
}

.rank-section {
  background: linear-gradient(to bottom right, #fff, #f8f9fa);
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.1);
}

.sub-rank-section {
  background: #ffffff;
  border-radius: 18rpx;
  padding: 28rpx;
  margin-bottom: 35rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  position: relative;
}

.sub-rank-section:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: -20rpx;
  left: 5%;
  width: 90%;
  height: 2rpx;
  background: linear-gradient(to right, 
    transparent, 
    rgba(0, 0, 0, 0.1) 20%, 
    rgba(0, 0, 0, 0.1) 80%, 
    transparent
  );
}

.rank-content {
  padding: 10rpx 0;
}

.spot-list {
  flex: 1;
}

.spot-item {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  margin: 8rpx 0;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  background: #ffffff;
}

.spot-item:active {
  background: #f8f9fa;
  transform: translateX(6rpx);
}

.spot-index {
  width: 56rpx;
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  border-radius: 50%;
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 24rpx;
  background: #f5f7fa;
  color: #666;
}

.spot-item:nth-child(1) .spot-index {
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(255, 170, 0, 0.3);
}

.spot-item:nth-child(2) .spot-index {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(160, 160, 160, 0.3);
}

.spot-item:nth-child(3) .spot-index {
  background: linear-gradient(135deg, #cd7f32, #c06014);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(192, 96, 20, 0.3);
}

.spot-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6rpx 0;
}

.spot-name {
  font-size: 30rpx;
  color: #2c3e50;
  font-weight: 500;
  flex: 1;
  margin-right: 20rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spot-score {
  font-size: 26rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  font-weight: 600;
}

.rank-header {
  margin-bottom: 28rpx;
  padding-bottom: 18rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.sub-rank-title {
  font-size: 40rpx;
  font-weight: 600;
  position: relative;
  padding-left: 25rpx;
}

.sub-rank-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8rpx;
  height: 36rpx;
  background: linear-gradient(to bottom, #ff6b6b, #ff9f43);
  border-radius: 4rpx;
}

.update-time {
  font-size: 28rpx;
  color: #999;
  background: #f8f9fa;
  padding: 6rpx 18rpx;
  border-radius: 22rpx;
}
</style>