<template>
    <view class="container">
        <view class="header">
            <text class="header-text">请将摄像头对准二维码</text>
        </view>
        <camera class="camera" device-position="back" binderror="onCameraError">
        </camera>
        <canvas canvas-id="qrCanvas" class="hidden-canvas">
        </canvas>
        <view class="footer">
            <text class="footer-text">扫描结果</text>
            <text class="result-text">{{ scanResult || '暂无扫描结果' }}</text>
            <button v-if="showVerifyButton" @tap="verifyOrder" class="verify-button">确认核销</button>
        </view>
    </view>
</template>

<script>
import jsqr from 'jsqr';

export default {
    data() {
        return {
            scanResult: '', // 扫描结果
            captureInterval: null, // 定时器
            showVerifyButton: false, // 是否显示确认核销按钮
            currentOrderId: null, // 当前订单 ID
        };
    },
    methods: {
        startCamera() {
            // 每秒捕获一次画面
            this.captureInterval = setInterval(() => {
                const ctx = uni.createCameraContext(); // 获取 camera 上下文
                ctx.takePhoto({
                    quality: 'low', // 设置照片质量
                    success: (res) => {
                        this.processImage(res.tempImagePath); // 处理拍摄的图片
                    },
                    fail: (err) => {
                        console.error('拍摄失败:', err);
                    },
                });
            }, 1000); // 每秒执行一次
        },
        stopCamera() {
            // 停止定时器
            if (this.captureInterval) {
                clearInterval(this.captureInterval);
                this.captureInterval = null;
            }
        },
        processImage(imagePath) {
            // 将图片绘制到 canvas 上并获取像素数据
            const ctx = uni.createCanvasContext('qrCanvas');
            ctx.drawImage(imagePath, 0, 0, 300, 300); // 根据实际 canvas 尺寸调整
            ctx.draw(false, () => {
                uni.canvasGetImageData({
                    canvasId: 'qrCanvas',
                    x: 0,
                    y: 0,
                    width: 300,
                    height: 300,
                    success: (res) => {
                        this.decodeQRCode(res.data); // 调用解码方法
                    },
                    fail: (err) => {
                        console.error('获取 canvas 数据失败:', err);
                    },
                });
            });
        },
        async decodeQRCode(imageData) {
            try {
                const code = jsqr(new Uint8ClampedArray(imageData), 300, 300); // 使用 jsqr 解码
                if (code && code.data) {
                    // 调用后端接口查询订单信息
                    const response = await uni.request({
                        url: '/api/orders/selectOrderById', // 后端接口地址
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/json', // 设置请求头为 JSON 格式
                        },
                        data: {
                            id: code.data,
                        },
                    });

                    if (response.statusCode === 200 && response.data.status === 200) {
                        this.scanResult = code.data; // 显示扫描结果
                        const result = response.data.data; // 后端返回的订单信息
                        // 提取 content 和 phone
                        const content = "二维码有效";
                        const phone = result.phone || '无手机号';

                        // 显示扫描结果
                        this.scanResult = `${content}\n订单手机: ${phone}`;
                        this.showVerifyButton = true; // 开启核销按钮
                    } else {
                        uni.showToast({
                            icon:"none",
                            title:"无效二维码",
                            duration: 1500
                        })
                        this.scanResult = ""; // 清空扫描结果
                        this.startCamera(); // 开启扫描
                        // throw new Error(response.data.message || '查询失败');
                    }

                    this.stopCamera(); // 停止扫描
                } else {
                    // console.log('未检测到二维码');
                }
            } catch (error) {
                console.log('解码二维码失败:', error);
            }
        },
        async verifyOrder() {
            // 模拟核销二维码操作
            console.log('核销订单:', this.scanResult);
            // 核销完以后可以继续扫描
            this.startCamera(); // 开启扫描
            this.scanResult="";
            this.showVerifyButton = false; // 隐藏核销按钮
        },
        onCameraError(e) {
            console.error('相机错误:', e.detail);
        },
    },
    mounted() {
        this.startCamera(); // 组件挂载时启动摄像头
    },
    beforeDestroy() {
        this.stopCamera(); // 组件销毁时停止摄像头
    },
};
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
    padding: 0;

}

.header {
    width: 100%;
    text-align: center;
    padding: 20rpx 0;

}

.header-text {
    font-size: 40rpx;
    font-weight: bold;
}

.camera {
    width: 90%;
    /* 调整宽度以留出边距 */
    height: 40%;
    /* 缩小高度 */
    margin-top: 20rpx;
    border-radius: 16rpx;
    /* 更大的圆角 */
    overflow: hidden;
    box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.15);
    /* 更柔和的阴影 */
    border: 2rpx solid #ddd;
    /* 添加边框 */
}

.hidden-canvas {
    width: 300px;
    height: 300px;
    position: absolute;
    top: -9999px;
    /* 隐藏 canvas */
}

.footer {
    width: 90%;
    margin-top: 20rpx;
    /* 距离摄像头区域 20px */
    padding: 30rpx;
    background-color: #ffffff;
    /* 白色背景 */
    border-radius: 16rpx;
    /* 圆角 */
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    /* 柔和的阴影 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.footer-text {
    font-size: 30rpx;
    color: #666;
    margin-bottom: 15rpx;
}

.result-text {
    font-size: 34rpx;
    color: #007aff;
    font-weight: bold;
    text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
    text-align: center;
    word-wrap: break-word;
    max-width: 100%;
}

.verify-button {
    margin-top: 20rpx;
    padding: 20rpx 40rpx;
    background-color: #007aff;
    color: #fff;
    font-size: 30rpx;
    border-radius: 10rpx;
    text-align: center;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}
</style>