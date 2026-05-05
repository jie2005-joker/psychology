import { ElMessage } from 'element-plus'
import axios from 'axios'

const server = axios.create({
  baseURL: '/api',       //基地址
  timeout: 5000          //超时时间
})

// 创建请求拦截器
server.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if(token){
      config.headers['token'] = token
     
    }
     return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 创建响应拦截器
server.interceptors.response.use(
  response => {
    const {data, config} = response
    // console.log("【原始响应】", response);

   if (data.code == 1 || data.success) {
      console.log("【成功响应】", data);
      return data.data; // 成功直接返回数据
    }

    // ============== 核心修改 ==============
    // 失败：code=-1
    if (data.code === "-1") {
      // 只有【非登录接口】才判断是否登录过期
      if (!config.url?.includes("/login") && !config.url?.includes("/register")) {
        ElMessage.error("登录过期，请重新登录");
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        // location.href = "/auth/login";
      } else {
        // 登录 / 注册 接口返回 -1 → 是正常业务失败（账号密码错、注册失败）
        ElMessage.error(data.msg || "操作失败");
      }
      // 统一返回失败
      return Promise.reject(data.msg || "请求失败");
    }
    // 对于所有其他情况，返回完整的响应数据
    return data.data
  },
  error => {
    return Promise.reject(error)
  }
)

// server.interceptors.response.use(
//   response => {
//     console.log("【原始响应】", response);
//     return response.data; 
//   },
//   error => {
//     console.error("【请求报错】", error);
//     return Promise.reject(error);
//   }
// );

export default server