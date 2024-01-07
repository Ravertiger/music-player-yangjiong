import axios from "axios";
import Vue from "vue";
import qs from "qs";

const http = axios.create({
    baseURL: "http://localhost:6789", //本地测试服务器
    // baseURL: "https://ylmusic.top", //线上服务器
    timeout: 10000,
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        // 请求头添加yltoken(如果有的话)
        const yltoken = localStorage.getItem("yltoken");
        if (yltoken) {
            config.headers["yltoken"] = yltoken;
        }

        // 添加默认的 Content-Type，如果未设置的话
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        // 使用qs库对POST请求的数据进行序列化
        if (config.method === 'post' && config.headers['Content-Type'] === 'application/json;charset=UTF-8') {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        // 如果响应的data.code是416，说明token过期或者token无效 回到登录页
        if (response.data.code === 416) {
            localStorage.removeItem("yltoken");
            Vue.prototype.$toast.error("登录过期，请重新登录");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
        return response;
    }
);

Vue.prototype.$http = http

export default http