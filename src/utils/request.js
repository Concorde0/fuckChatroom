import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
//import router from '@/router'
//定义所有 API 请求的基础 URL
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
})

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err),
)

//相应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // 处理业务失败，给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务器异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    //错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      //router.push('/login')
    }
    // 错误的默认情况
   // ElMessage.error(err.response.message || '服务器异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
