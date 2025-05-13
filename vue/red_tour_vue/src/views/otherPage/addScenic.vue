<template>
    <div class="update-scenic-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="title-wrapper">
          <h2>新增景点</h2>
          <div class="title-decoration"></div>
        </div>
      </div>
  
      <!-- 主表单卡片 -->
      <el-card class="form-card">
        <el-form :model="formData" label-width="120px" class="scenic-form" :rules="rules" ref="formRef">
          <!-- 基本信息部分 -->
          <div class="form-section">
            <div class="section-header">
              <el-icon><Document /></el-icon>
              <span>基本信息</span>
            </div>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="景点名称" prop="name">
                  <el-input v-model="formData.name" placeholder="请输入景点名称">
                    <template #prefix>
                      <el-icon><Location /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="景点类型" prop="type">
                  <div class="type-selector">
                    <div 
                      class="type-option" 
                      :class="{ active: formData.type === 'open' }"
                      @click="handleTypeChange('open')"
                    >
                      <div class="type-icon">
                        <el-icon><Unlock /></el-icon>
                      </div>
                      <div class="type-info">
                        <span class="type-name">开放景点</span>
                        <span class="type-desc">无需预约，随时可游</span>
                      </div>
                    </div>
                    <div 
                      class="type-option" 
                      :class="{ active: formData.type === 'reservation' }"
                      @click="handleTypeChange('reservation')"
                    >
                      <div class="type-icon">
                        <el-icon><Lock /></el-icon>
                      </div>
                      <div class="type-info">
                        <span class="type-name">预约景点</span>
                        <span class="type-desc">需提前预约游玩</span>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item 
                  label="可同时容纳" 
                  prop="capacity"
                  v-if="formData.type === 'reservation'"
                >
                  <el-input-number 
                    v-model="formData.capacity" 
                    :min="200" 
                    placeholder="请输入容纳人数"
                    class="custom-input-number"
                    :controls="false"
                  >
                    <template #prefix>
                      <el-icon><User /></el-icon>
                    </template>
                  </el-input-number>
                  <span class="capacity-unit">人/天</span>
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-form-item label="景点开放时间" required>
              <div class="time-picker-group">
                <el-time-picker
                  v-model="formData.start_time"
                  placeholder="开始时间"
                  format="HH:mm"
                  :disabled="formData.type === 'open'"
                >
                  <template #prefix>
                    <el-icon><Clock /></el-icon>
                  </template>
                </el-time-picker>
                <span class="time-separator">至</span>
                <el-time-picker
                  v-model="formData.end_time"
                  placeholder="结束时间"
                  format="HH:mm"
                  :disabled="formData.type === 'open'"
                >
                  <template #prefix>
                    <el-icon><Clock /></el-icon>
                  </template>
                </el-time-picker>
              </div>
              <div class="time-tip" v-if="formData.type === 'open'">
                <el-icon><InfoFilled /></el-icon>
                <span>开放景点默认24小时开放</span>
              </div>
            </el-form-item>
  
            <el-form-item label="详细信息" prop="detail">
              <el-input
                v-model="formData.detail"
                type="textarea"
                rows="4"
                placeholder="请输入景点详细信息"
                resize="none"
                maxlength="500"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
  
          <!-- 图片信息部分 -->
          <div class="form-section">
            <div class="section-header">
              <el-icon><Picture /></el-icon>
              <span>图片信息</span>
            </div>
            
            <div class="image-section">
              <!-- 封面图片部分 -->
              <div class="cover-section">
                <div class="section-title">封面图片</div>
                <div class="cover-container">
                  <div class="current-image">
                    <div class="image-box">
                      <div class="empty-image">
                        <el-icon><Picture /></el-icon>
                        <span>暂无图片</span>
                      </div>
                    </div>
                    <div class="image-label">当前图片</div>
                  </div>
  
                  <div class="arrow-divider">
                    <div class="arrow-line"></div>
                    <el-icon class="arrow-icon"><Right /></el-icon>
                    <div class="arrow-line"></div>
                  </div>
  
                  <div class="upload-image">
                    <div class="image-box">
                      <el-upload
                        class="cover-uploader"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-change="handleCoverChange"
                        :auto-upload="false"
                        accept="image/jpeg,image/png"
                      >
                        <div class="upload-area" v-if="!tempCoverUrl" style="position: absolute; inset: 0;">
                          <div class="upload-content">
                            <el-icon class="upload-icon"><Plus /></el-icon>
                            <span class="upload-text">点击上传</span>
                          </div>
                        </div>
                        <div v-else class="preview-container">
                          <img :src="tempCoverUrl" class="preview-image" />
                          <div class="upload-status success">
                            <el-icon><Check /></el-icon>
                          </div>
                          <div class="preview-overlay">
                            <el-icon class="delete-btn" @click.stop="handleCoverRemove">
                              <Delete />
                            </el-icon>
                          </div>
                        </div>
                      </el-upload>
                    </div>
                    <div class="image-label">替换图片</div>
                  </div>
                </div>
                <div class="upload-tips">
                  <div class="tip-item">
                    <el-icon><InfoFilled /></el-icon>
                    <span>建议尺寸 800x600px</span>
                  </div>
                  <div class="tip-item">
                    <el-icon><InfoFilled /></el-icon>
                    <span>支持 JPG/PNG 格式，大小不超 2MB</span>
                  </div>
                </div>
              </div>
  
              <div class="section-divider"></div>
  
              <!-- 景点相册部分 -->
              <div class="album-section">
                <div class="section-title">景点相册</div>
                <div class="album-container">
                  <div class="album-grid">
                    <div v-for="item in albumList" :key="item.uid" class="album-item">
                      <img :src="item.url" class="album-image" />
                      <div class="upload-status" :class="item.status">
                        <el-icon v-if="item.status === 'uploading'" class="uploading-spinner">
                          <Loading />
                        </el-icon>
                        <el-icon v-else-if="item.status === 'success'">
                          <Check />
                        </el-icon>
                      </div>
                      <div class="album-overlay">
                        <el-icon class="delete-btn" @click="handleAlbumRemove(item)">
                          <Delete />
                        </el-icon>
                      </div>
                    </div>
                    
                    <div v-if="albumList.length < 3" class="album-upload">
                      <el-upload
                        class="album-uploader"
                        :show-file-list="false"
                        :before-upload="beforeAlbumUpload"
                        :on-change="handleAlbumChange"
                        :auto-upload="false"
                        accept="image/jpeg,image/png"
                      >
                        <div class="album-upload-area">
                          <div class="upload-content">
                            <el-icon class="upload-icon"><Plus /></el-icon>
                            <span class="upload-text">点击上传</span>
                          </div>
                        </div>
                      </el-upload>
                    </div>
                  </div>
                </div>
                <div class="upload-tips">
                  <div class="tip-item">
                    <el-icon><InfoFilled /></el-icon>
                    <span>最多上传 3 张图片</span>
                  </div>
                  <div class="tip-item">
                    <el-icon><InfoFilled /></el-icon>
                    <span>支持 JPG/PNG 格式，大小不超过 2MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 位置信息部分 -->
          <div class="form-section">
            <div class="section-header">
              <el-icon><MapLocation /></el-icon>
              <span>位置信息</span>
            </div>
            <el-form-item label="位置选择" prop="address" required>
              <div class="map-section">
                <div class="map-container">
                  <div id="map-wrapper" class="map-wrapper"></div>
                  <div class="map-search-overlay">
                    <div class="search-container">
                      <el-input
                        v-model="searchValue"
                        placeholder="搜索地址..."
                        class="map-search-input"
                        clearable
                      >
                        <template #prefix>
                          <el-icon><Search /></el-icon>
                        </template>
                        <template #append>
                          <el-button @click="handleSearch" type="primary">
                            <el-icon><Search /></el-icon>搜索
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="map-tip-overlay">
                    <div class="map-tip-content">
                      <el-icon><InfoFilled /></el-icon>
                      <span>点击地图或拖动标记选择位置</span>
                    </div>
                  </div>
                </div>
  
                <div class="location-info">
                  <div class="info-card">
                    <div class="info-header">
                      <el-icon><Location /></el-icon>
                      <span>位置信息</span>
                    </div>
                    <div class="coordinates-display">
                      <div class="coordinate-item">
                        <div class="coordinate-label">
                          <el-icon><Location /></el-icon>
                          <span>经度</span>
                        </div>
                        <el-input v-model="tempLocation.longitude" readonly></el-input>
                      </div>
                      <div class="coordinate-item">
                        <div class="coordinate-label">
                          <el-icon><Location /></el-icon>
                          <span>纬度</span>
                        </div>
                        <el-input v-model="tempLocation.latitude" readonly></el-input>
                      </div>
                      <div class="coordinate-item">
                        <div class="coordinate-label">
                          <el-icon><House /></el-icon>
                          <span>详细地址</span>
                        </div>
                        <el-input v-model="tempLocation.address" readonly></el-input>
                      </div>
                    </div>
                    <div class="confirm-location">
                      <el-button 
                        type="primary" 
                        @click="confirmLocation" 
                        :disabled="!tempLocation.address"
                        class="confirm-btn"
                      >
                        <el-icon><Check /></el-icon>
                        确认位置
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
  
          <!-- 表单操作按钮 -->
          <div class="form-actions">
            <el-button type="primary" @click="submitForm" class="submit-btn">
              <el-icon><Check /></el-icon>提交
            </el-button>
            <el-button @click="handleCancel" class="cancel-btn">
              <el-icon><Close /></el-icon>取消
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { 
    Plus, Location, User, House, 
    Clock, Check, Close, InfoFilled, Search,
    Document, Picture, MapLocation, Lock, Unlock, Delete, Loading
  } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import request from '@/utils/request'
  
  const router = useRouter()
  const formRef = ref(null)
  
  // 表单数据
  const formData = ref({
    name: '',
    type: 'open', // 默认开放景点
    capacity: 200,
    detail: '',
    address: '',
    img: '',
    longitude: '',
    latitude: '',
    start_time: new Date('2000-01-01 00:00:00'),
    end_time: new Date('2000-01-01 23:59:00'),
    album: []
  })
  
  // 相册列表
  const albumList = ref([])
  
  // 临时位置信息
  const tempLocation = ref({
    longitude: '',
    latitude: '',
    address: ''
  })
  
  // 搜索值
  const searchValue = ref('')
  
  // 表单验证规则
  const rules = {
    name: [
      { required: true, message: '请输入景点名称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择景点类型', trigger: 'change' }
    ],
    capacity: [
      { 
        required: true, 
        message: '请输入容量', 
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (formData.value.type === 'reservation' && (!value || value < 200)) {
            callback(new Error('预约景点容量必须大于200人/天'))
          } else {
            callback()
          }
        }
      }
    ],
    detail: [
      { required: true, message: '请输入详细信息', trigger: 'blur' },
      { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
    ],
    img: [
      { required: true, message: '请上传景点封面图片', trigger: 'change' }
    ],
    address: [
      { required: true, message: '请选择景点位置并确认', trigger: 'change' }
    ]
  }
  
  // 处理类型变更
  const handleTypeChange = (value) => {
    formData.value.type = value
    if (value === 'open') {
      // 开放景点设置
      formData.value.capacity = 0
      // 设置为天放
      formData.value.start_time = new Date('2000-01-01 00:00:00')
      formData.value.end_time = new Date('2000-01-01 23:59:00')
    } else {
      // 预约景点设置
      formData.value.capacity = 1
      // 重置时间
      formData.value.start_time = ''
      formData.value.end_time = ''
    }
  }
  
  // 图片上传前验证
  const beforeUpload = (file) => {
    // 检查文件是否存在
    if (!file) {
      ElMessage.error('文件不存在!')
      return false
    }
  
    // 检查文件类型
    const acceptTypes = ['image/jpeg', 'image/png']
    if (!acceptTypes.includes(file.type)) {
      ElMessage.error('只能上传 JPG/PNG 格式的图片!')
      return false
    }
  
    // 检查文件大小
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 2MB!')
      return false
    }
  
    return true
  }
  
  // 相册上传验证
  const beforeAlbumUpload = (file) => {
    // 检查文件否存在
    if (!file) {
      ElMessage.error('文件不存在!')
      return false
    }
  
    // 检查文件类型
    const acceptTypes = ['image/jpeg', 'image/png']
    if (!acceptTypes.includes(file.type)) {
      ElMessage.error('只能上传 JPG/PNG 格式的图片!')
      return false
    }
  
    // 检查文件大小
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 2MB!')
      return false
    }
  
    // 检查上传量
    if (albumList.value.length >= 3) {
      ElMessage.warning('最多能上传3张图片')
      return false
    }
  
    return true
  }
  
  // 地图相关变量
  let map = null
  let marker = null
  let geocoder = null
  
  // 初始化地图
  const initMap = () => {
    try {
      map = new AMap.Map('map-wrapper', {
        zoom: 13,
        center: [113.84, 23.47],  // 设置增城中心坐
        viewMode: '3D',
        pitch: 30,
        mapStyle: 'amap://styles/fresh',
      })
  
      // 创建标记点
      marker = new AMap.Marker({
        draggable: true,
        cursor: 'move',
        animation: 'AMAP_ANIMATION_DROP'
      })
  
      // 加载件
      AMap.plugin([
        'AMap.Geocoder',
        'AMap.Geolocation',
        'AMap.ToolBar',
        'AMap.Scale'
      ], () => {
        // 地理编码插件
        geocoder = new AMap.Geocoder({
          city: "广州",
          radius: 1000
        })
  
        // 添加控件
        map.addControl(new AMap.Geolocation({
          position: 'RB',
          offset: [20, 20],
          zoomToAccuracy: true,
          showButton: true
        }))
  
        map.addControl(new AMap.ToolBar({
          position: 'RB',
          offset: [20, 90],
          ruler: true,
          direction: true,
          locate: false
        }))
  
        map.addControl(new AMap.Scale({
          position: 'LB',
          offset: [20, 20]
        }))
      })
  
      // 点击地图件
      map.on('click', (e) => {
        const lnglat = e.lnglat
        updateMarkerPosition(lnglat)
      })
  
      // 拖拽标记点事件
      marker.on('dragend', (e) => {
        const lnglat = marker.getPosition()
        updateMarkerPosition(lnglat)
      })
  
    } catch (error) {
      console.error('地图初始化败:', error)
      ElMessage.error('地图初始化失败，请刷新页面重试')
    }
  }
  
  // 更新标记点位置
  const updateMarkerPosition = (lnglat) => {
    try {
      marker.setPosition(lnglat)
      map.add(marker)
      
      tempLocation.value.longitude = lnglat.getLng().toFixed(6)
      tempLocation.value.latitude = lnglat.getLat().toFixed(6)
  
      // 逆地理编码取地址
      geocoder.getAddress([lnglat.getLng(), lnglat.getLat()], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          tempLocation.value.address = result.regeocode.formattedAddress
        } else {
          console.error('地址解析失败:', status, result)
          ElMessage.error(`地址解析失败: ${result.info}`)
        }
      })
    } catch (error) {
      console.error('更新位置失败:', error)
      ElMessage.error('更新位置失败，请重试')
    }
  }
  
  // 搜索地址
  const handleSearch = () => {
    if (!searchValue.value) return
    
    geocoder.getLocation(searchValue.value, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        const location = result.geocodes[0].location
        map.setCenter([location.lng, location.lat])
        updateMarkerPosition(new AMap.LngLat(location.lng, location.lat))
      } else {
        ElMessage.warning('未找到该地址')
      }
    })
  }
  
  // 确认位置
  const confirmLocation = () => {
    formData.value.longitude = tempLocation.value.longitude
    formData.value.latitude = tempLocation.value.latitude
    formData.value.address = tempLocation.value.address
    // 触发表单验证
    formRef.value?.validateField('address')
    ElMessage.success('位置已确认')
  }
  
  // 添加临封面URL的响应引
  const tempCoverUrl = ref('')
  
  // 修改封面图片处理函数
  const handleCoverChange = async (file) => {
    // 检查文件
    if (!beforeUpload(file.raw)) {
      return false
    }
  
    // 保存文件对象和预览URL
    formData.value.coverFile = file.raw
    tempCoverUrl.value = URL.createObjectURL(file.raw)
    
    // 触发表单验证
    formRef.value?.validateField('img')
  }
  
  // 修改相册图片处理函数
  const handleAlbumChange = async (file) => {
    // 检查文件
    if (!beforeAlbumUpload(file.raw)) {
      return false
    }
  
    // 创建临时预览对象
    const fileObj = {
      uid: file.uid,
      name: file.name,
      file: file.raw, // 保存文件对象
      url: URL.createObjectURL(file.raw),
      status: 'ready'
    }
    albumList.value.push(fileObj)
  }
  
  // 修改提交表单函数
  const submitForm = async () => {
    try {
      // 表单验证...
      await formRef.value.validate()
  
      // 上传封面图片
      if (formData.value.coverFile) {
        const coverFormData = new FormData()
        coverFormData.append('files', formData.value.coverFile)
  
        const coverRes = await request({
          url: '/api/images/uploadImages',
          method: 'post',
          data: coverFormData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
  
        if (coverRes.status === 200 && coverRes.data?.length > 0) {
          formData.value.img = coverRes.data[0]
        } else {
          throw new Error('封面图片上传失败')
        }
      }
  
      // 上传相册图片
      const albumUrls = []
      for (const item of albumList.value) {
        if (item.file) {
          const albumFormData = new FormData()
          albumFormData.append('files', item.file)
  
          const albumRes = await request({
            url: '/api/images/uploadImages',
            method: 'post',
            data: albumFormData,
            headers: { 'Content-Type': 'multipart/form-data' }
          })
  
          if (albumRes.status === 200 && albumRes.data?.length > 0) {
            albumUrls.push(albumRes.data[0])
            item.status = 'success'
          } else {
            item.status = 'error'
          }
        }
      }
  
      // 构造提交的数据对象
      const submitData = {
        name: formData.value.name,
        capacity: formData.value.type === 'open' ? 0 : formData.value.capacity,
        detail: formData.value.detail,
        address: formData.value.address,
        img: formData.value.img,
        longitude: formData.value.longitude,
        latitude: formData.value.latitude,
        startTime: formData.value.type === 'open' ? '00:00:00' : formData.value.start_time.toTimeString().slice(0, 8),
        endTime: formData.value.type === 'open' ? '23:59:59' : formData.value.end_time.toTimeString().slice(0, 8),
        time: new Date().toISOString().split('T')[0],
        state: 0
      }
  
      // 发送添加景点请求
      const res = await request({
        url: '/scenic/addScenic',
        method: 'post',
        data: submitData
      })
  
      if (res.status === 200) {
        // 插入相册图片
        if (albumUrls.length > 0) {
          for (const imgUrl of albumUrls) {
            await request({
              url: '/api/images/insertImages',
              method: 'post',
              data: {
                otherId: res.data.id,
                path: imgUrl
              }
            })
          }
        }
  
        ElMessage.success('景点添加成功')
        router.push('/scenic')
      } else {
        throw new Error(res.message || '添加失败')
      }
  
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error(error.message || '提交失败，请重试')
    }
  }
  
  // 取消
  const handleCancel = () => {
    router.push('/scenic')
  }
  
  // 组件挂载时初始化地图
  onMounted(() => {
    if (window.AMap) {
      setTimeout(() => {
        initMap()
      }, 100)
    } else {
      ElMessage.error('地图加载失败，请检查网络连接')
    }
  })
  
  // 件卸载时清理地图实例
  onUnmounted(() => {
    if (map) {
      map.destroy()
    }
  })
  
  // 添加封面图片删除处理函数
  const handleCoverRemove = () => {
    tempCoverUrl.value = ''
    formData.value.img = ''
    // 触发表单验证
    formRef.value?.validateField('img')
  }
  
  // 修改相册图片删除处理函数
  const handleAlbumRemove = async (file) => {
    const index = albumList.value.findIndex(item => item.uid === file.uid)
    if (index !== -1) {
      const imageUrl = albumList.value[index].url
      
      try {
        // 如果是临时URL，直接释放
        if (imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imageUrl)
        } else {
          // 如果是已上传的图片，调用后端删除接口
          const imageId = albumList.value[index].id // 假设图片对象中有 id 字段
          if (imageId) {
            const res = await request({
              url: '/api/images/deleteImagesById',
              method: 'post',
              data: {
                id: imageId
              }
            })

            if (res.status !== 200) {
              throw new Error(res.message || '删除失败')
            }
          }

          // 从表单数据中移除对应的URL
          const urlIndex = formData.value.album.indexOf(imageUrl)
          if (urlIndex !== -1) {
            formData.value.album.splice(urlIndex, 1)
          }
        }

        // 从相册列表中移除
        albumList.value.splice(index, 1)
        ElMessage.success('图片已删除')
        
      } catch (error) {
        console.error('删除图片失败:', error)
        ElMessage.error(error.message || '删除失败，请重试')
      }
    }
  }
  </script>
<style scoped>
  @import '@/styles/updateScenic.css';
  
  /* 上传组件样式需要在组件内部定义，以确保正确应用 */
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
    position: relative;
  }
  
  :deep(.el-upload--picture-card) {
    width: 100%;
    height: 100%;
    margin: 0;
    border: 1px dashed #d9d9d9;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    position: relative;
  }
  
  /* 修改上传区域样式 */
  .upload-area {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  /* 上传内容样式 */
  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    pointer-events: none;
  }
  
  .upload-icon, .upload-text {
    pointer-events: none;
  }
  
  :deep(.el-upload-list--picture-card) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  :deep(.el-upload-list__item) {
    width: 148px !important;
    height: 148px !important;
    margin: 0 !important;
  }
  
  :deep(.el-upload-list__item-thumbnail) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }
  
  </style>
  
  
  