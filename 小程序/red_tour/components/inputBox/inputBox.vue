<template>
  <view class="input-box">
    <input
      class="input-area"
      v-model="content"
      placeholder="键入您的留言"
      :maxlength="maxLength"
      @input="handleInput"
      type="text"
      confirm-type="send"
      @confirm="handleSubmit"
    />
    <button class="submit-btn" :class="{ 'active': content.trim() }" @tap="handleSubmit">发送</button>
  </view>
</template>

<script>
import {getCurrentDate } from '../../utils/time';
const dateOnly = getCurrentDate();

export default {
  name: 'InputBox',
  props: {
    scenicId: {
      type: [Number, String],
      required: true,
      default: ''
    }
  },
  data() {
    return {
      content: '',
      maxLength: 200,
      time: getCurrentDate()
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.detail.value)
    },
    async handleSubmit() {
        const token = uni.getStorageSync('token')
        if (!token) {
            uni.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return
        }
      const trimmedContent = this.content.trim()
      if (!trimmedContent) {
        uni.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return
      }

      if (!this.scenicId) {
        uni.showToast({
          title: '系统错误，请稍后重试',
          icon: 'none'
        })
        return
      }

      try {
        const response = await uni.request({
          url: '/comment/addComment',
          method: 'POST',
          data: {
            userId: token,
            otherId: this.scenicId,
            content: trimmedContent,
            time: dateOnly
          }
        })
        if (response.data.status === 200) {
          uni.showToast({
            title: '评论成功',
            icon: 'success'
          })
          this.content = ''
          this.$emit('submit', trimmedContent)
        } else {
          uni.showToast({
            title: response.data.msg || '评论失败',
            icon: 'none'
          })
          this.content = ''
          
        }
      } catch (error) {
        console.error('提交评论失败:', error)
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        })
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.input-box {
  width: calc(100% - 20px);
  margin: 0 10px 40rpx;
  height: 72rpx;
  background-color: #F8F8F8;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding: 0 6rpx;
  box-sizing: border-box;
  padding-bottom: 20px;
    
  .input-area {
    flex: 1;
    height: 100%;
    padding: 0 24rpx;
    font-size: 28rpx;
    background: transparent;
    border: none;
    
    &::placeholder {
      color: #BDBDBD;
      font-size: 28rpx;
    }
  }
  
  .submit-btn {
    min-width: 96rpx;
    height: 60rpx;
    line-height: 60rpx;
    background-color: #FFEDED;
    color: #FF5B5B;
    font-size: 28rpx;
    text-align: center;
    border-radius: 30rpx;
    padding: 0;
    margin: 0 6rpx;
    border: none;
    transition: all 0.2s ease;
    
    &.active {
      background-color: #FF5B5B;
      color: #FFFFFF;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
