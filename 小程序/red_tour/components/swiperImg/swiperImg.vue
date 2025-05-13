<template>
  <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
    <swiper-item v-for="item in imagesToShow" :key="item">
      <image :src="item" class="swiper-image"></image>
    </swiper-item>
  </swiper>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  props: {
    pathData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const images = [
      'http://localhost:8888/swiper/sw1.png',
      'http://localhost:8888/swiper/sw2.png',
      'http://localhost:8888/swiper/sw3.png',
    ];

    const imagesToShow = computed(() => {
      return props.pathData.length > 0? props.pathData : images;
    });

    return {
      imagesToShow,
    };
  },
};
</script>

<style>
.swiper-image {
  width: 100%;
  height: 100%;

}
</style>