<template>
  <view class="page-container">
    <view class="status-filter">
      <view v-for="(tab, index) in statusTabs" :key="index"
        :class="['filter-tab', { active: currentStatus === tab.value }]" @tap="switchStatus(tab.value)">
        {{ tab.label }}
      </view>
    </view>

    <view class="appointment-list">
      <view class="loading-state" v-if="isLoading">
        <uni-load-more status="loading" />
      </view>

      <view v-for="item in filteredAppointments" :key="item.id" class="appointment-card">
        <view class="scenic-details">
          <view class="main-info">
            <text class="scenic-name">{{ item.scenicName }}</text>
            <text class="status-text" :class="getStatusClass(item.status)">
              {{ getStatusText(item.status) }}
            </text>
          </view>
          <view class="info-row">
            <text class="label">预约时间：</text>
            <text class="value">{{ formatDateTime(item.orderTime) }}</text>
          </view>
          <view class="info-row">
            <text class="label">联系电话：</text>
            <text class="value">{{ item.phone }}</text>
          </view>
          <view class="info-row">
            <text class="label">预约人：</text>
            <text class="value">{{ getVisitorName(item.content) }}</text>
          </view>
        </view>

        <view class="action-bar">
          <button v-if="canCancel(item.status)" class="action-btn cancel-btn" @tap.stop="handleCancel(item.id)">
            取消预约
          </button>
          <button class="action-btn detail-btn" @tap.stop="viewDetail(item.id)">详情</button>
          <button v-if="item.status === 0" class="action-btn qr-btn" @tap.stop="showQRCode(item.id)">出示二维码</button>
        </view>
      </view>

      <view class="empty-state" v-if="!isLoading && !filteredAppointments.length">
        <text>暂无{{ getStatusText(currentStatus) }}订单</text>
      </view>
    </view>

    <!-- 添加详情弹窗 -->
    <view class="detail-popup" v-if="showDetailPopup">
      <view class="popup-mask" @tap="closeDetail"></view>
      <view class="popup-content">
        <view class="popup-body">
          <view class="detail-item">
            <text class="detail-label">景区名称：</text>
            <text class="detail-value">{{ detailData.scenicName }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">预约时间：</text>
            <text class="detail-value">{{ detailData.orderTime }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">预约人：</text>
            <text class="detail-value">{{ detailData.userName }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">联系电话：</text>
            <text class="detail-value">{{ detailData.phone }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">访客信息：</text>
            <view class="visitors-list">
              <view v-for="(visitor, index) in parsedVisitors" :key="index" class="visitor-item">
                <text>{{ visitor.name }} - {{ visitor.id }}</text>
              </view>
            </view>
          </view>
          <view class="detail-item">
            <text class="detail-label">下单时间：</text>
            <text class="detail-value">{{ detailData.time }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 添加二维码弹窗 -->
    <view class="qr-popup" v-if="showQRPopup">
      <view class="popup-mask" @tap="closeQRCode"></view>
      <view class="popup-content">
        <view class="popup-body">
          <view class="qr-container">
            <image :src="qrCodeUrl" mode="widthFix" class="qr-image" />
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
      appointments: [],
      isLoading: false,
      currentStatus: 0,
      statusTabs: [
        { label: '待出行', value: 0 },
        { label: '已完成', value: 1 },
        { label: '全部', value: -1 },
      ],
      statusMap: {
        0: { text: '待出行', class: 'status-pending' },
        1: { text: '已完成', class: 'status-confirmed' },
      },
      showDetailPopup: false,
      showQRPopup: false, // 初始化二维码弹窗状态
      detailData: {},
      qrCodeUrl: '', // 用于存储后端返回的二维码图片链接
    };
  },

  computed: {
    filteredAppointments() {
      let result = this.appointments;

      if (this.currentStatus !== -1) {
        result = result.filter(item => item.status === this.currentStatus);
      }

      return result.sort((a, b) => {
        try {
          // 解析日期时间为 iOS 支持的格式
          const parseDateTime = (timeStr) => {
            const [datePart, timePart] = timeStr.split(' - ');
            const [date, time] = datePart.split(' ');
            const [year, month, day] = date.split('-');
            return new Date(`${year}-${month}-${day}T${time}:00`); // 使用 ISO 格式
          };

          if (a.status === 0 && b.status === 0) {
            return parseDateTime(a.orderTime) - parseDateTime(b.orderTime);
          } else if (a.status === 1 && b.status === 1) {
            const parseTime = (timeStr) => {
              const [date, time] = timeStr.split(' ');
              const [year, month, day] = date.split('-');
              return new Date(`${year}-${month}-${day}T${time}`); // 使用 ISO 格式
            };
            return parseTime(b.time) - parseTime(a.time);
          } else {
            return a.status - b.status;
          }
        } catch (error) {
          return 0;
        }
      });
    },
    parsedVisitors() {
      try {
        return JSON.parse(this.detailData.content || '[]');
      } catch (error) {
        return [];
      }
    }
  },

  onShow() {
    this.loadAppointments();
  },

  onPullDownRefresh() {
    this.loadAppointments().finally(() => {
      uni.stopPullDownRefresh();
    });
  },

  methods: {
    // 处理预约数据
    processAppointments(data) {
      if (!Array.isArray(data)) return [];
      return data.map(item => {
        try {
          // 解析预约时间
          const [datePart, timePart] = item.orderTime.split(' - ');
          const [date, time] = datePart.split(' ');
          const [year, month, day] = date.split('-');

          // 使用 ISO 格式创建日期对象
          const currentTime = new Date();
          const orderEndDateTime = new Date(`${year}-${month}-${day}T${timePart}:00`);
          

          // 根据时间判断状态
          const status = currentTime > orderEndDateTime ? 1 : 0;

          return {
            id: item.id,
            scenicName: item.scenicName,
            orderTime: item.orderTime,
            phone: item.phone,
            content: item.content,
            status: status,
            time: item.time,
            userName: item.userName
          };
        } catch (error) {
          console.error('处理预约数据错误:', error);
          // 使用当前时间和默认的预约结束时间来判断状态
          const currentTime = new Date();
          const defaultOrderEndDateTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 默认加一天
          const status = currentTime > defaultOrderEndDateTime ? 1 : 0;
          return {
            id: item.id,
            scenicName: item.scenicName,
            orderTime: item.orderTime,
            phone: item.phone,
            content: item.content,
            status: status,
            time: item.time,
            userName: item.userName
          };
        }
      });
    },

    // 获取访客姓名
    getVisitorName(contentStr) {
      try {
        if (!contentStr) return '未知访客';
        const contentArray = JSON.parse(contentStr);
        if (Array.isArray(contentArray) && contentArray.length > 0) {
          return contentArray[0].name || '未知访客';
        }
        return '未知访客';
      } catch (error) {
        console.error('解析访客信息错误:', error);
        return '未知访客';
      }
    },

    // 请求预约数据
    async requestAppointments(token) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: '/api/orders/selectMyOrder',
          method: 'POST',
          data: { token },
          success: (res) => {
            if (res.data.status === 200) {
              resolve(res.data);
            } else {
              resolve(res.data);
            }
          },
          fail: reject
        });
      });
    },

    // 加载预约数据
    async loadAppointments() {
      if (this.isLoading) return;

      this.isLoading = true;
      try {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.showToast({ title: '请先登录', icon: 'none' });
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/login' });
          }, 1500);
          return;
        }

        const res = await this.requestAppointments(token);
        this.appointments = this.processAppointments(res.data);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },

    // 获取状态样式
    getStatusClass(status) {
      return this.statusMap[status]?.class || '';
    },

    // 获取状态文本
    getStatusText(status) {
      return this.statusMap[status]?.text || '未知状态';
    },

    // 检查是否可取消
    canCancel(status) {
      return status === 0; // 只有待出行状态可以取消
    },

    // 处理取消预约
    async handleCancel(id) {
      try {
        const confirmed = await this.showCancelConfirm();
        if (!confirmed) return;

        await this.cancelAppointment(id);
        this.loadAppointments();
      } catch (error) {
        this.handleError(error);
      }
    },

    // 显示取消确认框
    showCancelConfirm() {
      return new Promise((resolve) => {
        uni.showModal({
          title: '提示',
          content: '确定要取消预约吗？',
          success: (res) => resolve(res.confirm)
        });
      });
    },

    // 取消预约请求
    async cancelAppointment(id) {
      const res = await uni.request({
        url: '/order/deleteOrderById',
        method: 'POST',
        data: { id }
      });

      if (res.statusCode !== 200 || res.data.status !== 200) {
        throw new Error(res.data.message || '取消预约失败');
      }

      uni.showToast({ title: '取消成功', icon: 'success' });
    },

    // 查看详情
    async viewDetail(id) {
      try {
        // 从当前列表中查找对应的预约数据
        const appointment = this.appointments.find(item => item.id === id);
        if (appointment) {
          this.detailData = appointment;
          this.showDetailPopup = true;
        } else {
          throw new Error('未找到预约详情');
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    // 关闭详情弹窗
    closeDetail() {
      this.showDetailPopup = false;
      this.detailData = {};
    },

    // 弹出二维码窗口
    async showQRCode(id) {
      try {
        // 调用后端接口生成二维码
        const response = await uni.request({
          url: '/api/orders/makeQRCode', // 后端接口地址
          method: 'POST',
          header: {
            'Content-Type': 'application/json', // 设置请求头为 JSON 格式
          },
          data: {
            id:id
          },
        });
        if (response.statusCode === 200 && response.data.status === 200) {
          // 获取后端返回的二维码图片链接
          this.qrCodeUrl = response.data.data; // 假设后端返回的图片链接在 data 字段中
          this.showQRPopup = true; // 显示二维码弹窗
        } else {
          throw new Error(response.data.message || '生成二维码失败');
        }
      } catch (error) {
        console.log("错误",error);
        this.handleError(error);
      }
    },

    // 关闭二维码弹窗
    closeQRCode() {
      this.showQRPopup = false;
      this.qrCodeUrl = ''; // 清空二维码内容
    },

    // 统一错误处理
    handleError(error) {
      console.error('操作失败：', error);
      uni.showToast({
        title: error.message || '操作失败',
        icon: 'none'
      });
    },

    // 格式化时间显示
    formatDateTime(dateStr) {
      try {
        return dateStr; // 直接返回原格式，不进行转换
      } catch (error) {
        return dateStr;
      }
    },

    // 添加切换状态方法
    async switchStatus(status) {
      if (this.currentStatus === status) return;
      this.currentStatus = status;

      this.isLoading = true;
      await this.$nextTick();
      this.isLoading = false;
    },

  }
};
</script>

<style>
@import '../../styles/myOrder/myOrder.css';
</style>