import router from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
    baseURL: 'http://localhost:8080', // 设置你的baseURL
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        const tokenTime = localStorage.getItem('tokenTime')
        
        if (token) {
            const currentTime = new Date().getTime()
            const storedTime = parseInt(tokenTime) || 0  // 确保转换为数字
            // 7天后过期，跟后端token对应
            if (storedTime && currentTime - storedTime > 604800000) {
                localStorage.removeItem('token')
                localStorage.removeItem('tokenTime')
                localStorage.removeItem('userInfo')
                
                ElMessage.error('登录已过期，请重新登录')
                
                router.push('/login')
                return Promise.reject(new Error('token expired'))
            }
            
            config.headers['Authorization'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        // 直接返回响应的数据部分
        return response.data
    },
    error => {
        // ElMessage.error(error.response?.data?.message || '请求失败')
        return Promise.reject(error)
    }
)

// 添加文件上传方法
request.upload = async (url, file, options = {}) => {
    const formData = new FormData()
    if (Array.isArray(file)) {
        // 如果是数组，处理多文件上传
        file.forEach(f => formData.append(options.name || 'files', f))
    } else {
        // 单文件上传
        formData.append(options.name || 'files', file)
    }

    try {
        const res = await request({
            url,
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...options.headers
            },
            ...options
        })
        return res
    } catch (error) {
        ElMessage.error('文件上传失败')
        throw error
    }
}

export default request
