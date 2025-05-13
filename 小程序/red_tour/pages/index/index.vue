<template>
  <view class="page-container">
    <swiperImg></swiperImg>
    
    <!-- 导航栏 -->
    <view class="nav-container">
      <view 
        class="nav-button" 
        :class="{ 'nav-button-active': item.active }"
        v-for="(item, index) in buttonList" 
        :key="index"
        @click="navigateToPage(item.title)"
      >
        <image :src="item.img" class="nav-icon"></image>
        <text class="nav-text">{{item.title}}</text>
      </view>
    </view>

    <!-- 红色资讯 -->
    <view class="info-header">
      <view class="info-title-line"></view>
      <text class="info-title">红色资讯</text>
    </view>
    
    <view class="info-container">
      <view 
        class="info-item"
        :class="{ 'info-item-active': item.active }"
        v-for="(item, index) in redInfoList"
        :key="index"
        @click="navigateToInfoPage(item.id)"
      >
        <image :src="item.img" class="info-image"></image>
        <text class="info-text">{{item.title}}</text>
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
      buttonList: [
        {
          img: "http://localhost:8888/icon/map11.png",
          title: "红色地图",
        },
        {
          img: "http://localhost:8888/icon/yuyue4.png",
          title: "景点预约",
        },
        {
          img: "http://localhost:8888/icon/ranking.png",
          title: "热门排行",
        },
        {
          img: "http://localhost:8888/icon/allScenic.png",
          title: "全部景点",
        },
      ],
      redInfoList: [],
    };
  },
  onLoad() {
    this.fetchRedInfo();
  },
  methods: {
    navigateToPage(pageName) {
      switch (pageName) {
        case "红色地图":
          uni.reLaunch({
            url: "../map/map",
          });
          break;
        case "景点预约":
          uni.navigateTo({
            url: "../order/order",
          });
          break;
        case "热门排行":
          uni.navigateTo({
            url: "/pages/ranking/ranking",
          });
          break;
        case "全部景点":
          uni.navigateTo({
            url: "/pages/allScenic/allScenic",
          });
          break;
      }
    },
    async fetchRedInfo() {
      try {
        const res = await uni.request({
          url: "/news/getNews",
        });
        if (res.statusCode === 200) {
          this.redInfoList = res.data.data;
        } else {
          console.error("获取红色资讯数据失败");
        }
      } catch (err) {
        console.error("获取红色资讯数据时发生错误：", err);
      }
    },
    navigateToInfoPage(id) {
      uni.navigateTo({
        url: '/pages/newsDetail/newsDetail?id='+id,
      });
    },
  },
};
</script>

<style>
@import "../../styles/index/index.css";
</style>