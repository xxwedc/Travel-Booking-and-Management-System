<template>
	<view class="page-container">
		<view class="container">
			<view class="news-header">
				<text class="news-title">{{newsDetail.title}}</text>
				<view class="author-time-info">
					<text class="news-user-id">{{newsDetail.userName || '匿名作者'}}</text>
					<text class="news-time">{{newsDetail.time || '暂无时间'}}</text>
				</view>
			</view>
			<view class="content">
				<template v-for="(paragraph, index) in paragraphs" :key="index">
					<text :class="paragraphStyle(paragraph, index)">
						{{paragraph}}
					</text>
					<image 
						v-if="swiperImages[index]" 
						:src="swiperImages[index]"
						mode="widthFix"
						class="content-image"
						lazy-load
					></image>
					<view 
						v-if="index % 2 === 1 && !swiperImages[index + 1]" 
						class="paragraph-space"
					></view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newsDetail: {},
				swiperImages: [],
				paragraphs: []
			};
		},
		onLoad(options) {
			this.getNewsDetailById(options.id);
		},
		methods: {
			async getNewsDetailById(id) {
				try {
					const newsRes = await uni.request({
						url: '/news/getNewById',
						method: 'POST',
						data: {
							id: id,
						},
					});
					if (newsRes.statusCode === 200) {
						this.newsDetail = newsRes.data.data;
						const imagesRes = await uni.request({
							url: '/images/getImages',
							method: 'POST',
							data: {
								id: id,
							},
						});
						if (imagesRes.statusCode === 200) {
							this.swiperImages = imagesRes.data.data;
							this.splitContent();
						}
					}
				} catch (err) {
					console.error('获取资讯详情出错：', err);
				}
			},
			splitContent() {
				if (this.newsDetail && this.newsDetail.content) {
					const contentArray = this.newsDetail.content.split('。');
					this.paragraphs = contentArray.map(item => item + '。');
				}
			},
			paragraphStyle(paragraph, index) {
				let styleClass = '';
				if (index % 2 === 0) {
					styleClass = 'even-paragraph';
				} else {
					styleClass = 'odd-paragraph';
				}
				return styleClass;
			}
		}
	};
</script>

<style>
	@import "../../styles/newsDetail/newsDetail.css";
</style>