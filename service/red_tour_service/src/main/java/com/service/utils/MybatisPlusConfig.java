package com.service.utils;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration  // 说明下面是配置类
public class MybatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor getMybatisPlusInterceptor() {
        // 创建一个 mybatis plus的 拦截器
        MybatisPlusInterceptor mpi = new MybatisPlusInterceptor();
        // 添加一个分页拦截器
        mpi.addInnerInterceptor(new PaginationInnerInterceptor());

        // 作为函数的返回值
        return mpi;
    }

}
