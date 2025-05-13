<template>
  <swiperImg></swiperImg>
  
  <view class="container">
    <view class="park-item" v-for="park in parks" :key="park.id" @click="navigateToDetail(park.id)">
      <image :src="park.img" class="park-image" mode="aspectFill"></image>
      <view class="park-info">
        <text class="park-name">{{park.name}}</text>
        <view class="park-status-time">
			<text class="park-address">{{park.address}}</text>
          <text class="park-time">{{formatTime(park.startTime)}}-{{formatTime(park.endTime)}}</text>
        </view>
        <view class="park-features">
          <text v-for="(feature, i) in getReservationStatus(park)" :key="i" :class="getFeatureClass(feature)">{{feature}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import swiperImg from "../../components/swiperImg/swiperImg.vue";
export default {
  components: {
    swiperImg
  },
  data() {
    return {
      parks: []
    };
  },
  created() {
    this.fetchParksData();
  },
  methods: {
	  formatTime(timeStr) {
	  	if (timeStr) {
	  		const [hour, minute] = timeStr.split(':');
	  		return `${hour.padStart(2, '0')}:${minute}`;
	  	}
	  	return '';
	  },
    getFeatureClass(feature) {
      if (feature === '需要预约') {
        return 'yellow-feature';
      } else {
        return 'green-feature';
      }
    },
    async fetchParksData() {
      try {
        const { data } = await uni.request({
          url: '/scenic/getAllScenic'
        });
        this.parks = data.data;
      } catch (error) {
        console.error('Error fetching parks data:', error);
      }
    },
    getReservationStatus(park) {
      if (park.capacity === 0) {
        return ['无需预约'];
      } else if (park.capacity === 1) {
        return ['需要预约'];
      } else {
        return [];
      }
    },
    formatTime(timeStr) {
      if (timeStr) {
        return timeStr.slice(0, 5);
      }
      return '';
    },
    navigateToDetail(id) {
      uni.navigateTo({
              url: '/pages/detail/detail?id='+id
          }).catch(err => {
              console.error('页面跳转出错：', err);
          });
    }
  }
};
</script>

<style>
	@import "../../styles/my/allScenic.css";
</style>