<template>
	<view class="about-container">
		<view class="header">
			<image class="logo" src="http://localhost:8888/pic/mlzc.png" mode="aspectFit"></image>
			<text class="subtitle">智慧高效的旅游基地服务平台</text>
		</view>
		
		<view class="content">
			<view class="info-section">
				<text class="section-title">视频介绍</text>
				<view class="video-container">
					<video 
						src="http://localhost:8888/video/zcrs.mp4"
						controls
						autoplay
						loop
						:muted="isMuted"
						class="intro-video"
						object-fit="cover"
						enable-progress-gesture
					></video>
					<view class="volume-control" @tap="toggleMute">
						<text class="volume-text">{{ isMuted ? '开启声音' : '关闭声音' }}</text>
					</view>
				</view>
			</view>
			
			<view class="info-section">
				<text class="section-title">平台简介</text>
				<text class="text">本平台是广东省政府采购业务协同平台，是广东省政府采购领域数字化改革标志性成果。平台以"出行更简单"为使命，致力于打造"阳光、规范、高效、便民"的旅游环境，实现政府旅游业务"一网通办"。</text>
			</view>
			
			<view class="info-section">
				<text class="section-title">主要功能</text>
				<view class="feature-list">
					<view class="feature-item">
						<text class="feature-dot">•</text>
						<text class="text">增城区景点介绍</text>
					</view>
					<view class="feature-item">
						<text class="feature-dot">•</text>
						<text class="text">热门景点预约</text>
					</view>
					<view class="feature-item">
						<text class="feature-dot">•</text>
						<text class="text">政府资讯公告发布</text>
					</view>
					<view class="feature-item">
						<text class="feature-dot">•</text>
						<text class="text">业务在线办理</text>
					</view>
					<view class="feature-item">
						<text class="feature-dot">•</text>
						<text class="text">旅游基地信息发布</text>
					</view>
				</view>
			</view>
			
			<view class="info-section">
				<text class="section-title">联系方</text>
				<view class="contact-list">
					<view class="contact-item">
						<text class="label">服务热线：</text>
						<text class="text">400-881-7190</text>
					</view>
					<view class="contact-item">
						<text class="label">工作时间：</text>
						<text class="text">工作日 8:30-12:00 13:30-17:30</text>
					</view>
					<view class="contact-item">
						<text class="label">业务咨询：</text>
						<text class="text">0571-56267190</text>
					</view>
					<view class="contact-item">
						<text class="label">单位地址：</text>
						<text class="text">广东省广州市增城区荔新街道华商路1号</text>
					</view>
				</view>
			</view>
			
			<view class="info-section">
				<text class="section-title">主办单位</text>
				<text class="text">广东省财政厅</text>
				<text class="text">广东省增城区文旅中心</text>
			</view>
		</view>
		
		<view class="footer">
			<text class="copyright">版权所有 © 2024 广东省增城区文旅中心</text>
			<text class="icp">粤ICP备15044015号-1</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isMuted: true, // 默认静音
			}
		},
		methods: {
			toggleMute() {
				this.isMuted = !this.isMuted;
			}
		}
	}
</script>

<style>
.about-container {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: 100vh;
}

.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 30px;
	padding: 30px 0;
	background: linear-gradient(to bottom, rgba(208, 33, 41, 0.05), transparent);
}

.logo {
	width: 300px;
	height: 90px;
	margin-bottom: 25px;
	object-fit: contain;
}

.subtitle {
	font-size: 16px;
	color: #666;
	margin-top: 0;
}

.content {
	background-color: #fff;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-section {
	margin-bottom: 25px;
	padding-bottom: 20px;
	border-bottom: 1px solid #eee;
}

.info-section:last-child {
	border-bottom: none;
	margin-bottom: 0;
	padding-bottom: 0;
}

.section-title {
	font-size: 18px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
	display: block;
	position: relative;
	padding-left: 12px;
}

.section-title::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 4px;
	height: 16px;
	background-color: #d02129;
	border-radius: 2px;
}

.text {
	font-size: 14px;
	color: #666;
	line-height: 1.8;
	display: block;
}

.feature-list {
	padding-left: 10px;
}

.feature-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 10px;
}

.feature-dot {
	color: #d02129;
	margin-right: 8px;
	font-weight: bold;
}

.contact-list {
	padding: 0 10px;
}

.contact-item {
	display: flex;
	margin-bottom: 10px;
}

.label {
	color: #333;
	font-weight: 500;
	min-width: 90px;
}

.footer {
	text-align: center;
	padding: 20px 0;
	margin-top: 30px;
}

.copyright, .icp {
	font-size: 12px;
	color: #999;
}

.icp {
	margin-top: 5px;
	display: block;
}

.video-container {
	position: relative;
	width: 100%;
	border-radius: 8px;
	overflow: hidden;
	background-color: #000;
	margin: 10px 0;
}

.intro-video {
	width: 100%;
	height: 200px;
}

.volume-control {
	position: absolute;
	right: 10px;
	top: 10px;
	background: rgba(0, 0, 0, 0.5);
	padding: 5px 10px;
	border-radius: 15px;
	z-index: 1;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 64px;
	height: 24px;
}

.volume-control:hover {
	background: rgba(0, 0, 0, 0.7);
}

.volume-text {
	color: #fff;
	font-size: 12px;
	line-height: 1;
}
</style>
