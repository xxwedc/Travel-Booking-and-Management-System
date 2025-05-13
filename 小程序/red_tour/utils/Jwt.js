// 请求的地址是带api/前缀的则需要token,即需要先登录,才可以访问
// 请求的地址不带api/前缀的则不需要登录也可以访问
const baseUrl = 'http://localhost:8080';

// 添加白名单列表
const whiteList = [
  '/api/updateUserInfo'  // 添加修改密码接口到白名单
];

uni.addInterceptor('request', {
    invoke(requestOptions) {
        if (!requestOptions.url.startsWith('/')) {
            requestOptions.url = '/' + requestOptions.url;
        }
        // 修改判断逻辑，增加白名单检查
        if (requestOptions.url.startsWith('/api') && !whiteList.includes(requestOptions.url)) {
            const token = uni.getStorageSync('token');
            if (!token) {
                uni.showToast({
                    title: '请先进行登录',
                    icon: 'none'
                });
                return false;
            }
            requestOptions.header = requestOptions.header || {};
            requestOptions.header.Authorization = `${token}`;
        }
        requestOptions.url = baseUrl + requestOptions.url;
        return requestOptions;
    },
    success(response) {
        return response;
    },
    fail(error) {
        return error;
    }
});